import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Volume2, VolumeX, Globe } from 'lucide-react';
import { useVoice } from '../context/VoiceContext';
import { useVoiceCommand } from '../context/VoiceCommandContext';
import { useLanguage } from '../context/LanguageContext';

const AccessibilityPanel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [textSize, setTextSize] = useState(16);
    const { isEnabled, setIsEnabled, speechRate, setSpeechRate, speak } = useVoice();
    const { registerCommandHandler, unregisterCommandHandler } = useVoiceCommand();
    const { language, changeLanguage, t, LANGUAGES } = useLanguage();

    const applyTextSize = useCallback((size) => {
        setTextSize(size);
        document.documentElement.style.fontSize = `${size}px`;
    }, []);


    // Register voice command handlers
    useEffect(() => {
        registerCommandHandler('increaseSpeed', () => {
            const newRate = Math.min(1.5, speechRate + 0.1);
            setSpeechRate(newRate);
            speak(`${t('speedIncreased')} ${newRate.toFixed(1)}`, true);
        });

        registerCommandHandler('decreaseSpeed', () => {
            const newRate = Math.max(0.5, speechRate - 0.1);
            setSpeechRate(newRate);
            speak(`${t('speedDecreased')} ${newRate.toFixed(1)}`, true);
        });

        registerCommandHandler('enableNarrate', () => {
            setIsEnabled(true);
            speak(t('narrationEnabled'), true);
        });

        registerCommandHandler('disableNarrate', () => {
            speak(t('narrationDisabled'), true);
            setTimeout(() => setIsEnabled(false), 1500);
        });

        // Text size commands
        registerCommandHandler('increaseTextSize', () => {
            const newSize = Math.min(32, textSize + 2);
            applyTextSize(newSize);
            speak(t('textSizeIncreased'), true);
        });

        registerCommandHandler('decreaseTextSize', () => {
            const newSize = Math.max(12, textSize - 2);
            applyTextSize(newSize);
            speak(t('textSizeDecreased'), true);
        });

        return () => {
            unregisterCommandHandler('increaseSpeed');
            unregisterCommandHandler('decreaseSpeed');
            unregisterCommandHandler('enableNarrate');
            unregisterCommandHandler('disableNarrate');
            unregisterCommandHandler('increaseTextSize');
            unregisterCommandHandler('decreaseTextSize');
        };
    }, [registerCommandHandler, unregisterCommandHandler, speechRate, setSpeechRate, setIsEnabled, speak, textSize, applyTextSize, t]);


    return (
        <>
            {/* Accessibility Toggle Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="btn-outline"
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: 0,
                    transform: 'translateY(-50%)',
                    borderRadius: '0 12px 12px 0',
                    padding: '1rem 0.5rem',
                    zIndex: 999,
                    writingMode: 'vertical-rl',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                }}
                title={t('accessibility')}
            >
                ♿ {t('accessibility').toUpperCase()}
            </button>


            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0,0,0,0.7)',
                                zIndex: 1001
                            }}
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ x: -400 }}
                            animate={{ x: 0 }}
                            exit={{ x: -400 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="glass-panel"
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                bottom: 0,
                                width: '350px',
                                padding: '2rem',
                                zIndex: 1002,
                                overflowY: 'auto'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.5rem' }}>♿ {t('accessibility')}</h2>
                                <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Language Selection */}
                            <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Globe size={18} /> {t('language')}
                                </h3>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <button
                                        onClick={() => changeLanguage(LANGUAGES.ENGLISH)}
                                        className={language === LANGUAGES.ENGLISH ? 'btn-primary' : 'btn-outline'}
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                    >
                                        English
                                    </button>
                                    <button
                                        onClick={() => changeLanguage(LANGUAGES.HINDI)}
                                        className={language === LANGUAGES.HINDI ? 'btn-primary' : 'btn-outline'}
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                    >
                                        हिंदी
                                    </button>
                                    <button
                                        onClick={() => changeLanguage(LANGUAGES.TAMIL)}
                                        className={language === LANGUAGES.TAMIL ? 'btn-primary' : 'btn-outline'}
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                    >
                                        தமிழ்
                                    </button>
                                </div>
                            </div>

                            {/* Text Size */}
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>{t('textSize')}</h3>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <button
                                        onClick={() => applyTextSize(Math.max(12, textSize - 2))}
                                        className="btn-outline"
                                        style={{ padding: '0.5rem' }}
                                    >
                                        <ZoomOut size={20} />
                                    </button>
                                    <span style={{ fontSize: '1.25rem', fontWeight: '600', minWidth: '60px', textAlign: 'center' }}>
                                        {textSize}px
                                    </span>
                                    <button
                                        onClick={() => applyTextSize(Math.min(32, textSize + 2))}
                                        className="btn-outline"
                                        style={{ padding: '0.5rem' }}
                                    >
                                        <ZoomIn size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Voice Settings */}
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>{t('voiceNarration')}</h3>
                                <button
                                    onClick={() => setIsEnabled(!isEnabled)}
                                    className={isEnabled ? 'btn-primary' : 'btn-outline'}
                                    style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem' }}
                                >
                                    {isEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                                    <span>{isEnabled ? t('enabled') : t('disabled')}</span>
                                </button>

                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                    {t('speechSpeed')}: {speechRate.toFixed(1)}x
                                </label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="1.5"
                                    step="0.1"
                                    value={speechRate}
                                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            {/* High Contrast (Future) */}
                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                    💡 More accessibility features coming soon: High contrast mode, keyboard navigation, and more!
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default AccessibilityPanel;
