import React from 'react';
import { 
  Zap, 
  Leaf, 
  AlertCircle, 
  ShieldCheck, 
  ThermometerSnowflake, 
  Lightbulb, 
  Wind,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import OfflineBanner from '../components/OfflineBanner';

export default function EnergyAdvisory() {
  const { activePrediction, liveData, manualPrediction, clearManualPrediction } = useLiveData();
  
  // Use activePrediction (latest manual prediction if user ran one, otherwise latest live prediction)
  const currentPrediction = activePrediction || liveData?.prediction;
  const occupancy = currentPrediction?.occupancy;
  const recommendation = currentPrediction?.recommendation || (
    occupancy === 'Occupied' 
      ? 'Normal operation recommended' 
      : occupancy === 'Unoccupied' 
        ? 'Energy-saving mode recommended' 
        : null
  );
  const confidence = currentPrediction?.confidence;
  const isManual = Boolean(manualPrediction);

  const isEnergySaving = occupancy === 'Unoccupied' || (recommendation && recommendation.toLowerCase().includes('energy-saving'));

  return (
    <div className="page-container" id="energy-advisory-page">
      <OfflineBanner />

      {/* Main Advisory Status Card */}
      <div 
        className="iot-card" 
        style={{ 
          marginBottom: '24px', 
          borderColor: isEnergySaving ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)',
          background: isEnergySaving 
            ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(13, 19, 34, 0.95))' 
            : 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(13, 19, 34, 0.95))'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-md)',
                background: isEnergySaving ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                color: isEnergySaving ? '#fbbf24' : '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isEnergySaving ? <Leaf size={28} /> : <Zap size={28} />}
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span>Current Live/Active ML Advisory State</span>
                <span
                  id="prediction-source-badge"
                  style={{
                    fontSize: '0.68rem',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: isManual ? 'rgba(6, 182, 212, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: isManual ? 'var(--cyan-primary)' : 'var(--emerald-primary)',
                    fontWeight: 600,
                    textTransform: 'none',
                    letterSpacing: 'normal'
                  }}
                >
                  Source: {isManual ? 'Manual Prediction' : 'Live ThingSpeak'}
                </span>
              </div>
              <h2 id="advisory-recommendation-heading" style={{ fontSize: '1.6rem', fontWeight: 800, color: isEnergySaving ? '#fbbf24' : '#34d399' }}>
                {recommendation || 'Waiting for live recommendation...'}
              </h2>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Detected Room Status
            </span>
            <div id="advisory-occupancy-status" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
              {occupancy || 'Detecting...'}
            </div>
            {confidence !== undefined && confidence !== null && (
              <div id="advisory-confidence-val" style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                Confidence: <strong style={{ color: isEnergySaving ? '#fbbf24' : '#34d399' }}>{confidence}%</strong>
              </div>
            )}
            {isManual && (
              <div style={{ marginTop: '6px' }}>
                <button
                  type="button"
                  id="reset-to-live-btn"
                  onClick={clearManualPrediction}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(6, 182, 212, 0.4)',
                    color: 'var(--cyan-primary)',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Clear manual prediction and resume live telemetry tracking"
                >
                  <RefreshCw size={11} />
                  Reset to Live
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Regulatory & Functional Disclaimer */}
        <div className="advisory-callout" style={{ marginTop: '20px' }}>
          <AlertCircle size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
          <strong>Advisory only</strong> &mdash; no automatic appliance control is implemented. This platform provides intelligent operational recommendations for facility personnel.
        </div>
      </div>

      {/* Building Systems Operational Guidelines */}
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', color: '#fff' }}>
        Building Subsystem Strategy &amp; Guidelines
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* HVAC / Climate Control */}
        <div className="iot-card" id="guideline-hvac">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ color: '#38bdf8' }}>
              <ThermometerSnowflake size={22} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>HVAC &amp; Climate Management</h4>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {isEnergySaving 
              ? 'Room is unoccupied. Recommend energy-saving/setback operation. Facility manager should set the thermostat deadband to ±3°C of setpoint to reduce chiller load and prevent unnecessary compressor cycling.'
              : 'Room is occupied. Maintain normal comfort/setpoint operation. Keep standard thermal comfort range (22°C - 24°C) with active air circulation.'}
          </p>
          <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Target: {isEnergySaving ? 'Eco-Setback Mode' : 'Comfort Setpoint'}
          </div>
        </div>

        {/* Lighting Systems */}
        <div className="iot-card" id="guideline-lighting">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ color: '#facc15' }}>
              <Lightbulb size={22} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Lighting &amp; Luminaire Control</h4>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {isEnergySaving 
              ? 'No human presence detected. Recommend reducing/extinguishing nonessential lighting and dropping ambient fixtures to minimum baseline levels (10% - 20%).'
              : 'Occupants present. Maintain normal task lighting and full functional workspace illumination (300 - 500 Lux) for productivity and safety.'}
          </p>
          <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Target: {isEnergySaving ? 'Dimmed / Daylight Harvesting' : 'Full Illumination'}
          </div>
        </div>

        {/* Ventilation & Indoor Air Quality */}
        <div className="iot-card" id="guideline-ventilation">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ color: '#34d399' }}>
              <Wind size={22} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Demand-Controlled Ventilation (DCV)</h4>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {isEnergySaving 
              ? 'Room is unoccupied. Recommend reduced ventilation where appropriate. Fresh air intake dampers can be reduced to baseline ventilation rates (0.06 cfm/sq.ft).'
              : 'Room is occupied. Maintain normal ventilation based on occupancy and indoor CO2 levels. Modulate fresh air dampers dynamically to sustain indoor air quality below 800 ppm.'}
          </p>
          <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Standard: ASHRAE 62.1 Compliance
          </div>
        </div>
      </div>
    </div>
  );
}
