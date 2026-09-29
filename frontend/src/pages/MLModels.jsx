import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { Boxes, CheckCircle2, ShieldCheck, Trophy, Sparkles } from 'lucide-react';
import { getMetrics } from '../services/api';
import OfflineBanner from '../components/OfflineBanner';

export default function MLModels() {
  const [metrics, setMetrics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    async function loadMetrics() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const data = await getMetrics();
        if (Array.isArray(data)) {
          setMetrics(data);
        }
      } catch (err) {
        setErrorMessage(`Failed to load model metrics: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }
    loadMetrics();
  }, []);

  // Helper to convert decimals to percentages (e.g., 0.9786 -> "97.86%")
  const formatPercent = (val) => {
    if (val === undefined || val === null || isNaN(val)) return 'N/A';
    return `${(Number(val) * 100).toFixed(2)}%`;
  };

  // Prepare chart data (percentages as numbers for bar chart)
  const chartData = metrics.map((item) => ({
    name: item.Model,
    Accuracy: Number((Number(item.Accuracy || 0) * 100).toFixed(2)),
    Precision: Number((Number(item.Precision || 0) * 100).toFixed(2)),
    Recall: Number((Number(item.Recall || 0) * 100).toFixed(2)),
    F1: Number((Number(item['F1-Score'] || 0) * 100).toFixed(2)),
    ROCAUC: Number((Number(item['ROC-AUC'] || 0) * 100).toFixed(2)),
  }));

  return (
    <div className="page-container" id="ml-models-page">
      <OfflineBanner />

      {/* Overview Banner */}
      <div className="iot-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="status-pill online" style={{ fontSize: '0.74rem' }}>
                <Trophy size={13} /> Deployed in Production
              </span>
              <span style={{ fontSize: '0.86rem', color: 'var(--cyan-primary)', fontWeight: 700 }}>
                Voting Ensemble
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff' }}>
              Model Evaluation &amp; Benchmark Metrics
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
              Comparative benchmark of 5 supervised machine learning classifiers trained and evaluated on the UCI Occupancy Dataset.
            </p>
          </div>

          <div style={{ padding: '12px 18px', background: 'rgba(6, 182, 212, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>
              Live Production Model
            </span>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#38bdf8' }}>
              Voting Ensemble (97.86% Acc / 99.69% Recall)
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Table */}
      <div className="iot-card" style={{ marginBottom: '24px' }}>
        <div className="card-header-flex">
          <span className="card-title">Supervised Classification Benchmark</span>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>Source: <code>model_comparison.csv</code></span>
        </div>

        <div className="data-table-container">
          <table className="iot-table" id="ml-metrics-table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Accuracy</th>
                <th>Precision</th>
                <th>Recall</th>
                <th>F1-Score</th>
                <th>ROC-AUC</th>
                <th>Deployment Status</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((row, index) => {
                const isDeployed = row.Model === 'Voting Ensemble';
                return (
                  <tr 
                    key={index} 
                    style={isDeployed ? { background: 'rgba(6, 182, 212, 0.08)', fontWeight: 600 } : {}}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isDeployed && <Sparkles size={16} style={{ color: 'var(--cyan-primary)' }} />}
                        <span style={{ color: isDeployed ? '#38bdf8' : 'inherit' }}>
                          {row.Model}
                        </span>
                      </div>
                    </td>
                    <td className="mono" style={{ color: isDeployed ? '#38bdf8' : 'inherit' }}>
                      {formatPercent(row.Accuracy)}
                    </td>
                    <td className="mono">{formatPercent(row.Precision)}</td>
                    <td className="mono">{formatPercent(row.Recall)}</td>
                    <td className="mono">{formatPercent(row['F1-Score'])}</td>
                    <td className="mono">{formatPercent(row['ROC-AUC'])}</td>
                    <td>
                      {isDeployed ? (
                        <span 
                          style={{
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: 'rgba(16, 185, 129, 0.18)',
                            color: '#34d399',
                            border: '1px solid rgba(16, 185, 129, 0.35)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <CheckCircle2 size={12} /> ACTIVE PRODUCTION
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.76rem' }}>
                          Evaluated Baseline
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparative Performance Visualizer */}
      <div className="iot-card">
        <span className="card-title">Performance Comparison Across Classifiers (%)</span>
        <div style={{ width: '100%', height: 340, marginTop: '20px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} interval={0} />
              <YAxis stroke="#64748b" fontSize={11} domain={[80, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0d1322', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                formatter={(val) => [`${val}%`, '']}
              />
              <Legend wrapperStyle={{ paddingTop: '15px' }} />
              <Bar dataKey="Accuracy" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Recall" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="F1" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ROCAUC" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
