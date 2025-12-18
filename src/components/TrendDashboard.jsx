import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { TrendingUp, Calendar, AlertCircle } from 'lucide-react';

const TrendDashboard = ({ reports }) => {
    if (!reports || reports.length === 0) {
        return (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <Calendar size={48} style={{ color: '#475569', marginBottom: '1rem' }} />
                <h3>No History Yet</h3>
                <p style={{ color: '#94a3b8' }}>Upload your first medical report to start tracking trends.</p>
            </div>
        );
    }

    // Helper to extract value safely (handles old number format vs new object format)
    const getValue = (val) => {
        if (val && typeof val === 'object' && val.value !== undefined) return val.value;
        return typeof val === 'number' ? val : 0;
    };

    const chartData = [...reports].reverse().map(r => ({
        date: new Date(r.date || r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        hba1c: getValue(r.metrics?.blood?.hba1c),
        cholesterol: getValue(r.metrics?.cholesterol?.total),
        sys: getValue(r.metrics?.heart?.bp_sys),
        dia: getValue(r.metrics?.heart?.bp_dia),
    })).filter(d => d.hba1c > 0 || d.cholesterol > 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <TrendingUp className="text-primary" />
                            Health Progress Trends
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Tracking metrics across {reports.length} reports</p>
                    </div>
                </div>

                <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorGlucose" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: '#0f172a',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px'
                                }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="hba1c"
                                name="HbA1c (%)"
                                stroke="#60a5fa"
                                fillOpacity={1}
                                fill="url(#colorGlucose)"
                                strokeWidth={3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Recent Summary</span>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                        {reports[0].summary}
                    </p>
                </div>
                {reports[0].criticalAlerts?.length > 0 && (
                    <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #ef4444' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', marginBottom: '0.5rem' }}>
                            <AlertCircle size={16} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Alerts</span>
                        </div>
                        <p style={{ fontSize: '0.875rem' }}>{reports[0].criticalAlerts[0]}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrendDashboard;
