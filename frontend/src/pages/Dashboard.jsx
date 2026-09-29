import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { Activity, Radio, Cpu, Clock, AlertTriangle } from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import OfflineBanner from '../components/OfflineBanner';
import MetricCard from '../components/MetricCard';
import OccupancyCard from '../components/OccupancyCard';
import EnergyCard from '../components/EnergyCard';

export default function Dashboard() {
  const { 
    liveData, 
    liveReadings, 
    backendStatus, 
    lastFetchTime,
    sessionReadingsCount 
  } = useLiveData();

  const sensorData = liveData?.sensor_data;
  const prediction = liveData?.prediction;

  return (
    <div className="page-container" id="dashboard-page">
      <OfflineBanner />

      {/* Hero Banner / Project Intro */}
      <div 
        className="iot-card" 
        style={{ 
          marginBottom: '24px', 
          background: 'linear-gradient(135deg, rgba(13, 19, 34, 0.95), rgba(19, 27, 46, 0.8))',
          borderColor: 'rgba(6, 182, 212, 0.25)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="status-pill online" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>
                <Radio size={12} /> Live IoT Stream
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--cyan-primary)', fontWeight: 600 }}>
                ThingSpeak Channel #3285964
              </span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
              SMARTROOM AI
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '780px', marginTop: '4px' }}>
              Machine Learning-Based Smart Room Occupancy Prediction for Energy-Efficient Building Management.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active Model
              </span>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cpu size={16} style={{ color: 'var(--cyan-primary)' }} />
                Voting Ensemble
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Real Points Captured
              </span>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                {sessionReadingsCount}
              </div>
            </div>

            {sensorData?.timestamp && (
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Last Updated
                </span>
                <div id="dashboard-last-updated" style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                  {new Date(sensorData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4 Live Sensor Metric Cards */}
      <div className="sensor-cards-grid">
        <MetricCard
          type="temperature"
          value={sensorData?.temperature}
          timestamp={sensorData?.timestamp}
          entryId={sensorData?.entry_id}
        />
        <MetricCard
          type="humidity"
          value={sensorData?.humidity}
          timestamp={sensorData?.timestamp}
          entryId={sensorData?.entry_id}
        />
        <MetricCard
          type="co2"
          value={sensorData?.co2}
          timestamp={sensorData?.timestamp}
          entryId={sensorData?.entry_id}
        />
        <MetricCard
          type="light"
          value={sensorData?.light}
          timestamp={sensorData?.timestamp}
          entryId={sensorData?.entry_id}
        />
      </div>

      {/* AI Prediction & Energy Advisory Side-by-Side */}
      <div className="ai-overview-grid">
        <OccupancyCard 
          prediction={prediction} 
          timestamp={sensorData?.timestamp} 
        />
        <EnergyCard 
          recommendation={prediction?.recommendation} 
          occupancy={prediction?.occupancy} 
        />
      </div>

      {/* Real-time Telemetry Trend Visualizer */}
      <div className="iot-card" style={{ marginTop: '24px' }}>
        <div className="card-header-flex">
          <div>
            <span className="card-title">Live Real-Time Telemetry Stream</span>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Displaying rolling window of actual ThingSpeak sensor readings ({liveReadings.length} real points)
            </p>
          </div>
          <span style={{ fontSize: '0.76rem', color: 'var(--cyan-primary)', fontFamily: 'var(--font-mono)' }}>
            15s Interval
          </span>
        </div>

        {liveReadings.length > 0 ? (
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={liveReadings} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="co2Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="timeLabel" 
                  stroke="#475569" 
                  fontSize={11} 
                  tickLine={false} 
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={11} 
                  tickLine={false} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0d1322', 
                    borderColor: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    color: '#fff'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="co2" 
                  name="CO2 (ppm)" 
                  stroke="#f43f5e" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#co2Grad)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="temperature" 
                  name="Temp (°C)" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#tempGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="empty-state">
            <Clock className="empty-state-icon" />
            <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Waiting for live sensor data...</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              The chart will populate automatically as readings stream in from ThingSpeak.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
