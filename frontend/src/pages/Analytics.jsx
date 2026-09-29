import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { BarChart3, Clock, RefreshCw, FileText, Database } from 'lucide-react';
import { getHistory } from '../services/api';
import OfflineBanner from '../components/OfflineBanner';

export default function Analytics() {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const records = await getHistory();
      if (Array.isArray(records)) {
        setHistoryData(records);
      } else {
        setHistoryData([]);
      }
    } catch (err) {
      setErrorMessage(`Failed to load prediction history: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Format data for chart display
  const chartData = historyData.map((row, idx) => {
    let timeLabel = `#${idx + 1}`;
    if (row.timestamp) {
      try {
        const d = new Date(row.timestamp);
        timeLabel = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      } catch {
        timeLabel = row.timestamp;
      }
    }
    return {
      ...row,
      timeLabel,
      temp: Number(row.temperature),
      hum: Number(row.humidity),
      co2: Number(row.co2),
      light: Number(row.light),
      conf: Number(row.confidence),
    };
  });

  return (
    <div className="page-container" id="analytics-page">
      <OfflineBanner />

      <div className="iot-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BarChart3 size={22} style={{ color: 'var(--cyan-primary)' }} />
              Historical Prediction Analytics
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
              Audited prediction history logged to <code>prediction_history.csv</code> by Flask backend.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              {historyData.length} records found
            </span>
            <button
              id="refresh-history-btn"
              className="btn-secondary"
              onClick={fetchHistory}
              disabled={isLoading}
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              Refresh History
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="iot-card" style={{ padding: '60px 0', textAlign: 'center' }}>
          <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px', color: 'var(--cyan-primary)' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading historical records from backend...</p>
        </div>
      ) : historyData.length === 0 ? (
        <div className="iot-card empty-state" id="no-history-state">
          <Database className="empty-state-icon" />
          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>
            No prediction history available
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Historical prediction records will be saved automatically as live sensor inferences run.
          </p>
        </div>
      ) : (
        <>
          {/* Historical Trends Chart */}
          <div className="iot-card" style={{ marginBottom: '24px' }}>
            <span className="card-title">Historical Sensor &amp; Confidence Timeline</span>
            <div style={{ width: '100%', height: 280, marginTop: '16px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="timeLabel" stroke="#475569" fontSize={11} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0d1322', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="co2" name="CO2 (ppm)" stroke="#fb7185" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="light" name="Light (Lux)" stroke="#facc15" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="temp" name="Temp (°C)" stroke="#fbbf24" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="hum" name="Humidity (%)" stroke="#38bdf8" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Historical Records Table */}
          <div className="iot-card">
            <span className="card-title">Prediction Log Records</span>
            <div className="data-table-container">
              <table className="iot-table" id="history-data-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Temp (°C)</th>
                    <th>Humidity (%)</th>
                    <th>CO2 (ppm)</th>
                    <th>Light (Lux)</th>
                    <th>Occupancy</th>
                    <th>Confidence</th>
                    <th>Recommendation</th>
                    <th>Model</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((row, index) => {
                    const isOccupied = row.occupancy === 'Occupied';
                    let formattedDate = row.timestamp;
                    try {
                      formattedDate = new Date(row.timestamp).toLocaleString();
                    } catch {
                      formattedDate = row.timestamp;
                    }
                    return (
                      <tr key={index}>
                        <td className="mono" style={{ whiteSpace: 'nowrap' }}>{formattedDate}</td>
                        <td className="mono">{row.temperature}</td>
                        <td className="mono">{row.humidity}</td>
                        <td className="mono">{row.co2}</td>
                        <td className="mono">{row.light}</td>
                        <td>
                          <span 
                            style={{
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              background: isOccupied ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: isOccupied ? '#34d399' : '#fbbf24'
                            }}
                          >
                            {row.occupancy}
                          </span>
                        </td>
                        <td className="mono" style={{ fontWeight: 600 }}>{row.confidence}%</td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{row.recommendation}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--cyan-primary)' }}>{row.model}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
