import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';

export default function Header({ pageTitle }) {
  const { 
    backendStatus, 
    isFetching, 
    refreshLiveData, 
    lastUpdatedTimestamp,
    useMock 
  } = useLiveData();

  let formattedTimestamp = null;
  if (lastUpdatedTimestamp) {
    try {
      formattedTimestamp = new Date(lastUpdatedTimestamp).toLocaleString();
    } catch {
      formattedTimestamp = lastUpdatedTimestamp;
    }
  }

  return (
    <header className="app-header" id="main-header">
      <div className="header-left">
        <h2 className="page-title">{pageTitle}</h2>
      </div>

      <div className="header-right">
        {/* Mock Mode Alert Badge (if enabled via VITE_USE_MOCK) */}
        {useMock && (
          <span className="status-pill checking" id="mock-mode-badge">
            <AlertTriangle size={13} />
            MOCK MODE
          </span>
        )}

        {/* Backend Connectivity Status Badge */}
        {backendStatus === 'online' ? (
          <div className="status-pill online" id="backend-status-badge">
            <span className="pulse-dot online"></span>
            LIVE
          </div>
        ) : backendStatus === 'offline' ? (
          <div className="status-pill offline" id="backend-status-badge">
            <span className="pulse-dot offline"></span>
            BACKEND OFFLINE
          </div>
        ) : (
          <div className="status-pill checking" id="backend-status-badge">
            <span className="pulse-dot checking"></span>
            CONNECTING...
          </div>
        )}

        {/* Last updated time strictly uses sensor_data.timestamp */}
        {formattedTimestamp && (
          <span id="last-updated-timestamp" style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            Last Updated: {formattedTimestamp}
          </span>
        )}

        {/* Manual Refresh Button */}
        <button
          id="manual-refresh-btn"
          onClick={refreshLiveData}
          disabled={isFetching}
          className={`btn-icon ${isFetching ? 'spinning' : ''}`}
          title="Refresh Live Sensor Data"
          aria-label="Refresh Live Data"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </header>
  );
}
