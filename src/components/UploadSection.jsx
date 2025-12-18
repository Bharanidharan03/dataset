import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, Loader } from 'lucide-react';
import { extractTextFromImage } from '../services/ocr';
import { useVoiceCommand } from '../context/VoiceCommandContext';
import { useVoice } from '../context/VoiceContext';

const UploadSection = ({ onFileProocessed }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef(null);
    const { registerCommandHandler, unregisterCommandHandler } = useVoiceCommand();
    const { speak } = useVoice();

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setIsProcessing(true);
        setProgress(0);
        speak('Processing your medical report. Please wait.', true);

        try {
            // Simulate progress for UX if Tesseract is too fast/slow
            const text = await extractTextFromImage(file, (p) => setProgress(Math.round(p * 100)));
            console.log("Extracted Text:", text); // Debug
            onFileProocessed(text, file);
            speak('Report uploaded successfully. Analysis is ready.', true);
        } catch (err) {
            alert("Error processing file: " + err.message);
            speak('Sorry, there was an error processing your file.', true);
        } finally {
            setIsProcessing(false);
        }
    }, [onFileProocessed, speak]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false
    });

    // Register voice command handler
    useEffect(() => {
        const handleUploadCommand = () => {
            speak('Opening file picker. Please select your medical report.', true);
            // Trigger the file input click
            const input = document.querySelector('input[type="file"]');
            if (input) {
                input.click();
            }
        };

        registerCommandHandler('upload', handleUploadCommand);

        return () => {
            unregisterCommandHandler('upload');
        };
    }, [registerCommandHandler, unregisterCommandHandler, speak]);

    return (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', cursor: 'pointer', transition: 'border 0.2s', borderColor: isDragActive ? 'var(--color-primary)' : 'var(--glass-border)' }} {...getRootProps()}>
            <input {...getInputProps()} />

            {isProcessing ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <Loader className="animate-spin" size={48} color="var(--color-primary)" />
                    <div>
                        <h3 style={{ marginBottom: '0.5rem' }}>Analyzing Report...</h3>
                        <div style={{ width: '200px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--color-primary)', borderRadius: '3px', transition: 'width 0.3s' }} />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'rgba(56, 189, 248, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem'
                    }}>
                        <Upload size={32} color="var(--color-primary)" />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                        {isDragActive ? "Drop it here!" : "Upload Medical Report"}
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        Drag & drop or click to select image (JPG, PNG)
                    </p>
                </>
            )}
        </div>
    );
};

export default UploadSection;
