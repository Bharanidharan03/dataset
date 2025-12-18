import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Gauge, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useVoice } from '../context/VoiceContext';

const HealthDashboard = ({ analysis, structuredData }) => {
    const { speak } = useVoice();

    // Parse analysis for key metrics (prioritize structured data)
    const metrics = extractMetrics(analysis, structuredData);


    const handleMetricClick = (metric) => {
        speak(`${metric.name}: ${metric.value}. ${metric.status}. ${metric.explanation}`, true);
    };

    return (
        <div style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>📊 Health Snapshot</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {metrics.map((metric, idx) => (
                    <MetricCard key={idx} metric={metric} onClick={() => handleMetricClick(metric)} delay={idx * 0.1} />
                ))}
            </div>

            {/* Feature 4 & 13: Correlations & Impacts */}
            {structuredData && (structuredData.body_system_correlations?.length > 0 || structuredData.daily_life_impact?.length > 0) && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                    {/* Correlations */}
                    {structuredData.body_system_correlations?.length > 0 && (
                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <TrendingUp size={18} className="text-primary" /> Body System Links
                            </h4>
                            {structuredData.body_system_correlations.map((corr, idx) => (
                                <div key={idx} style={{ marginBottom: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        {corr.systems.join(' + ')}
                                    </span>
                                    <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{corr.finding}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Daily Impacts */}
                    {structuredData.daily_life_impact?.length > 0 && (
                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <Volume2 size={18} className="text-primary" /> Daily Life Impact
                            </h4>
                            {structuredData.daily_life_impact.map((impact, idx) => (
                                <div key={idx} style={{ marginBottom: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid #fbbf24' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                                        {impact.area}
                                    </span>
                                    <p style={{ fontSize: '0.875rem', marginTop: '0.25rem', opacity: 0.9 }}>
                                        {impact.insight}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const MetricCard = ({ metric, onClick, delay }) => {
    const statusColors = {
        normal: { bg: 'rgba(34, 197, 94, 0.1)', border: '#22c55e', icon: '#22c55e' },
        warning: { bg: 'rgba(251, 191, 36, 0.1)', border: '#fbbf24', icon: '#fbbf24' },
        critical: { bg: 'rgba(239, 68, 68, 0.1)', border: '#ef4444', icon: '#ef4444' }
    };

    const colors = statusColors[metric.level] || statusColors.normal;

    const confColor = metric.confidence === 'High' ? '#22c55e' : metric.confidence === 'Medium' ? '#fbbf24' : '#ef4444';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            onClick={onClick}
            className="glass-panel"
            style={{
                padding: '1.5rem',
                cursor: 'pointer',
                background: colors.bg,
                borderColor: colors.border,
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative'
            }}
            whileHover={{ scale: 1.05, boxShadow: `0 8px 30px ${colors.border}40` }}
            whileTap={{ scale: 0.98 }}
        >
            {metric.confidence && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', color: confColor, border: `1px solid ${confColor}` }}>
                    {metric.confidence} Conf.
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem' }}>{metric.icon}</div>
                <StatusIcon level={metric.level} color={colors.icon} />
            </div>

            <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                {metric.name}
            </h4>

            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: colors.icon, marginBottom: '0.5rem' }}>
                {metric.value}
            </div>

            <div style={{ fontSize: '0.75rem' }}>
                <span style={{ fontWeight: 'bold', color: colors.icon }}>{metric.status}</span>
                {metric.explanation && (
                    <p style={{ marginTop: '0.25rem', opacity: 0.8, fontSize: '0.7rem' }}>
                        {metric.explanation}
                    </p>
                )}
            </div>
        </motion.div>
    );
};

const StatusIcon = ({ level, color }) => {
    const icons = {
        normal: <TrendingUp size={20} color={color} />,
        warning: <Minus size={20} color={color} />,
        critical: <TrendingDown size={20} color={color} />
    };
    return icons[level] || icons.normal;
};

// Simple metric extraction (prioritize structured data from AI)
const extractMetrics = (analysis, structuredData) => {
    const getVal = (v) => (v && v.value !== undefined) ? v.value : v;
    const getConf = (v) => (v && v.confidence) ? v.confidence : null;

    if (structuredData && structuredData.metrics) {
        const m = structuredData.metrics;

        // Helper to formatting
        const fmt = (v, unit) => {
            const val = getVal(v);
            return val ? `${val} ${unit || ''}` : "N/A";
        };

        const bpSys = getVal(m.heart?.bp_sys);
        const bpDia = getVal(m.heart?.bp_dia);
        const hba1c = getVal(m.blood?.hba1c);
        const chol = getVal(m.cholesterol?.total);

        return [
            {
                name: 'Blood Pressure',
                value: (bpSys && bpDia) ? `${bpSys}/${bpDia}` : "N/A",
                status: (bpSys > 140) ? 'High' : 'Normal',
                level: (bpSys > 140) ? 'critical' : 'normal',
                icon: '❤️',
                explanation: 'Blood pressure reading from your report.',
                confidence: getConf(m.heart?.bp_sys)
            },
            {
                name: 'Blood Glucose',
                value: fmt(m.blood?.hba1c, '%'),
                status: (hba1c > 6.5) ? 'High' : 'Normal',
                level: (hba1c > 6.5) ? 'critical' : 'normal',
                icon: '🩸',
                explanation: 'HbA1c level indicates long-term blood sugar control.',
                confidence: getConf(m.blood?.hba1c)
            },
            {
                name: 'Cholesterol',
                value: fmt(m.cholesterol?.total, 'mg/dL'),
                status: (chol > 200) ? 'High' : 'Optimal',
                level: (chol > 200) ? 'warning' : 'normal',
                icon: '🧬',
                explanation: 'Total cholesterol levels found in your labs.',
                confidence: getConf(m.cholesterol?.total)
            }
        ];

    }

    if (!analysis) return [];

    // Fallback to demo metrics if no structured data yet
    return [
        { name: 'Blood Pressure', value: '120/80', status: 'Normal Range', level: 'normal', icon: '❤️', explanation: 'Your blood pressure is healthy' },
        { name: 'Blood Sugar', value: '95 mg/dL', status: 'Optimal', level: 'normal', icon: '🩸', explanation: 'Blood sugar levels are good' },
        { name: 'Cholesterol', value: '180 mg/dL', status: 'Good', level: 'normal', icon: '🧬', explanation: 'Cholesterol is within healthy limits' }
    ];
};


export default HealthDashboard;
