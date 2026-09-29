import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';

export default function OfflineBanner() {
  const { backendStatus, errorMessage, refreshLiveData, isFetching, liveData } = useLiveData();

  if (backendStatus !== 'offline') {
    return null;
  }

  return (
    <div className="offline-banner" id="backend-offline-banner" role="alert">
      <div className="offline-banner-content">
        <AlertOctagon size={24} style={{ color: '#fb7185', flexShrink: 0 }} />
        <div>
          <div className="offline-title">BACKEND OFFLINE</div>
          <div className="offline-sub">
            {liveData ? 'Unable to retrieve latest sensor data. Displaying last verified reading.' : 'Unable to retrieve live sensor data.'}
            {errorMessage ? ` (${errorMessage})` : ''}
          </div>
        </div>
      </div>
      <button
        id="offline-retry-btn"
        className="btn-secondary"
        onClick={refreshLiveData}
        disabled={isFetching}
        style={{ padding: '8px 14px', fontSize: '0.82rem' }}
      >
        <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
        Retry Connection
      </button>
    </div>
  );
}
