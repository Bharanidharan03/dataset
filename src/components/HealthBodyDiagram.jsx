import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Brain, Heart, Wind, Droplets, Info, Thermometer, User, ShieldCheck, AlertCircle } from 'lucide-react';

const BodyPart = ({ id, path, label, onClick, color, isCore = true }) => (
    <motion.path
        id={id}
        d={path}
        fill={color || "rgba(148, 163, 184, 0.1)"}
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth={isCore ? 0.5 : 1}
        whileHover={{
            fill: "var(--color-primary)",
            stroke: "white",
            strokeWidth: 2,
            opacity: 0.9
        }}
        onClick={() => onClick(id, label)}
        style={{ cursor: 'pointer', transition: 'fill 0.3s ease, stroke 0.3s ease' }}
    />
);

const HealthBodyDiagram = ({ metrics }) => {
    const [selectedPart, setSelectedPart] = useState(null);

    const getVal = (val) => {
        if (val && typeof val === 'object' && val.value !== undefined) return val.value;
        return (typeof val === 'number') ? val : 0;
    };

    const getStatusColor = (value, min, max, baseAlpha = 0.4) => {
        const val = getVal(value);
        if (!val || isNaN(val) || val === 0) return `rgba(148, 163, 184, ${baseAlpha * 0.5})`;
        if (val < min || val > max) return `rgba(239, 68, 68, ${baseAlpha})`; // Critical
        return `rgba(34, 197, 94, ${baseAlpha})`; // Good
    };

    const calculateHealthScore = (value, min, max) => {
        const val = getVal(value);
        if (!val || isNaN(val) || val === 0) return null;
        const range = max - min;
        const dist = Math.abs(val - (min + max) / 2);
        const score = Math.max(0, 100 - (dist / (range / 2)) * 50);
        return Math.round(score);
    };

    const parts = [
        {
            id: 'head',
            label: 'Brain / Nervous System',
            icon: Brain,
            color: "rgba(96, 165, 250, 0.3)",
            score: null,
            data: [
                { label: 'Vitamin B12', value: getVal(metrics?.blood?.vitamin_b12), unit: 'pg/mL', range: [200, 900] },
                { label: 'Nerve Status', value: getVal(metrics?.blood?.vitamin_b12) > 200 ? 'Optimal' : 'Low B12', unit: '' }
            ]
        },
        {
            id: 'heart',
            label: 'Heart & Circulation',
            icon: Heart,
            color: getStatusColor(metrics?.heart?.bpm, 60, 100),
            score: calculateHealthScore(metrics?.heart?.bpm, 60, 100),
            data: [
                { label: 'Pulse', value: getVal(metrics?.heart?.bpm), unit: 'bpm', range: [60, 100] },
                { label: 'Systolic BP', value: getVal(metrics?.heart?.bp_sys), unit: 'mmHg', range: [90, 120] },
                { label: 'Diastolic BP', value: getVal(metrics?.heart?.bp_dia), unit: 'mmHg', range: [60, 80] }
            ]
        },
        {
            id: 'liver',
            label: 'Liver Health',
            icon: Activity,
            color: getStatusColor(metrics?.liver?.sgpt, 7, 56),
            score: calculateHealthScore(metrics?.liver?.sgpt, 7, 56),
            data: [
                { label: 'SGPT (ALT)', value: getVal(metrics?.liver?.sgpt), unit: 'U/L', range: [7, 56] },
                { label: 'SGOT (AST)', value: getVal(metrics?.liver?.sgot), unit: 'U/L', range: [8, 48] }
            ]
        },
        {
            id: 'kidneys',
            label: 'Kidney Function',
            icon: Droplets,
            color: getStatusColor(metrics?.kidney?.creatinine, 0.7, 1.3),
            score: calculateHealthScore(metrics?.kidney?.creatinine, 0.7, 1.3),
            data: [
                { label: 'Creatinine', value: getVal(metrics?.kidney?.creatinine), unit: 'mg/dL', range: [0.7, 1.3] },
                { label: 'Urea', value: getVal(metrics?.kidney?.urea), unit: 'mg/dL', range: [7, 20] }
            ]
        },
        {
            id: 'stomach',
            label: 'Metabolism / Stomach',
            icon: Activity,
            color: getStatusColor(metrics?.blood?.hba1c, 4, 6.5),
            score: calculateHealthScore(metrics?.blood?.hba1c, 4, 6.5),
            data: [
                { label: 'HbA1c', value: getVal(metrics?.blood?.hba1c), unit: '%', range: [4, 5.7] },
                { label: 'Fasting Glucose', value: getVal(metrics?.blood?.glucose_f), unit: 'mg/dL', range: [70, 100] }
            ]
        },
        {
            id: 'limbs',
            label: 'Hands, Legs & Joints',
            icon: User,
            color: getStatusColor(metrics?.limbs?.calcium, 8.5, 10.5),
            score: calculateHealthScore(metrics?.limbs?.calcium, 8.5, 10.5),
            data: [
                { label: 'Calcium', value: getVal(metrics?.limbs?.calcium), unit: 'mg/dL', range: [8.5, 10.5] },
                { label: 'Uric Acid', value: getVal(metrics?.limbs?.uric_acid), unit: 'mg/dL', range: [3.5, 7.2] }
            ]
        },
        {
            id: 'blood',
            label: 'Complete Blood Count',
            icon: Droplets,
            color: getStatusColor(metrics?.blood?.hemoglobin, 13.5, 17.5, 0.2),
            score: calculateHealthScore(metrics?.blood?.hemoglobin, 13.5, 17.5),
            data: [
                { label: 'Hemoglobin', value: getVal(metrics?.blood?.hemoglobin), unit: 'g/dL', range: [13.5, 17.5] },
                { label: 'WBC Count', value: getVal(metrics?.blood?.wbc), unit: 'K/uL', range: [4.5, 11] },
                { label: 'Platelets', value: getVal(metrics?.blood?.platelets), unit: 'K/uL', range: [150, 450] }
            ]
        }
    ];

    // Detailed Body Paths
    const bodyPaths = {
        body: "M100,20 c-10,0 -18,8 -18,18 c0,10 8,18 18,18 s18,-8 18,-18 c0,-10 -8,-18 -18,-18 M82,56 l-12,5 c-5,2 -8,10 -5,20 l15,80 l-2,100 l15,0 l5,-80 l14,0 l5,80 l15,0 l-2,-100 l15,-80 c3,-10 0,-18 -5,-20 l-12,-5",
        head: "M100,20 c-10,0 -18,8 -18,18 c0,10 8,18 18,18 s18,-8 18,-18 c0,-10 -8,-18 -18,-18",
        leftArm: "M70,61 l-20,40 c-2,5 -2,10 2,12 l8,4 c4,2 8,0 10,-4 l15,-35 z",
        rightArm: "M130,61 l20,40 c2,5 2,10 -2,12 l-8,4 c-4,2 -8,0 -10,-4 l-15,-35 z",
        leftLeg: "M80,170 l-10,100 l20,0 l8,-80 z",
        rightLeg: "M120,170 l10,100 l-20,0 l-8,-80 z",
        heart: "M97,85 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0 M100,82 v10 M95,85 h10",
        liver: "M110,105 q10,-5 20,5 t-10,15 q-15,5 -20,-15",
        stomach: "M85,108 q5,20 20,5 t10,10",
        kidneys: "M88,135 a4,6 0 1,0 8,0 a4,6 0 1,0 -8,0 M104,135 a4,6 0 1,0 8,0 a4,6 0 1,0 -8,0",
        veins: "M100,56 l0,114 M100,85 l-40,15 M100,85 l40,15 M100,150 l-20,80 M100,150 l20,80"
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'var(--color-primary-soft)', padding: '0.5rem', borderRadius: '12px' }}>
                        <Activity size={20} className="text-primary" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>3D Biological Analysis</h3>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Real-time spatial health mapping</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <span style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} /> Optimal
                    </span>
                    <span style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} /> Warning
                    </span>
                </div>
            </div>

            <div style={{ minHeight: '350px', position: 'relative', display: 'flex', justifyContent: 'center', perspective: '1000px' }}>
                <svg viewBox="0 0 200 300" style={{ height: '350px', maxWidth: '350px', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}>
                    <motion.path
                        d={bodyPaths.veins}
                        fill="none"
                        stroke="rgba(239, 68, 68, 0.15)"
                        strokeWidth="2"
                        strokeDasharray="10 5"
                        animate={{ strokeDashoffset: [0, -30] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />

                    <path d={bodyPaths.body} fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

                    <BodyPart id="leftArm" path={bodyPaths.leftArm} label="Left Hand" onClick={() => setSelectedPart(parts[5])} color={parts[5].color} isCore={false} />
                    <BodyPart id="rightArm" path={bodyPaths.rightArm} label="Right Hand" onClick={() => setSelectedPart(parts[5])} color={parts[5].color} isCore={false} />
                    <BodyPart id="leftLeg" path={bodyPaths.leftLeg} label="Left Leg" onClick={() => setSelectedPart(parts[5])} color={parts[5].color} isCore={false} />
                    <BodyPart id="rightLeg" path={bodyPaths.rightLeg} label="Right Leg" onClick={() => setSelectedPart(parts[5])} color={parts[5].color} isCore={false} />

                    <BodyPart id="head" path={bodyPaths.head} label="Brain" onClick={() => setSelectedPart(parts[0])} color={parts[0].color} />
                    <BodyPart id="heart" path={bodyPaths.heart} label="Heart" onClick={() => setSelectedPart(parts[1])} color={parts[1].color} />
                    <BodyPart id="liver" path={bodyPaths.liver} label="Liver" onClick={() => setSelectedPart(parts[2])} color={parts[2].color} />
                    <BodyPart id="stomach" path={bodyPaths.stomach} label="Stomach" onClick={() => setSelectedPart(parts[4])} color={parts[4].color} />
                    <BodyPart id="kidneys" path={bodyPaths.kidneys} label="Kidneys" onClick={() => setSelectedPart(parts[3])} color={parts[3].color} />
                </svg>

                <AnimatePresence>
                    {selectedPart && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-panel"
                            style={{
                                position: 'absolute', right: '5%', top: '10%',
                                width: '240px', padding: '1.5rem',
                                border: '1px solid rgba(255,255,255,0.15)',
                                zIndex: 20,
                                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ background: 'var(--color-primary-soft)', padding: '0.4rem', borderRadius: '8px' }}>
                                    <selectedPart.icon size={18} className="text-primary" />
                                </div>
                                <button onClick={() => setSelectedPart(null)} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                            </div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{selectedPart.label}</h4>
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem' }}>Extracted Laboratory Findings</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {selectedPart.data.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.label}</span>
                                            <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>
                                                {(!item.value || item.value === 0) ? (
                                                    <span style={{ color: '#fb7185', fontWeight: '400', fontSize: '0.7rem' }}>Report doesn't contain this</span>
                                                ) : (
                                                    `${item.value} ${item.unit}`
                                                )}
                                            </span>
                                        </div>
                                        {item.range && item.value > 0 && (
                                            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', position: 'relative' }}>
                                                <div
                                                    style={{
                                                        position: 'absolute', left: 0, top: 0,
                                                        width: `${Math.min(100, (item.value / item.range[1]) * 100)}%`,
                                                        height: '100%',
                                                        background: (item.value < item.range[0] || item.value > item.range[1]) ? '#ef4444' : '#22c55e',
                                                        borderRadius: '2px'
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={16} color="var(--color-primary)" />
                    Organ Health Assessment Summary
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                    {parts.map(part => (
                        <div
                            key={part.id}
                            onClick={() => setSelectedPart(part)}
                            style={{
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            className="hover-card"
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <part.icon size={16} color={part.score === null ? '#64748b' : part.score > 80 ? '#22c55e' : '#ef4444'} />
                                <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: part.score === null ? '#64748b' : part.score > 80 ? '#22c55e' : '#ef4444' }}>
                                    {part.score === null ? 'N/A' : `${part.score}% Healthy`}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '600' }}>{part.id === 'head' ? 'Brain' : part.label.split(' ')[0]}</div>
                            <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                                {part.score === null ? 'Insufficient data' : part.score > 80 ? 'Optimal Status' : 'Needs Review'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
                    <AlertCircle size={14} className="text-primary" />
                    <span style={{ fontSize: '0.75rem', fontWeight: '400' }}>
                        Values are extracted directly from your report. Click on any organ card for specific clinical data range comparisons.
                    </span>
                </div>
            </div>
        </div>
    );
};

export default HealthBodyDiagram;

