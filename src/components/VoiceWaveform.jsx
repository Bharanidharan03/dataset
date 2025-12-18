import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceWaveform = ({ isActive, amplitude = 1 }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const barsRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const barCount = 20;
        const barWidth = 3;
        const barGap = 2;
        const centerY = canvas.height / 2;

        // Initialize bars
        if (barsRef.current.length === 0) {
            barsRef.current = Array(barCount).fill(0).map(() => ({
                height: 5,
                targetHeight: 5,
                speed: 0.1 + Math.random() * 0.1
            }));
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            barsRef.current.forEach((bar, i) => {
                // Update target height based on activity
                if (isActive) {
                    bar.targetHeight = 5 + Math.random() * 30 * amplitude;
                } else {
                    bar.targetHeight = 5;
                }

                // Smooth transition
                bar.height += (bar.targetHeight - bar.height) * bar.speed;

                // Draw bar
                const x = i * (barWidth + barGap);
                const gradient = ctx.createLinearGradient(x, centerY - bar.height, x, centerY + bar.height);

                if (isActive) {
                    gradient.addColorStop(0, '#f59e0b');
                    gradient.addColorStop(0.5, '#ef4444');
                    gradient.addColorStop(1, '#f59e0b');
                } else {
                    gradient.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
                    gradient.addColorStop(1, 'rgba(239, 68, 68, 0.3)');
                }

                ctx.fillStyle = gradient;
                ctx.fillRect(x, centerY - bar.height, barWidth, bar.height * 2);
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isActive, amplitude]);

    return (
        <canvas
            ref={canvasRef}
            width={120}
            height={50}
            style={{
                display: 'block',
                margin: '0 auto'
            }}
        />
    );
};

export default VoiceWaveform;
