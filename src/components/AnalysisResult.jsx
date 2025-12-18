import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { generateOllamaResponse } from '../services/ollama';
import { RefreshCw, AlertTriangle, FileText, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useVoice } from '../context/VoiceContext';
import { useLanguage } from '../context/LanguageContext';
import HealthDashboard from './HealthDashboard';

const AnalysisResult = ({ text, analysis, setAnalysis, settings, structuredData }) => {
    const { t, getAILanguageInstruction } = useLanguage();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { speak, autoNarrate } = useVoice();


    const analyze = async () => {
        if (!text || !settings.ollamaModel) return;

        setLoading(true);
        setError(null);
        try {
            // Prompt Engineering for Medical Report
            const prompt = `
        You are a helpful medical assistant. 
        Analyze the following medical report text and explain it in simple, easy-to-understand language for a patient.
        Break it down into:
        1. **Summary**: What is this report about?
        2. **Key Findings**: Important values or observations.
        3. Simplified Explanation: Explain any medical jargon.
        4. Recommendations: General healthy lifestyle tips relevant to these findings (add a disclaimer).

        Report Text:
        "${text}"
      `;

            const result = await generateOllamaResponse(prompt, settings.ollamaModel, settings.ollamaUrl, getAILanguageInstruction());
            setAnalysis(result);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (text && !analysis && !loading) {
            analyze();
        }
    }, [text]);

    // Auto-narrate when analysis is ready
    useEffect(() => {
        if (analysis && autoNarrate) {
            setTimeout(() => {
                speak("Your medical report analysis is ready. Here's what I found: " + analysis.substring(0, 500), true);
            }, 500);
        }
    }, [analysis]);

    return (
        <div className="glass-panel" style={{ padding: '2rem', height: '600px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={24} color="var(--color-primary)" /> {t('language') === 'भाषा' ? 'रिपोर्ट विश्लेषण' : t('language') === 'மொழி' ? 'அறிக்கை பகுப்பாய்வு' : 'Report Analysis'}
                </h2>
                {analysis && (
                    <button onClick={analyze} className="btn-outline" style={{ padding: '0.5rem', borderRadius: '8px' }}>
                        <RefreshCw size={16} />
                    </button>
                )}
            </div>

            {loading && (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <RefreshCw className="animate-spin" size={48} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
                    <p>Consulting local AI model...</p>
                </div>
            )}

            {error && (
                <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', marginBottom: '0.5rem' }}>
                        <AlertTriangle size={18} /> Analysis Failed
                    </h4>
                    <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        Ensure Ollama is running (`ollama serve`) and CORS is allowed. <br />
                        Try setting `OLLAMA_ORIGINS="*"` environment variable for Ollama.
                    </p>
                    <button onClick={analyze} className="btn-primary" style={{ marginTop: '1rem', fontSize: '0.875rem' }}>Retry</button>
                </div>
            )}

            {analysis && !loading && (
                <>
                    <div className="markdown-content">
                        <ReactMarkdown>{analysis}</ReactMarkdown>
                    </div>
                    <HealthDashboard analysis={analysis} structuredData={structuredData} />

                </>
            )}

            {!analysis && !loading && !error && (
                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '4rem' }}>
                    Detailed analysis will appear here.
                </p>
            )}
        </div>
    );
};

export default AnalysisResult;
