import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { useVoiceCommand } from '../context/VoiceCommandContext';
import { useLanguage } from '../context/LanguageContext';
import VoiceWaveform from './VoiceWaveform';

const VoiceCommandPanel = () => {
    const { t } = useLanguage();
    const {
        isListening,
        isContinuousMode,
        recognizedText,
        commandConfidence,
        lastCommand,
        commandHistory,
        wakeWord,
        isWakeWordActive,
        getAvailableCommands
    } = useVoiceCommand();

    const [showCommands, setShowCommands] = useState(false);

    const availableCommands = getAvailableCommands();


    // Don't show panel if not listening
    if (!isListening && !isContinuousMode) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
                position: 'fixed',
                top: '80px',
                right: '2rem',
                zIndex: 999,
                maxWidth: '350px'
            }}
        >
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                {/* Status Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <motion.div
                        animate={{
                            scale: isListening ? [1, 1.2, 1] : 1,
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: isListening ? Infinity : 0,
                            ease: "easeInOut"
                        }}
                    >
                        {isListening ? (
                            <Mic size={24} color="#f59e0b" />
                        ) : (
                            <MicOff size={24} color="#6b7280" />
                        )}
                    </motion.div>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                            {isWakeWordActive ? (t('done') + ' / ' + (t('language') === 'भाषा' ? 'कमांड के लिए तैयार' : t('language') === 'மொழி' ? 'கட்டளைக்கு தயார்' : 'Ready for Command')) :
                                isContinuousMode ? `🎤 ${t('sayCommand')} "${wakeWord}"` :
                                    `🎤 ${t('listening')}`}
                        </h4>
                        {isContinuousMode && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
                                Continuous mode active
                            </p>
                        )}
                    </div>
                </div>

                {/* Waveform */}
                <div style={{ marginBottom: '1rem' }}>
                    <VoiceWaveform isActive={isListening} amplitude={commandConfidence} />
                </div>

                {/* Recognized Text */}
                <AnimatePresence mode="wait">
                    {recognizedText && (
                        <motion.div
                            key={recognizedText}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            style={{
                                background: 'rgba(245, 158, 11, 0.1)',
                                border: '1px solid rgba(245, 158, 11, 0.3)',
                                borderRadius: '8px',
                                padding: '0.75rem',
                                marginBottom: '1rem'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
                                <Volume2 size={16} color="#f59e0b" style={{ marginTop: '2px', flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.4' }}>
                                        "{recognizedText}"
                                    </p>
                                    {commandConfidence > 0 && (
                                        <div style={{ marginTop: '0.5rem' }}>
                                            <div style={{
                                                height: '3px',
                                                background: 'rgba(255,255,255,0.1)',
                                                borderRadius: '2px',
                                                overflow: 'hidden'
                                            }}>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${commandConfidence * 100}%` }}
                                                    style={{
                                                        height: '100%',
                                                        background: commandConfidence > 0.7 ? '#10b981' :
                                                            commandConfidence > 0.4 ? '#f59e0b' : '#ef4444',
                                                        borderRadius: '2px'
                                                    }}
                                                />
                                            </div>
                                            <p style={{
                                                fontSize: '0.7rem',
                                                color: 'var(--color-text-muted)',
                                                margin: '0.25rem 0 0 0'
                                            }}>
                                                Confidence: {Math.round(commandConfidence * 100)}%
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Command Suggestions */}
                <div>
                    <button
                        onClick={() => setShowCommands(!showCommands)}
                        style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '6px',
                            padding: '0.5rem 0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            color: 'inherit',
                            fontSize: '0.8rem'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Lightbulb size={14} />
                            <span>{t('voiceCommandsAvailable')}</span>
                        </div>
                        {showCommands ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    <AnimatePresence>
                        {showCommands && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div style={{
                                    marginTop: '0.5rem',
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                    padding: '0.5rem'
                                }}>
                                    {availableCommands.map((cmd, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                padding: '0.5rem',
                                                marginBottom: '0.25rem',
                                                background: 'rgba(255,255,255,0.03)',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            <div style={{
                                                color: '#f59e0b',
                                                fontWeight: '600',
                                                marginBottom: '0.15rem'
                                            }}>
                                                "{cmd.command}"
                                            </div>
                                            <div style={{ color: 'var(--color-text-muted)' }}>
                                                {cmd.description}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Recent Commands */}
                {commandHistory.length > 0 && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                            Recent Commands
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {commandHistory.slice(-3).reverse().map((cmd, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        fontSize: '0.7rem',
                                        color: 'var(--color-text-muted)',
                                        padding: '0.25rem 0.5rem',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '4px'
                                    }}
                                >
                                    {cmd.text}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default VoiceCommandPanel;
