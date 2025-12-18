import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

// Language configurations
export const LANGUAGES = {
    ENGLISH: 'en',
    HINDI: 'hi',
    TAMIL: 'ta'
};

// Voice command translations
export const VOICE_COMMANDS = {
    en: {
        upload: ['upload', 'select file', 'choose file', 'upload file'],
        analyze: ['analyze', 'start analysis', 'analyze report'],
        increaseSpeed: ['increase speed', 'faster', 'speed up'],
        decreaseSpeed: ['decrease speed', 'slower', 'slow down'],
        increaseTextSize: ['increase text', 'bigger text', 'larger text', 'make text bigger', 'zoom in', 'text bigger'],
        decreaseTextSize: ['decrease text', 'smaller text', 'make text smaller', 'zoom out', 'text smaller'],
        enableNarrate: ['enable narrate', 'enable narration', 'turn on narration'],
        disableNarrate: ['disable narrate', 'disable narration', 'turn off narration'],
        openSettings: ['settings', 'open settings'],
        closeSettings: ['close settings', 'go back'],
        help: ['help', 'what can you do'],
        stop: ['stop', 'cancel'],
    },
    hi: {
        upload: ['अपलोड करें', 'फ़ाइल चुनें', 'फाइल अपलोड करें', 'अपलोड', 'चुनें', 'फाइल लाओ'],
        analyze: ['विश्लेषण करें', 'विश्लेषण शुरू करें', 'रिपोर्ट का विश्लेषण करें', 'चेक करें', 'जांचें', 'जांच शुरू करें'],
        increaseSpeed: ['गति बढ़ाएं', 'तेज़', 'तेज़ करें', 'स्पीड बढ़ाओ', 'रफ़्तार बढ़ाओ'],
        decreaseSpeed: ['गति कम करें', 'धीमा', 'धीमा करें', 'स्पीड कम करो', 'रफ़्तार कम करो'],
        increaseTextSize: ['टेक्स्ट बड़ा करें', 'अक्षर बड़े करें', 'ज़ूम इन', 'बड़ा करो', 'ज़ूम'],
        decreaseTextSize: ['टेक्स्ट छोटा करें', 'अक्षर छोटे करें', 'ज़ूम आउट', 'छोटा करो', 'कम ज़ूम'],
        enableNarrate: ['वर्णन चालू करें', 'नैरेशन चालू करें', 'आवाज़ चालू करो', 'पढ़ना शुरू करें'],
        disableNarrate: ['वर्णन बंद करें', 'नैरेशन बंद करें', 'आवाज़ बंद करो', 'पढ़ना बंद करें'],
        openSettings: ['सेटिंग्स', 'सेटिंग्स खोलें', 'कॉन्फ़िगरेशन'],
        closeSettings: ['सेटिंग्स बंद करें', 'वापस जाओ', 'बंद करें'],
        help: ['मदद', 'सहायता', 'आप क्या कर सकते हैं', 'जानकारी'],
        stop: ['रोको', 'बंद करो', 'रद्द करो', 'बस'],
        whatIs: ['क्या है', 'क्या होता है', 'मतलब बताएं', 'किसे कहते हैं'],
        explain: ['समझाएं', 'विस्तार से बताएं', 'व्याख्या करें', 'इसके बारे में बताओ'],
    },
    ta: {
        upload: ['பதிவேற்று', 'கோப்பு தேர்வு செய்', 'கோப்பை பதிவேற்று', 'அப்லோட்', 'தேர்ந்தெடு'],
        analyze: ['பகுப்பாய்வு செய்', 'பகுப்பாய்வு தொடங்கு', 'அறிக்கை பகுப்பாய்வு', 'சோதனை செய்', 'ரிப்போர்ட் பார்'],
        increaseSpeed: ['வேகம் அதிகரி', 'வேகமாக', 'ஸ்பீட் அதிகரி', 'வேகத்தை கூட்டு'],
        decreaseSpeed: ['வேகம் குறை', 'மெதுவாக', 'ஸ்பீட் குறை', 'வேகத்தை குறை'],
        increaseTextSize: ['எழுத்து பெரிதாக்கு', 'பெரிய எழுத்து', 'ஜூம் இன்', 'பெரிதாக்கு', 'ஜூம்'],
        decreaseTextSize: ['எழுத்து சிறிதாக்கு', 'சிறிய எழுத்து', 'ஜூம் அவுட்', 'சிறிதாக்கு', 'சுருக்கு'],
        enableNarrate: ['விவரணம் இயக்கு', 'குரல் இயக்கு', 'நேரேஷன் ஆன்', 'கதை சொல்', 'வாசிக்கவும்'],
        disableNarrate: ['விவரணம் நிறுத்து', 'குரல் நிறுத்து', 'நேரேஷன் ஆஃப்', 'வாசிப்பதை நிறுத்து'],
        openSettings: ['அமைப்புகள்', 'செட்டிங்ஸ் திற', 'பயன்பாடு'],
        closeSettings: ['அமைப்புகள் மூடு', 'பின் செல்', 'மூடு'],
        help: ['உதவி', 'நீங்கள் என்ன செய்ய முடியும்', 'தகவல்'],
        stop: ['நிறுத்து', 'ரத்து செய்', 'போதும்'],
        whatIs: ['என்ன', 'என்றால் என்ன', 'பொருள் கூறு', 'விளக்கம்'],
        explain: ['விவரி', 'விளக்கு', 'பிரித்து கூறு', 'தெளிவாக கூறு'],
    }
};


// UI translations
export const UI_TRANSLATIONS = {
    en: {
        // Settings
        language: 'Language',
        selectLanguage: 'Select Language',
        english: 'English',
        hindi: 'हिंदी (Hindi)',
        tamil: 'தமிழ் (Tamil)',

        // Accessibility
        accessibility: 'Accessibility',
        textSize: 'Text Size',
        voiceNarration: 'Voice Narration',
        enabled: 'Enabled',
        disabled: 'Disabled',
        speechSpeed: 'Speech Speed',

        // Voice Commands
        listening: 'Listening...',
        voiceCommandsAvailable: 'Voice Commands Available',
        sayCommand: 'Say a command',

        // Chat
        askQuestion: 'Ask a question...',
        chatAssistant: 'Smart Assistance',

        // Feedback
        done: 'Done',
        languageChanged: 'Language changed to',
        speedIncreased: 'Speech speed increased',
        speedDecreased: 'Speech speed decreased',
        textSizeIncreased: 'Text size increased',
        textSizeDecreased: 'Text size decreased',
        narrationEnabled: 'Voice narration enabled',
        narrationDisabled: 'Voice narration disabled',
    },
    hi: {
        // Settings
        language: 'भाषा',
        selectLanguage: 'भाषा चुनें',
        english: 'English (अंग्रेज़ी)',
        hindi: 'हिंदी',
        tamil: 'தமிழ் (तमिल)',

        // Accessibility
        accessibility: 'सुलभता',
        textSize: 'टेक्स्ट का आकार',
        voiceNarration: 'आवाज़ वर्णन',
        enabled: 'चालू',
        disabled: 'बंद',
        speechSpeed: 'बोलने की गति',

        // Voice Commands
        listening: 'सुन रहा हूँ...',
        voiceCommandsAvailable: 'आवाज़ कमांड उपलब्ध हैं',
        sayCommand: 'एक कमांड बोलें',

        // Chat
        askQuestion: 'एक सवाल पूछें...',
        chatAssistant: 'स्मार्ट सहायक',

        // Feedback
        done: 'हो गया',
        languageChanged: 'भाषा बदल गई',
        speedIncreased: 'बोलने की गति बढ़ गई',
        speedDecreased: 'बोलने की गति कम हो गई',
        textSizeIncreased: 'टेक्स्ट का आकार बढ़ गया',
        textSizeDecreased: 'टेक्स्ट का आकार कम हो गया',
        narrationEnabled: 'आवाज़ वर्णन चालू हो गया',
        narrationDisabled: 'आवाज़ वर्णन बंद हो गया',
    },
    ta: {
        // Settings
        language: 'மொழி',
        selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
        english: 'English (ஆங்கிலம்)',
        hindi: 'हिंदी (இந்தி)',
        tamil: 'தமிழ்',

        // Accessibility
        accessibility: 'அணுகல்தன்மை',
        textSize: 'எழுத்து அளவு',
        voiceNarration: 'குரல் விவரணம்',
        enabled: 'இயக்கப்பட்டது',
        disabled: 'முடக்கப்பட்டது',
        speechSpeed: 'பேச்சு வேகம்',

        // Voice Commands
        listening: 'கேட்கிறது...',
        voiceCommandsAvailable: 'குரல் கட்டளைகள் கிடைக்கின்றன',
        sayCommand: 'ஒரு கட்டளை சொல்லுங்கள்',

        // Chat
        askQuestion: 'ஒரு கேள்வி கேளுங்கள்...',
        chatAssistant: 'ஸ்மார்ட் உதவியாளர்',

        // Feedback
        done: 'முடிந்தது',
        languageChanged: 'மொழி மாற்றப்பட்டது',
        speedIncreased: 'பேச்சு வேகம் அதிகரித்தது',
        speedDecreased: 'பேச்சு வேகம் குறைந்தது',
        textSizeIncreased: 'எழுத்து அளவு அதிகரித்தது',
        textSizeDecreased: 'எழுத்து அளவு குறைந்தது',
        narrationEnabled: 'குரல் விவரணம் இயக்கப்பட்டது',
        narrationDisabled: 'குரல் விவரணம் முடக்கப்பட்டது',
    }
};

// Speech recognition language codes
export const SPEECH_RECOGNITION_LANG = {
    en: 'en-US',
    hi: 'hi-IN',
    ta: 'ta-IN'
};

// AI prompt language instructions
export const AI_LANGUAGE_INSTRUCTIONS = {
    en: 'Please respond in English.',
    hi: 'कृपया हिंदी में जवाब दें। Please respond in Hindi language.',
    ta: 'தயவுசெய்து தமிழில் பதிலளிக்கவும். Please respond in Tamil language.'
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('preferredLanguage');
        return saved || LANGUAGES.ENGLISH;
    });

    useEffect(() => {
        localStorage.setItem('preferredLanguage', language);
    }, [language]);

    const changeLanguage = (newLanguage) => {
        setLanguage(newLanguage);
    };

    const t = (key) => {
        return UI_TRANSLATIONS[language]?.[key] || UI_TRANSLATIONS.en[key] || key;
    };

    const getVoiceCommands = (action) => {
        return VOICE_COMMANDS[language]?.[action] || VOICE_COMMANDS.en[action] || [];
    };

    const getSpeechRecognitionLang = () => {
        return SPEECH_RECOGNITION_LANG[language] || SPEECH_RECOGNITION_LANG.en;
    };

    const getAILanguageInstruction = () => {
        return AI_LANGUAGE_INSTRUCTIONS[language] || AI_LANGUAGE_INSTRUCTIONS.en;
    };

    return (
        <LanguageContext.Provider value={{
            language,
            changeLanguage,
            t,
            getVoiceCommands,
            getSpeechRecognitionLang,
            getAILanguageInstruction,
            LANGUAGES
        }}>
            {children}
        </LanguageContext.Provider>
    );
};
