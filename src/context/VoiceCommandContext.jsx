import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage, VOICE_COMMANDS } from './LanguageContext';
import { useVoice } from './VoiceContext';


const VoiceCommandContext = createContext();

export const useVoiceCommand = () => useContext(VoiceCommandContext);

export const VoiceCommandProvider = ({ children }) => {
    const { language, getSpeechRecognitionLang, t } = useLanguage();
    const { isSpeaking, speak } = useVoice();
    const [isListening, setIsListening] = useState(false);

    const [isContinuousMode, setIsContinuousMode] = useState(false);
    const [lastCommand, setLastCommand] = useState('');
    const [commandConfidence, setCommandConfidence] = useState(0);
    const [recognizedText, setRecognizedText] = useState('');
    const [commandHistory, setCommandHistory] = useState([]);
    const [wakeWord, setWakeWord] = useState('hey assistant');
    const [isWakeWordActive, setIsWakeWordActive] = useState(false);

    const recognitionRef = useRef(null);
    const commandHandlersRef = useRef({});
    const restartTimeoutRef = useRef(null);


    // Initialize Speech Recognition
    useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Speech Recognition not supported in this browser');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = getSpeechRecognitionLang(); // Use language-specific setting
        recognition.maxAlternatives = 3;

        recognition.onstart = () => {
            console.log('Voice recognition started in', language);
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const results = event.results;
            const lastResult = results[results.length - 1];
            const transcript = lastResult[0].transcript.toLowerCase().trim();
            const confidence = lastResult[0].confidence;

            setRecognizedText(transcript);
            setCommandConfidence(confidence);

            // Only process final results
            if (lastResult.isFinal) {
                console.log('Recognized:', transcript, 'Confidence:', confidence);

                // Check for wake word if in continuous mode
                if (isContinuousMode && !isWakeWordActive) {
                    if (transcript.includes(wakeWord)) {
                        setIsWakeWordActive(true);
                        setRecognizedText(t('listening'));
                        speakFeedback('Yes?');
                        return;
                    }
                } else {
                    // Process command
                    processCommand(transcript, confidence);

                    // Reset wake word state after command
                    if (isContinuousMode) {
                        setTimeout(() => setIsWakeWordActive(false), 3000);
                    }
                }
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'no-speech') {
                // Restart if in continuous mode
                if (isContinuousMode) {
                    restartRecognition();
                }
            }
        };

        recognition.onend = () => {
            console.log('Voice recognition ended');
            setIsListening(false);

            // Auto-restart in continuous mode
            if (isContinuousMode) {
                restartRecognition();
            }
        };

        recognitionRef.current = recognition;

        // Restart recognition if it's currently listening (language changed)
        if (isListening) {
            try {
                recognition.start();
            } catch (e) {
                console.log('Recognition start error:', e);
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (restartTimeoutRef.current) {
                clearTimeout(restartTimeoutRef.current);
            }
        };
    }, [isContinuousMode, isWakeWordActive, wakeWord, language, getSpeechRecognitionLang, t]);

    const restartRecognition = () => {
        if (restartTimeoutRef.current) {
            clearTimeout(restartTimeoutRef.current);
        }
        restartTimeoutRef.current = setTimeout(() => {
            if (recognitionRef.current && isContinuousMode) {
                try {
                    recognitionRef.current.start();
                } catch (e) {
                    console.log('Recognition already started');
                }
            }
        }, 1000);
    };

    const speakFeedback = (text) => {
        // Use the managed speak function from VoiceContext
        speak(text, true);
    };

    // Pause listening when speaking to avoid feedback loop
    useEffect(() => {
        if (isSpeaking) {
            console.log('TTS Active: Pausing Recognition');
            if (recognitionRef.current && isListening) {
                recognitionRef.current.stop();
            }
        } else if (isContinuousMode && !isListening) {
            console.log('TTS Ended: Resuming Recognition');
            restartRecognition();
        }
    }, [isSpeaking, isContinuousMode, isListening]);

    const processCommand = (transcript, confidence) => {
        // Basic noise filtering - ignore very short transcripts
        if (transcript.length < 2) return;

        setLastCommand(transcript);

        // Add to history
        setCommandHistory(prev => [...prev.slice(-9), {
            text: transcript,
            confidence,
            timestamp: Date.now()
        }]);

        // Parse and execute command
        const command = parseCommand(transcript);
        console.log('Parsed command:', command, 'from transcript:', transcript);

        if (command) {
            executeCommand(command);
        } else {
            console.warn('No command matched for:', transcript);
            // Only speak error if confidence is decent - avoids noise triggering it
            if (confidence > 0.4) {
                const sorryMsg = t('language') === 'भाषा' ? 'क्षमा करें, मुझे यह कमांड समझ नहीं आया' :
                    t('language') === 'மொழி' ? 'மன்னிக்கவும், எனக்கு அந்த கட்டளை புரியவில்லை' :
                        'Sorry, I didn\'t understand that command';
                speakFeedback(sorryMsg);
            }
        }
    };


    const parseCommand = (transcript) => {
        const text = transcript.toLowerCase();

        // Helper function to check if text matches any command in any language
        const matchesCommand = (action) => {
            for (const lang of ['en', 'hi', 'ta']) {
                const commands = VOICE_COMMANDS[lang][action] || [];
                for (const cmd of commands) {
                    if (text.includes(cmd.toLowerCase())) {
                        return true;
                    }
                }
            }
            return false;
        };

        // Upload commands
        if (matchesCommand('upload')) {
            return { action: 'upload', params: {} };
        }

        // Settings commands
        if (matchesCommand('openSettings')) {
            return { action: 'openSettings', params: {} };
        }
        if (matchesCommand('closeSettings')) {
            return { action: 'closeSettings', params: {} };
        }

        // Speed control
        if (matchesCommand('increaseSpeed')) {
            return { action: 'increaseSpeed', params: {} };
        }
        if (matchesCommand('decreaseSpeed')) {
            return { action: 'decreaseSpeed', params: {} };
        }

        // Auto-narrate
        if (matchesCommand('enableNarrate')) {
            return { action: 'enableNarrate', params: {} };
        }
        if (matchesCommand('disableNarrate')) {
            return { action: 'disableNarrate', params: {} };
        }

        // Text size control
        if (matchesCommand('increaseTextSize')) {
            return { action: 'increaseTextSize', params: {} };
        }
        if (matchesCommand('decreaseTextSize')) {
            return { action: 'decreaseTextSize', params: {} };
        }

        // Analysis commands
        if (matchesCommand('analyze')) {
            return { action: 'analyze', params: {} };
        }

        // Chat commands - extract the actual question
        if (text.includes('ask about')) {
            const query = text.replace('ask about', '').trim();
            return { action: 'ask', params: { query } };
        }

        // Multilingual Chat commands (What is / Explain)
        if (matchesCommand('whatIs')) {
            return { action: 'ask', params: { query: text } };
        }
        if (matchesCommand('explain')) {
            return { action: 'ask', params: { query: text } };
        }

        if (text.includes('what is') || text.includes('what are')) {
            const query = text; // Keep the full question
            return { action: 'ask', params: { query } };
        }
        if (text.includes('tell me about')) {
            const query = text.replace('tell me about', '').trim();
            return { action: 'ask', params: { query } };
        }
        if (text.includes('explain')) {
            const query = text; // Keep the full question
            return { action: 'ask', params: { query } };
        }
        if (text.startsWith('why') || text.startsWith('how') || text.startsWith('when') || text.startsWith('where')) {
            const query = text; // Keep the full question
            return { action: 'ask', params: { query } };
        }

        // Help
        if (matchesCommand('help')) {
            return { action: 'help', params: {} };
        }

        // Stop/Cancel
        if (matchesCommand('stop')) {
            return { action: 'stop', params: {} };
        }

        // Repeat
        if (text === 'repeat' || text.includes('say that again')) {
            return { action: 'repeat', params: {} };
        }

        return null;
    };

    const executeCommand = (command) => {
        console.log('Executing command:', command);

        const handler = commandHandlersRef.current[command.action];
        if (handler) {
            handler(command.params);
            speakFeedback(t('done'));

            // Reset wake word state immediately after success in continuous mode
            if (isContinuousMode) {
                setIsWakeWordActive(false);
            }
        } else {
            console.warn('No handler for command:', command.action);
        }
    };


    const registerCommandHandler = useCallback((action, handler) => {
        commandHandlersRef.current[action] = handler;
    }, []);

    const unregisterCommandHandler = useCallback((action) => {
        delete commandHandlersRef.current[action];
    }, []);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
                setRecognizedText(t('listening'));
            } catch (e) {
                console.error('Error starting recognition:', e);
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setRecognizedText('');
            setIsWakeWordActive(false);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const toggleContinuousMode = () => {
        const newMode = !isContinuousMode;
        setIsContinuousMode(newMode);

        if (newMode) {
            startListening();
            speakFeedback(t('language') === 'भाषा' ? 'निरंतर सुनना चालू। कमांड देने के लिए ' + wakeWord + ' बोलें' : t('language') === 'மொழி' ? 'தொடர்ச்சியான கேட்பு இயக்கப்பட்டது. கட்டளைகளை வழங்க ' + wakeWord + ' என்று சொல்லுங்கள்' : 'Continuous listening enabled. Say ' + wakeWord + ' to give commands');
        } else {
            stopListening();
            speakFeedback(t('language') === 'भाषा' ? 'निरंतर सुनना बंद' : t('language') === 'மொழி' ? 'தொடர்ச்சியான கேட்பு முடக்கப்பட்டது' : 'Continuous listening disabled');
        }
    };

    const getAvailableCommands = () => {
        const lang = language || 'en';
        const commands = VOICE_COMMANDS[lang] || VOICE_COMMANDS.en;

        return [
            { command: commands.upload[0], description: t('language') === 'भाषा' ? 'फ़ाइल चयनकर्ता खोलें' : t('language') === 'மொழி' ? 'கோப்பு தேர்வியைத் திறக்கவும்' : 'Open file picker' },
            { command: commands.analyze[0], description: t('language') === 'भाषा' ? 'रिपोर्ट विश्लेषण शुरू करें' : t('language') === 'மொழி' ? 'அறிக்கை பகுப்பாய்வைத் தொடங்கவும்' : 'Start report analysis' },
            { command: commands.openSettings[0], description: t('language') === 'भाषा' ? 'सेटिंग्स पैनल खोलें' : t('language') === 'மொழி' ? 'அமைப்புகள் பேனலைத் திறக்கவும்' : 'Open settings panel' },
            { command: commands.increaseSpeed[0], description: t('language') === 'भाषा' ? 'बोलने की गति बढ़ाएं' : t('language') === 'மொழி' ? 'பேச்சு வேகத்தை அதிகரிக்கவும்' : 'Increase speech speed' },
            { command: commands.increaseTextSize[0], description: t('language') === 'भाषा' ? 'टेक्स्ट बड़ा करें' : t('language') === 'மொழி' ? 'எழுத்து அளவை அதிகரிக்கவும்' : 'Make text bigger' },
            { command: lang === 'hi' ? 'डायबिटीज ' + commands.explain[0] : lang === 'ta' ? 'இரத்த அழுத்தம் ' + commands.explain[0] : 'Explain [topic]', description: t('language') === 'भाषा' ? 'विस्तार से जानकारी प्राप्त करें' : t('language') === 'மொழி' ? 'விரிவான விளக்கத்தைப் பெறுங்கள்' : 'Get detailed explanation' },
            { command: lang === 'hi' ? 'HbA1c ' + commands.whatIs[0] : lang === 'ta' ? 'HbA1c ' + commands.whatIs[0] : 'What is [term]', description: t('language') === 'भाषा' ? 'मेडिकल शब्द का मतलब जानें' : t('language') === 'மொழி' ? 'மருத்துவ சொல்லின் பொருளை அறிந்துகொள்ளுங்கள்' : 'Get explanation of medical term' },
            { command: commands.help[0], description: t('language') === 'भाषा' ? 'उपलब्ध कमांड दिखाएं' : t('language') === 'மொழி' ? 'கிடைக்கும் கட்டளைகளைக் காட்டு' : 'Show available commands' },
            { command: commands.stop[0], description: t('language') === 'भाषा' ? 'वर्तमान क्रिया रोकें' : t('language') === 'மொழி' ? 'தற்போதைய செயலை நிறுத்து' : 'Stop current action' },
        ];
    };


    return (
        <VoiceCommandContext.Provider value={{
            isListening,
            isContinuousMode,
            lastCommand,
            commandConfidence,
            recognizedText,
            commandHistory,
            wakeWord,
            isWakeWordActive,
            startListening,
            stopListening,
            toggleListening,
            toggleContinuousMode,
            registerCommandHandler,
            unregisterCommandHandler,
            getAvailableCommands,
            setWakeWord
        }}>
            {children}
        </VoiceCommandContext.Provider>
    );
};
