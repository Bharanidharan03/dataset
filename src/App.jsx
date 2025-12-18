import React, { useState, useEffect } from 'react';
import { VoiceProvider } from './context/VoiceContext';
import { VoiceCommandProvider, useVoiceCommand } from './context/VoiceCommandContext';
import { LanguageProvider } from './context/LanguageContext';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import UploadSection from './components/UploadSection';
import AnalysisResult from './components/AnalysisResult';
import ChatAssistant from './components/ChatAssistant';
import SettingsModal from './components/SettingsModal';
import FloatingVoiceButton from './components/FloatingVoiceButton';
import AccessibilityPanel from './components/AccessibilityPanel';
import OnboardingTutorial from './components/OnboardingTutorial';
import VoiceCommandPanel from './components/VoiceCommandPanel';

import AuthModal from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import { saveReport, getUserReports } from './services/database';
import { extractStructuredData } from './services/gemini';
import { extractStructuredDataWithOllama } from './services/ollama';
import TrendDashboard from './components/TrendDashboard';
import HealthBodyDiagram from './components/HealthBodyDiagram';

function AppContent() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [reports, setReports] = useState([]);
  const [latestStructuredData, setLatestStructuredData] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { registerCommandHandler, unregisterCommandHandler } = useVoiceCommand();
  const { user } = useAuth();

  // Settings State
  const [settings, setSettings] = useState({
    geminiKey: '',
    ollamaModel: 'llama3',
    ollamaUrl: 'https://lillia-unstayable-jaunita.ngrok-free.dev'
  });


  // Fetch reports on login
  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        const history = await getUserReports(user.uid);
        setReports(history);
        if (history.length > 0) {
          setLatestStructuredData(history[0]);
        }
      };
      fetchHistory();
    } else {
      setReports([]);
      setLatestStructuredData(null);
    }
  }, [user]);

  // Handle new report processing
  const handleFileUpload = async (text, fileObj) => {
    setFile(fileObj);
    setExtractedText(text);

    // Extract structured data for trends/body diagram
    let structured = null;
    try {
      if (settings.geminiKey) {
        console.log("Extracting with Gemini...");
        structured = await extractStructuredData(settings.geminiKey, text);
      } else if (settings.ollamaModel) {
        console.log("Extracting with Ollama...");
        structured = await extractStructuredDataWithOllama(settings.ollamaModel, text, settings.ollamaUrl);
      }

      if (structured) {
        setLatestStructuredData(structured);
        if (user) {
          await saveReport(user.uid, structured, text);
          // Refresh reports
          const updated = await getUserReports(user.uid);
          setReports(updated);
        }
      }
    } catch (err) {
      console.error("Failed to extract structured data:", err);
    }
  };


  // Register app-level voice command handlers
  useEffect(() => {
    // Settings commands
    registerCommandHandler('openSettings', () => setShowSettings(true));
    registerCommandHandler('closeSettings', () => setShowSettings(false));

    return () => {
      unregisterCommandHandler('openSettings');
      unregisterCommandHandler('closeSettings');
    };
  }, [registerCommandHandler, unregisterCommandHandler]);

  return (
    <>
      <div className="app-layout">
        <Navbar
          onOpenSettings={() => setShowSettings(true)}
          onOpenAuth={() => setShowAuth(true)}
        />

        <main className="container" style={{ paddingBottom: '4rem', paddingTop: '2rem' }}>
          {(!file && reports.length === 0) && <Hero />}


          <UploadSection
            onFileProocessed={handleFileUpload}
            setIsLoading={(loading) => console.log("Processing...", loading)}
          />

          <div style={{ marginTop: '4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Dashboard Overview</h2>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          </div>


          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 0.75fr)', gap: '2rem', marginTop: '3rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {extractedText && (
                <AnalysisResult
                  text={extractedText}
                  analysis={analysis}
                  setAnalysis={setAnalysis}
                  settings={settings}
                  structuredData={latestStructuredData}
                />
              )}
              <TrendDashboard reports={reports} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <HealthBodyDiagram metrics={latestStructuredData?.metrics} />

              {extractedText && (
                <ChatAssistant context={extractedText} analysis={analysis} settings={settings} />
              )}
            </div>
          </div>

        </main>


        {showSettings && (
          <SettingsModal
            settings={settings}
            onSave={setSettings}
            onClose={() => setShowSettings(false)}
          />
        )}

        {showAuth && (
          <AuthModal
            isOpen={showAuth}
            onClose={() => setShowAuth(false)}
          />
        )}

        <FloatingVoiceButton />
        <AccessibilityPanel />
        <OnboardingTutorial />
        <VoiceCommandPanel />
      </div>
    </>
  );
}


import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <VoiceProvider>
          <VoiceCommandProvider>
            <AppContent />
          </VoiceCommandProvider>
        </VoiceProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}



export default App;
