import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, Sparkles, User, Bot, VolumeX } from 'lucide-react';
import { generateGeminiResponse } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { useVoiceCommand } from '../context/VoiceCommandContext';
import { useVoice } from '../context/VoiceContext';
import { useLanguage } from '../context/LanguageContext';

const ChatAssistant = ({ context, analysis, settings }) => {
    const { t, getAILanguageInstruction } = useLanguage();
    const [messages, setMessages] = useState([
        { role: 'model', content: t('chatAssistant') + ". " + (t('language') === 'भाषा' ? 'नमस्ते! मैं आपका मेडिकल असिस्टेंट हूँ। आप मुझसे अपनी रिपोर्ट के बारे में सवाल पूछ सकते हैं।' : t('language') === 'மொழி' ? 'வணக்கம்! நான் உங்கள் மருத்துவ உதவியாளர். உங்கள் அறிக்கையைப் பற்றி என்னிடம் கேள்விகளைக் கேட்கலாம்.' : "Hi! I'm your medical assistant. You can ask me questions about your report.") }
    ]);

    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [listening, setListening] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    const messagesEndRef = useRef(null);
    const { registerCommandHandler, unregisterCommandHandler } = useVoiceCommand();
    const { speak } = useVoice();

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Speech Recognition Setup
    const recognitionRef = useRef(null);
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech Recognition Error", event.error);
                setListening(false);
            };

            recognitionRef.current.onend = () => {
                setListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (listening) {
            recognitionRef.current?.stop();
            setListening(false);
        } else {
            recognitionRef.current?.start();
            setListening(true);
        }
    };

    const speakText = (text) => {
        if (speaking) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
            return;
        }

        if (!text) return;

        // Strip markdown for speech
        const cleanText = text.replace(/[*#_]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.onend = () => setSpeaking(false);
        setSpeaking(true);
        window.speechSynthesis.speak(utterance);
    };

    const handleSend = async (questionText = null) => {
        const questionToSend = questionText || input;
        if (!questionToSend.trim() || !settings.geminiKey) {
            if (!settings.geminiKey) {
                speak('Please configure your Gemini API key in settings first', true);
            }
            return;
        }

        const userMsg = { role: 'user', content: questionToSend };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Create context prompt
            const fullPrompt = `
        Context (Medical Report Content): "${context.substring(0, 1000)}..."
        Previous Analysis: "${analysis ? analysis.substring(0, 500) : ''}..."
        
        User Question: ${questionToSend}
        
        Answer the user's question safely and helpfully based on the report context. 
        If it's a medical advice request, advise consulting a doctor.
      `;

            // Pass language instruction for multilingual response
            const responseText = await generateGeminiResponse(
                settings.geminiKey,
                [], // Empty history
                fullPrompt,
                context,
                getAILanguageInstruction()
            );

            setMessages(prev => [...prev, { role: 'model', content: responseText }]);
            speak('I have an answer for you', true);
        } catch (err) {
            const errorMsg = "Error: " + err.message;
            setMessages(prev => [...prev, { role: 'model', content: errorMsg }]);
            speak('Sorry, there was an error processing your question', true);
        } finally {
            setLoading(false);
        }
    };

    // Register voice command handlers
    useEffect(() => {
        registerCommandHandler('chat', (params) => {
            if (params.query) {
                speak(`Asking about ${params.query}`, true);
                handleSend(params.query);
            }
        });

        registerCommandHandler('ask', (params) => {
            if (params.query) {
                speak(`Asking: ${params.query}`, true);
                handleSend(params.query);
            }
        });

        return () => {
            unregisterCommandHandler('chat');
            unregisterCommandHandler('ask');
        };
    }, [registerCommandHandler, unregisterCommandHandler, context, analysis, settings, speak]);

    return (
        <div className="glass-panel" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '600px', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Sparkles size={20} color="#fbbf24" />
                <h3 style={{ margin: 0 }}>{t('chatAssistant')}</h3>
            </div>

            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        display: 'flex',
                        gap: '1rem',
                        marginBottom: '1.5rem',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                    }}>
                        {msg.role === 'model' && (
                            <div style={{
                                minWidth: '32px', height: '32px', borderRadius: '50%',
                                background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Bot size={18} color="white" />
                            </div>
                        )}

                        <div style={{
                            background: msg.role === 'user' ? 'var(--color-surface)' : 'rgba(255,255,255,0.05)',
                            padding: '1rem',
                            borderRadius: '12px',
                            borderTopLeftRadius: msg.role === 'model' ? '2px' : '12px',
                            borderTopRightRadius: msg.role === 'user' ? '2px' : '12px',
                            maxWidth: '80%'
                        }}>
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                            {msg.role === 'model' && (
                                <button
                                    onClick={() => speakText(msg.content)}
                                    style={{ background: 'none', border: 'none', marginTop: '0.5rem', opacity: 0.6, cursor: 'pointer' }}
                                    title="Read Aloud"
                                >
                                    {speaking ? <VolumeX size={14} color="white" /> : <Volume2 size={14} color="white" />}
                                </button>
                            )}
                        </div>

                        {msg.role === 'user' && (
                            <div style={{
                                minWidth: '32px', height: '32px', borderRadius: '50%',
                                background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <User size={18} color="var(--color-text-muted)" />
                            </div>
                        )}
                    </div>
                ))}
                {loading && <div style={{ marginLeft: '3rem', opacity: 0.5 }}>Typing...</div>}
                <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '0.75rem' }}>
                <button
                    onClick={toggleListening}
                    className={`btn-outline ${listening ? 'listening' : ''}`}
                    style={{
                        borderRadius: '50%', width: '48px', height: '48px', padding: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderColor: listening ? '#ef4444' : 'var(--color-border)',
                        color: listening ? '#ef4444' : 'var(--color-text)'
                    }}
                >
                    {listening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                <input
                    type="text"
                    placeholder={t('askQuestion')}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    style={{
                        flex: 1,
                        background: 'rgba(0,0,0,0.2)',
                        border: 'none',
                        borderRadius: '24px',
                        padding: '0 1.5rem',
                        color: 'white',
                        outline: 'none'
                    }}
                />

                <button
                    onClick={handleSend}
                    className="btn-primary"
                    style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
};

export default ChatAssistant;
