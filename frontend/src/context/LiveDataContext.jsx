import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { getLiveData, USE_MOCK } from '../services/api';

const LiveDataContext = createContext(null);

const REFRESH_INTERVAL_MS = parseInt(import.meta.env.VITE_LIVE_REFRESH_MS || '15000', 10);
const MAX_HISTORY_POINTS = 50;

export function LiveDataProvider({ children }) {
  // Real live data from GET /api/live
  const [liveData, setLiveData] = useState(null);
  
  // Rolling list of real readings for time-series charts (strictly real, no fake initial points)
  const [liveReadings, setLiveReadings] = useState([]);
  
  // Track last entry_id to prevent duplicate points in charts
  const lastEntryIdRef = useRef(null);

  // Connection & status states
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [errorMessage, setErrorMessage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [sessionReadingsCount, setSessionReadingsCount] = useState(0);

  // Shared manual prediction state from POST /api/predict
  const [manualPrediction, setManualPrediction] = useState(null);

  // Clear manual prediction to resume live telemetry prediction
  const clearManualPrediction = useCallback(() => {
    setManualPrediction(null);
  }, []);

  // Fetch live sensor data and prediction
  const fetchLatest = useCallback(async () => {
    setIsFetching(true);
    try {
      const data = await getLiveData();
      
      // Update backend status to online
      setBackendStatus('online');
      setErrorMessage(null);

      if (data && data.sensor_data && data.prediction) {
        // Update liveData state so all cards reflect latest readings
        setLiveData(data);

        const currentEntryId = data.sensor_data.entry_id;

        // Duplicate protection: only append to chart history if entry_id changed
        const isNewEntry = currentEntryId !== undefined && 
                           currentEntryId !== null && 
                           (lastEntryIdRef.current === null || String(currentEntryId) !== String(lastEntryIdRef.current));

        if (isNewEntry) {
          lastEntryIdRef.current = currentEntryId;

          // Format timestamp for chart X-axis display
          const rawTimestamp = data.sensor_data.timestamp;
          let formattedTime = '';
          try {
            const dateObj = new Date(rawTimestamp);
            formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          } catch {
            formattedTime = rawTimestamp;
          }

          const newPoint = {
            id: currentEntryId,
            timestamp: rawTimestamp,
            timeLabel: formattedTime,
            temperature: Number(data.sensor_data.temperature),
            humidity: Number(data.sensor_data.humidity),
            co2: Number(data.sensor_data.co2),
            light: Number(data.sensor_data.light),
            occupancy: data.prediction.occupancy,
            confidence: Number(data.prediction.confidence),
            recommendation: data.prediction.recommendation,
          };

          setLiveReadings((prev) => {
            const updated = [...prev, newPoint];
            // Enforce rolling window of latest 50 readings
            return updated.slice(-MAX_HISTORY_POINTS);
          });

          setSessionReadingsCount((count) => count + 1);
        }
      }
    } catch (err) {
      console.error('[LiveDataContext] Error fetching live data:', err);
      setBackendStatus('offline');
      setErrorMessage(err.message || 'Unable to retrieve live sensor data.');
    } finally {
      setIsFetching(false);
    }
  }, []);

  // Polling lifecycle management: calls immediately on mount, repeats every 15s, cleans up on unmount
  useEffect(() => {
    // 1. Initial fetch on mount
    fetchLatest();

    // 2. Schedule recurring 15-second polling interval
    const intervalId = setInterval(() => {
      fetchLatest();
    }, REFRESH_INTERVAL_MS);

    // 3. Clean up on unmount to prevent memory leaks or duplicate polling loops
    return () => clearInterval(intervalId);
  }, [fetchLatest]);

  // Last updated time strictly uses sensor_data.timestamp from backend
  const lastUpdatedTimestamp = liveData?.sensor_data?.timestamp || null;

  // Active prediction: latest manual prediction if available, otherwise latest live prediction
  const livePrediction = liveData?.prediction || null;
  const activePrediction = manualPrediction || livePrediction;

  const value = {
    liveData,
    liveReadings,
    backendStatus,
    errorMessage,
    isFetching,
    lastUpdatedTimestamp,
    sessionReadingsCount,
    refreshLiveData: fetchLatest,
    refreshIntervalSeconds: Math.round(REFRESH_INTERVAL_MS / 1000),
    useMock: USE_MOCK,
    // Shared prediction state
    manualPrediction,
    setManualPrediction,
    clearManualPrediction,
    livePrediction,
    activePrediction,
  };

  return (
    <LiveDataContext.Provider value={value}>
      {children}
    </LiveDataContext.Provider>
  );
}

export function useLiveData() {
  const context = useContext(LiveDataContext);
  if (!context) {
    throw new Error('useLiveData must be used within a LiveDataProvider');
  }
  return context;
}
