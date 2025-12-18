import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Volume2, MessageCircle, Settings, X } from 'lucide-react';
import { useVoice } from '../context/VoiceContext';

const OnboardingTutorial = () => {
    const [show, setShow] = useState(false);
    const [step, setStep] = useState(0);
    const { speak } = useVoice();

    useEffect(() => {
        // Check if user has seen tutorial
        const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
        if (!hasSeenTutorial) {
            setTimeout(() => {
                setShow(true);
                speak("Welcome to MediScan AI! Let me show you how to use this app.", true);
            }, 1000);
        }
    }, []);

    const steps = [
        {
            icon: <Upload size={48} color="#38bdf8" />,
            title: "Upload Your Report",
            description: "Drag and drop or click to upload a medical report image (JPG, PNG). We'll extract the text automatically.",
            voice: "Step 1: Upload your medical report image"
        },
        {
            icon: <Volume2 size={48} color="#f59e0b" />,
            title: "Listen to Analysis",
            description: "Your report will be analyzed by your local AI. The results will be read aloud automatically. You can tap the floating voice button anytime.",
            voice: "Step 2: Listen to the AI analysis of your report"
        },
        {
            icon: <MessageCircle size={48} color="#818cf8" />,
            title: "Ask Questions",
            description: "Use the chat assistant to ask follow-up questions. You can type or use voice input by clicking the microphone.",
            voice: "Step 3: Ask questions using voice or text"
        },
        {
            icon: <Settings size={48} color="#2dd4bf" />,
            title: "Accessibility Settings",
            description: "Click the Accessibility button on the left to adjust text size and voice speed. Perfect for elderly users!",
            voice: "Step 4: Customize accessibility settings for your comfort"
        }
    ];

    const handleNext = () => {
        if (step < steps.length - 1) {
            const nextStep = step + 1;
            setStep(nextStep);
            speak(steps[nextStep].voice, true);
        } else {
            handleClose();
        }
    };

    const handleClose = () => {
        setShow(false);
        localStorage.setItem('hasSeenTutorial', 'true');
        speak("Tutorial complete! Upload a report to get started.", true);
    };

    if (!show) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.85)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    padding: '2rem'
                }}
            >
                <motion.div
                    initial={{ scale: 0.8, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.8, y: 50 }}
                    className="glass-panel"
                    style={{
                        maxWidth: '600px',
                        width: '100%',
                        padding: '3rem',
                        textAlign: 'center',
                        position: 'relative'
                    }}
                >
                    <button
                        onClick={handleClose}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={24} />
                    </button>

                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div style={{ marginBottom: '2rem' }}>
                            {steps[step].icon}
                        </div>

                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                            {steps[step].title}
                        </h2>

                        <p style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
                            {steps[step].description}
                        </p>

                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
                            {steps.map((_, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        width: idx === step ? '32px' : '8px',
                                        height: '8px',
                                        borderRadius: '4px',
                                        background: idx === step ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)',
                                        transition: 'all 0.3s'
                                    }}
                                />
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button onClick={handleClose} className="btn-outline">
                                Skip Tutorial
                            </button>
                            <button onClick={handleNext} className="btn-primary">
                                {step === steps.length - 1 ? 'Get Started' : 'Next'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default OnboardingTutorial;
