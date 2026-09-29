import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { Activity, Radio, Clock, Thermometer, Droplets, Wind, Sun } from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import OfflineBanner from '../components/OfflineBanner';
import MetricCard from '../components/MetricCard';

export default function LiveMonitoring() {
  const { 
    liveData, 
    liveReadings, 
    lastFetchTime,
    sessionReadingsCount,
    refreshIntervalSeconds 
  } = useLiveData();

  const sensorData = liveData?.sensor_data;

  const formattedTimestamp = sensorData?.timestamp 
    ? new Date(sensorData.timestamp).toLocaleString()
    : 'Waiting for live stream...';

  return (
    <div className="page-container" id="live-monitoring-page">
      <OfflineBanner />

      {/* Monitoring Header Bar */}
      <div 
        className="iot-card" 
        style={{ marginBottom: '24px', background: 'rgba(13, 19, 34, 0.95)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className="status-pill online">
                <Radio size={13} /> Live Stream Active
              </span>
              <span style={{ fontSize: '0.86rem', color: 'var(--cyan-primary)', fontWeight: 600 }}>
                ThingSpeak Channel #3285964
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff' }}>
              Real-Time Sensor Telemetry
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                Last Received Telemetry
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                {formattedTimestamp}
              </span>
            </div>

            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                Polling Frequency
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan-primary)' }}>
                Every {refreshIntervalSeconds}s
              </span>
            </div>

            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                Real Points Captured
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: 700 }}>
                {sessionReadingsCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Sensor Cards */}
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

      {/* 4 Dedicated Time-Series Charts (Temperature, Humidity, CO2, Light) */}
      <div className="charts-grid-2x2">
        {/* Chart 1: Temperature vs Time */}
        <div className="iot-card chart-card" id="chart-temp-container">
          <div className="chart-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Thermometer size={18} style={{ color: '#fbbf24' }} />
              <span className="card-title">Temperature vs Time (°C)</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              {liveReadings.length} points
            </span>
          </div>
          <div className="chart-body">
            {liveReadings.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={liveReadings} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="timeLabel" stroke="#475569" fontSize={11} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={11} domain={['auto', 'auto']} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0d1322', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    name="Temperature (°C)" 
                    stroke="#fbbf24" 
                    strokeWidth={2.5} 
                    dot={{ fill: '#fbbf24', r: 3 }}
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <Clock className="empty-state-icon" />
                <p>Waiting for live sensor data...</p>
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Humidity vs Time */}
        <div className="iot-card chart-card" id="chart-humidity-container">
          <div className="chart-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Droplets size={18} style={{ color: '#38bdf8' }} />
              <span className="card-title">Humidity vs Time (%)</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              {liveReadings.length} points
            </span>
          </div>
          <div className="chart-body">
            {liveReadings.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={liveReadings} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="timeLabel" stroke="#475569" fontSize={11} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={11} domain={['auto', 'auto']} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0d1322', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="humidity" 
                    name="Humidity (%)" 
                    stroke="#38bdf8" 
                    strokeWidth={2.5} 
                    dot={{ fill: '#38bdf8', r: 3 }}
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <Clock className="empty-state-icon" />
                <p>Waiting for live sensor data...</p>
              </div>
            )}
          </div>
        </div>

        {/* Chart 3: CO2 vs Time */}
        <div className="iot-card chart-card" id="chart-co2-container">
          <div className="chart-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wind size={18} style={{ color: '#fb7185' }} />
              <span className="card-title">CO2 vs Time (ppm)</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              {liveReadings.length} points
            </span>
          </div>
          <div className="chart-body">
            {liveReadings.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={liveReadings} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="timeLabel" stroke="#475569" fontSize={11} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={11} domain={['auto', 'auto']} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0d1322', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="co2" 
                    name="CO2 (ppm)" 
                    stroke="#fb7185" 
                    strokeWidth={2.5} 
                    dot={{ fill: '#fb7185', r: 3 }}
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <Clock className="empty-state-icon" />
                <p>Waiting for live sensor data...</p>
              </div>
            )}
          </div>
        </div>

        {/* Chart 4: Light vs Time */}
        <div className="iot-card chart-card" id="chart-light-container">
          <div className="chart-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sun size={18} style={{ color: '#facc15' }} />
              <span className="card-title">Light vs Time (Lux)</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              {liveReadings.length} points
            </span>
          </div>
          <div className="chart-body">
            {liveReadings.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={liveReadings} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="timeLabel" stroke="#475569" fontSize={11} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={11} domain={['auto', 'auto']} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0d1322', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="light" 
                    name="Light (Lux)" 
                    stroke="#facc15" 
                    strokeWidth={2.5} 
                    dot={{ fill: '#facc15', r: 3 }}
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <Clock className="empty-state-icon" />
                <p>Waiting for live sensor data...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
