import React from 'react';
import { 
  Info, 
  Layers, 
  Database, 
  Cpu, 
  Radio, 
  Workflow, 
  CheckCircle2, 
  Server, 
  AppWindow, 
  Zap,
  ArrowDown
} from 'lucide-react';
import OfflineBanner from '../components/OfflineBanner';

export default function AboutProject() {
  return (
    <div className="page-container" id="about-project-page">
      <OfflineBanner />

      {/* Hero Overview */}
      <div 
        className="iot-card" 
        style={{ 
          marginBottom: '24px', 
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(13, 19, 34, 0.95))',
          borderColor: 'rgba(6, 182, 212, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
          <div className="brand-icon" style={{ width: '48px', height: '48px' }}>
            <Radio size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--cyan-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Project Specification
            </span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>SmartRoom AI</h2>
          </div>
        </div>
        <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '900px' }}>
          <strong>Machine Learning-Based Smart Room Occupancy Prediction for Energy-Efficient Building Management</strong> is an end-to-end cyber-physical IoT system. It translates continuous ambient room telemetry into real-time presence detection and smart energy management advisories.
        </p>
      </div>

      {/* Architectural Flow Diagram */}
      <div className="iot-card" style={{ marginBottom: '24px' }}>
        <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Workflow size={18} style={{ color: 'var(--cyan-primary)' }} />
          End-to-End System Architecture &amp; Data Pipeline
        </span>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: '6px 0 20px' }}>
          Complete data path from environmental sensing to frontend intelligence display:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '420px', margin: '0 auto' }}>
          {[
            { label: 'ThingSpeak Channel #3285964', sub: 'Real-time wireless sensor feed (Field 1, 2, 3, 5)', color: '#38bdf8', icon: Radio },
            { label: 'Python Flask REST API', sub: 'CORS-enabled backend listening on 0.0.0.0:5000', color: '#10b981', icon: Server },
            { label: 'StandardScaler Preprocessing', sub: 'Feature normalization (smartroom_scaler.pkl)', color: '#fbbf24', icon: Layers },
            { label: 'Voting Ensemble Classifier', sub: 'Ensemble model (smartroom_voting_model.pkl)', color: '#8b5cf6', icon: Cpu },
            { label: 'Occupancy Prediction & Confidence', sub: 'Classification (Occupied / Unoccupied)', color: '#34d399', icon: CheckCircle2 },
            { label: 'Energy Recommendation Advisory', sub: 'HVAC & lighting management strategy', color: '#f59e0b', icon: Zap },
            { label: 'React + Vite Frontend', sub: 'Live streaming telemetry & analytics dashboard', color: '#06b6d4', icon: AppWindow },
          ].map((step, idx, arr) => {
            const StepIcon = step.icon;
            return (
              <React.Fragment key={idx}>
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: `1px solid ${step.color}40`,
                    borderRadius: 'var(--radius-md)',
                    boxShadow: `0 0 10px ${step.color}15`
                  }}
                >
                  <div style={{ color: step.color }}>
                    <StepIcon size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff' }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                      {step.sub}
                    </div>
                  </div>
                </div>
                {idx < arr.length - 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <ArrowDown size={18} style={{ color: 'var(--cyan-primary)' }} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Dataset & Machine Learning Specifications */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Dataset Card */}
        <div className="iot-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Database size={20} style={{ color: 'var(--cyan-primary)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Dataset &amp; Features</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Dataset Name:</span>
              <strong style={{ color: '#fff' }}>UCI Occupancy Detection</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Target Variable:</span>
              <strong style={{ color: '#34d399' }}>Occupancy (0 / 1)</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Feature 1:</span>
              <span>Temperature (°C)</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Feature 2:</span>
              <span>Humidity (%)</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Feature 3:</span>
              <span>Carbon Dioxide (CO2 ppm)</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Feature 4:</span>
              <span>Light Intensity (Lux)</span>
            </li>
          </ul>
        </div>

        {/* Models Evaluated Card */}
        <div className="iot-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Cpu size={20} style={{ color: 'var(--cyan-primary)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Evaluated ML Models</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Logistic Regression:</span>
              <span className="mono">97.79% Acc / 99.49% Recall</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>K-Nearest Neighbors (KNN):</span>
              <span className="mono">93.28% Acc / 84.47% Recall</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Decision Tree Classifier:</span>
              <span className="mono">97.82% Acc / 99.49% Recall</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Support Vector Machine (SVM):</span>
              <span className="mono">97.86% Acc / 99.69% Recall</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ color: '#38bdf8', fontWeight: 700 }}>Voting Ensemble (Deployed):</span>
              <strong style={{ color: '#38bdf8' }} className="mono">97.86% Acc / 99.69% Recall</strong>
            </li>
          </ul>
        </div>
      </div>

      {/* Tech Stack Summary */}
      <div className="iot-card" style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Technology Stack</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', fontSize: '0.86rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.74rem' }}>FRONTEND CLIENT</span>
            <strong style={{ color: '#fff' }}>React 18 + Vite</strong>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px' }}>Recharts, Lucide Icons, Pure CSS</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.74rem' }}>BACKEND SERVICE</span>
            <strong style={{ color: '#fff' }}>Python Flask REST API</strong>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px' }}>Flask-CORS, Joblib, Pandas</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.74rem' }}>MACHINE LEARNING</span>
            <strong style={{ color: '#fff' }}>scikit-learn 1.6.1</strong>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px' }}>StandardScaler + VotingClassifier</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.74rem' }}>IOT DATA BROKER</span>
            <strong style={{ color: '#fff' }}>ThingSpeak Cloud</strong>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px' }}>Channel #3285964 Telemetry Stream</div>
          </div>
        </div>
      </div>
    </div>
  );
}
