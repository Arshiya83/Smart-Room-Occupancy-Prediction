import React from 'react';
import { Zap, AlertCircle, CheckCircle2, Leaf } from 'lucide-react';

export default function EnergyCard({ recommendation, occupancy }) {
  const isLoaded = Boolean(recommendation);
  const isEnergySaving = occupancy === 'Unoccupied' || (recommendation && recommendation.toLowerCase().includes('energy-saving'));

  return (
    <div className="iot-card" id="energy-advisory-card">
      <div className="card-header-flex">
        <span className="card-title">Energy Advisory</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: isEnergySaving ? 'var(--amber-primary)' : 'var(--emerald-primary)' }}>
          {isEnergySaving ? <Leaf size={14} /> : <Zap size={14} />}
          <span>Building Automation</span>
        </div>
      </div>

      {isLoaded ? (
        <>
          <div style={{ margin: '14px 0', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: isEnergySaving ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                color: isEnergySaving ? '#fbbf24' : '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {isEnergySaving ? <Leaf size={22} /> : <CheckCircle2 size={22} />}
            </div>
            <div>
              <div
                id="live-energy-recommendation"
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: isEnergySaving ? '#fbbf24' : '#34d399',
                  lineHeight: 1.3
                }}
              >
                {recommendation}
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {isEnergySaving 
                  ? 'Recommend lowering HVAC setpoints and dimming idle lighting to conserve facility power.' 
                  : 'Maintain standard climate regulation and workspace illumination for occupant comfort.'}
              </p>
            </div>
          </div>

          <div className="advisory-callout" id="energy-compliance-disclaimer">
            <AlertCircle size={15} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
            <strong>Advisory only</strong> &mdash; no automatic appliance control is implemented.
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
