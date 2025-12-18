import React from 'react';
import { FileText, Cpu, ShieldCheck } from 'lucide-react';

const Hero = () => {
    return (
        <div style={{ textAlign: 'center', padding: '4rem 0 2rem' }} className="animate-fade-in">
            <div style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                background: 'rgba(56, 189, 248, 0.1)',
                color: 'var(--color-primary)',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                fontWeight: '600'
            }}>
                ✨ Powered by Local Ollama & Gemini Pro
            </div>

            <h1 style={{
                fontSize: '3.5rem',
                marginBottom: '1.5rem',
                background: 'linear-gradient(to right, #fff, #94a3b8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                Understand Your Medical Reports <br />
                <span style={{ color: 'var(--color-primary)', WebkitTextFillColor: 'initial' }}>Instantly & Privately</span>
            </h1>

            <p style={{
                fontSize: '1.125rem',
                color: 'var(--color-text-muted)',
                marginBottom: '3rem',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto'
            }}>
                Strictly local OCR extraction and standard explanations powered by your local LLM.
                Ask follow-up questions with cloud assistance.
            </p>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem',
                marginTop: '3rem'
            }}>
                <Feature icon={<FileText color="#38bdf8" />} title="OCR Extraction" desc="Tesseract.js In-Browser" />
                <Feature icon={<Cpu color="#818cf8" />} title="Local AI" desc="Ollama Privacy" />
                <Feature icon={<ShieldCheck color="#2dd4bf" />} title="Voice Assist" desc="Accessible" />
            </div>
        </div>
    );
};

const Feature = ({ icon, title, desc }) => (
    <div className="glass-panel" style={{
        padding: '1.5rem',
        width: '200px',
        textAlign: 'left',
        transition: 'transform 0.2s'
    }}>
        <div style={{ marginBottom: '1rem' }}>{icon}</div>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{title}</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{desc}</p>
    </div>
);

export default Hero;
