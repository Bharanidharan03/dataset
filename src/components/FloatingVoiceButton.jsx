import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { useVoice } from '../context/VoiceContext';
import { useVoiceCommand } from '../context/VoiceCommandContext';

const FloatingVoiceButton = () => {
    const { isSpeaking, toggle, speak } = useVoice();
    const { isListening, toggleListening, isContinuousMode, toggleContinuousMode } = useVoiceCommand();
    const [mode, setMode] = useState('tts'); // 'tts' or 'command'

    const handleClick = () => {
        if (mode === 'tts') {
            if (isSpeaking) {
                toggle();
            } else {
                speak("Tap on any card to hear details. Upload a report to get started. Or say upload to select a file.", true);
            }
        } else {
            toggleListening();
        }
    };

    const handleLongPress = () => {
        setMode(mode === 'tts' ? 'command' : 'tts');
        speak(mode === 'tts' ? 'Voice command mode activated' : 'Text to speech mode activated', true);
    };

    return (
        <motion.button
            onClick={handleClick}
            onContextMenu={(e) => {
                e.preventDefault();
                handleLongPress();
            }}
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: mode === 'command'
                    ? 'linear-gradient(135deg, #8b5cf6, #ec4899)'
                    : 'linear-gradient(135deg, #f59e0b, #ef4444)',
                border: 'none',
                boxShadow: mode === 'command'
                    ? '0 8px 30px rgba(139, 92, 246, 0.4)'
                    : '0 8px 30px rgba(245, 158, 11, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 1000
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={(mode === 'tts' && !isSpeaking) || (mode === 'command' && !isListening) ? {
                boxShadow: mode === 'command' ? [
                    '0 8px 30px rgba(139, 92, 246, 0.4)',
                    '0 8px 40px rgba(139, 92, 246, 0.8)',
                    '0 8px 30px rgba(139, 92, 246, 0.4)'
                ] : [
                    '0 8px 30px rgba(245, 158, 11, 0.4)',
                    '0 8px 40px rgba(245, 158, 11, 0.8)',
                    '0 8px 30px rgba(245, 158, 11, 0.4)'
                ]
            } : {}}
            transition={{
                boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }
            }}
        >
            <AnimatePresence mode="wait">
                {mode === 'tts' ? (
                    isSpeaking ? (
                        <motion.div
                            key="speaking"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            <VolumeX size={32} color="white" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="idle"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            <Volume2 size={32} color="white" />
                        </motion.div>
                    )
                ) : (
                    isListening ? (
                        <motion.div
                            key="listening"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            <Mic size={32} color="white" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="mic-off"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            <MicOff size={32} color="white" />
                        </motion.div>
                    )
                )}
            </AnimatePresence>

            {/* Pulsing ring */}
            {((mode === 'tts' && !isSpeaking) || (mode === 'command' && !isListening)) && (
                <motion.div
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        border: mode === 'command' ? '3px solid #8b5cf6' : '3px solid #f59e0b',
                        opacity: 0.6
                    }}
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.6, 0, 0.6]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut"
                    }}
                />
            )}

            {/* Mode indicator badge */}
            <div style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: mode === 'command' ? '#8b5cf6' : '#f59e0b',
                border: '2px solid #0a0a0f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 'bold'
            }}>
                {mode === 'command' ? '🎤' : '🔊'}
            </div>
        </motion.button>
    );
};

export default FloatingVoiceButton;
