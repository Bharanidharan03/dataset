import React, { useState } from 'react';
import { X, Save, Key, Server, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const SettingsModal = ({ settings, onSave, onClose }) => {
    const { language, changeLanguage, t, LANGUAGES } = useLanguage();
    const [localSettings, setLocalSettings] = useState(settings);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(localSettings);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100
        }}>
            <div className="glass-panel" style={{ width: '500px', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <h3>{t('selectLanguage')} / Configuration</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Globe size={16} /> {t('language')}
                            </span>
                        </label>
                        <select
                            value={language}
                            onChange={(e) => changeLanguage(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid var(--color-border)',
                                color: 'white',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value={LANGUAGES.ENGLISH} style={{ background: '#1a1a1a' }}>{t('english')}</option>
                            <option value={LANGUAGES.HINDI} style={{ background: '#1a1a1a' }}>{t('hindi')}</option>
                            <option value={LANGUAGES.TAMIL} style={{ background: '#1a1a1a' }}>{t('tamil')}</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Key size={16} /> Gemini API Key
                            </span>
                        </label>
                        <input
                            type="password"
                            value={localSettings.geminiKey}
                            onChange={e => setLocalSettings({ ...localSettings, geminiKey: e.target.value })}
                            placeholder="AIzaSy..."
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid var(--color-border)',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Server size={16} /> Ollama Model Name
                            </span>
                        </label>
                        <input
                            type="text"
                            value={localSettings.ollamaModel}
                            onChange={e => setLocalSettings({ ...localSettings, ollamaModel: e.target.value })}
                            placeholder="llama3"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid var(--color-border)',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Server size={16} /> Ollama URL
                            </span>
                        </label>
                        <input
                            type="text"
                            value={localSettings.ollamaUrl}
                            onChange={e => setLocalSettings({ ...localSettings, ollamaUrl: e.target.value })}
                            placeholder="http://localhost:11434"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid var(--color-border)',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        <Save size={18} /> Save Configuration
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SettingsModal;
