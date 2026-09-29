import React from 'react';
import { Users, UserX, Cpu, ShieldCheck } from 'lucide-react';

export default function OccupancyCard({ prediction, timestamp }) {
  const isLoaded = Boolean(prediction);
  const occupancy = prediction?.occupancy;
  const confidence = prediction?.confidence;
  const model = prediction?.model || 'Voting Ensemble';

  const isOccupied = occupancy === 'Occupied';

  let formattedTime = 'N/A';
  if (timestamp) {
    try {
      formattedTime = new Date(timestamp).toLocaleString();
    } catch {
      formattedTime = timestamp;
    }
  }

  return (
    <div className="iot-card" id="occupancy-prediction-card">
      <div className="card-header-flex">
        <span className="card-title">AI Occupancy Prediction</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--cyan-primary)' }}>
          <Cpu size={14} />
          <span>{model}</span>
        </div>
      </div>

      {isLoaded ? (
        <>
          <div style={{ margin: '14px 0 18px' }}>
            <div
              id="live-occupancy-badge"
              className={`occupancy-badge ${isOccupied ? 'occupied' : 'unoccupied'}`}
            >
              {isOccupied ? <Users size={22} /> : <UserX size={22} />}
              <span>{occupancy}</span>
            </div>
          </div>

          <div className="confidence-bar-container">
            <div className="confidence-header">
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <ShieldCheck size={14} /> Prediction Confidence
              </span>
              <strong id="live-confidence-value" style={{ fontFamily: 'var(--font-mono)' }}>
                {confidence}%
              </strong>
            </div>
            <div className="confidence-track">
              <div
                className="confidence-fill"
                style={{
                  width: `${Math.min(Math.max(confidence || 0, 0), 100)}%`,
                  background: isOccupied 
                    ? 'linear-gradient(90deg, #06b6d4, #10b981)' 
                    : 'linear-gradient(90deg, #06b6d4, #f59e0b)'
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: '16px', fontSize: '0.76rem', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Telemetry Source: Flask ML Pipeline</span>
            <span>Timestamp: {formattedTime}</span>
          </div>
        </>
      ) : (
        <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-dim)' }}>
          Waiting for live sensor data...
        </div>
      )}
    </div>
  );
}
