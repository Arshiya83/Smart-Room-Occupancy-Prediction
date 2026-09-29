import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  ShieldCheck
} from 'lucide-react';
import { predictOccupancy, getLiveData } from '../services/api';
import { useLiveData } from '../context/LiveDataContext';
import OfflineBanner from '../components/OfflineBanner';

export default function OccupancyPrediction() {
  const { setManualPrediction, manualPrediction } = useLiveData();

  const [inputs, setInputs] = useState({
    temperature: '',
    humidity: '',
    co2: '',
    light: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingLive, setIsFetchingLive] = useState(false);
  const [predictionResult, setPredictionResult] = useState(manualPrediction);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Autofill form with current ThingSpeak reading via GET /api/live
  const handleUseLiveReading = async () => {
    setIsFetchingLive(true);
    setErrorMessage(null);
    try {
      const data = await getLiveData();
      if (data && data.sensor_data) {
        setInputs({
          temperature: data.sensor_data.temperature.toString(),
          humidity: data.sensor_data.humidity.toString(),
          co2: data.sensor_data.co2.toString(),
          light: data.sensor_data.light.toString(),
        });
      }
    } catch (err) {
      setErrorMessage(`Failed to fetch latest live reading: ${err.message}`);
    } finally {
      setIsFetchingLive(false);
    }
  };

  // Submit manual prediction to Flask backend via POST /api/predict
  const handleRunPrediction = async (e) => {
    e.preventDefault();
    if (!inputs.temperature || !inputs.humidity || !inputs.co2 || !inputs.light) {
      setErrorMessage('Please provide valid values for all 4 sensor fields.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await predictOccupancy(inputs);
      setPredictionResult(result);
      // Immediately store in shared context so Energy Recommendation updates dynamically
      setManualPrediction(result);
    } catch (err) {
      setErrorMessage(`Prediction failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isOccupied = predictionResult?.occupancy === 'Occupied';

  return (
    <div className="page-container" id="occupancy-prediction-page">
      <OfflineBanner />

      <div className="iot-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cpu size={22} style={{ color: 'var(--cyan-primary)' }} />
              Manual Occupancy Inference
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
              Simulate room conditions or test custom sensor profiles using the deployed <strong>Voting Ensemble</strong> machine learning pipeline.
            </p>
          </div>

          <button
            type="button"
            id="use-live-reading-btn"
            className="btn-secondary"
            onClick={handleUseLiveReading}
            disabled={isFetchingLive}
          >
            <Sparkles size={16} style={{ color: 'var(--cyan-primary)' }} />
            {isFetchingLive ? 'Fetching Live Telemetry...' : 'USE LATEST LIVE READING'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(320px, 1fr)', gap: '24px' }}>
        {/* Form Card */}
        <div className="iot-card">
          <span className="card-title">Input Sensor Features</span>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '20px' }}>
            Features are scaled through <code>smartroom_scaler.pkl</code> before model classification.
          </p>

          <form onSubmit={handleRunPrediction}>
            <div className="prediction-form">
              {/* Temperature */}
              <div className="form-group">
                <label className="form-label" htmlFor="input-temp">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Thermometer size={14} style={{ color: '#fbbf24' }} /> Temperature
                  </span>
                  <span style={{ color: 'var(--text-dim)' }}>°C</span>
                </label>
                <input
                  id="input-temp"
                  type="number"
                  step="any"
                  className="form-input"
                  placeholder="e.g. 23.5"
                  value={inputs.temperature}
                  onChange={(e) => handleInputChange('temperature', e.target.value)}
                  required
                />
              </div>

              {/* Humidity */}
              <div className="form-group">
                <label className="form-label" htmlFor="input-humidity">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Droplets size={14} style={{ color: '#38bdf8' }} /> Humidity
                  </span>
                  <span style={{ color: 'var(--text-dim)' }}>%</span>
                </label>
                <input
                  id="input-humidity"
                  type="number"
                  step="any"
                  className="form-input"
                  placeholder="e.g. 55.0"
                  value={inputs.humidity}
                  onChange={(e) => handleInputChange('humidity', e.target.value)}
                  required
                />
              </div>

              {/* CO2 */}
              <div className="form-group">
                <label className="form-label" htmlFor="input-co2">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Wind size={14} style={{ color: '#fb7185' }} /> CO2 Level
                  </span>
                  <span style={{ color: 'var(--text-dim)' }}>ppm</span>
                </label>
                <input
                  id="input-co2"
                  type="number"
                  step="any"
                  className="form-input"
                  placeholder="e.g. 520.0"
                  value={inputs.co2}
                  onChange={(e) => handleInputChange('co2', e.target.value)}
                  required
                />
              </div>

              {/* Light */}
              <div className="form-group">
                <label className="form-label" htmlFor="input-light">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sun size={14} style={{ color: '#facc15' }} /> Light Intensity
                  </span>
                  <span style={{ color: 'var(--text-dim)' }}>Lux</span>
                </label>
                <input
                  id="input-light"
                  type="number"
                  step="any"
                  className="form-input"
                  placeholder="e.g. 210.0"
                  value={inputs.light}
                  onChange={(e) => handleInputChange('light', e.target.value)}
                  required
                />
              </div>
            </div>

            {errorMessage && (
              <div style={{ color: '#fb7185', fontSize: '0.84rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} />
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              id="run-prediction-btn"
              className="btn-primary"
              style={{ width: '100%' }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Running Inference...
                </>
              ) : (
                <>
                  <Play size={16} fill="white" />
                  Run Occupancy Prediction
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prediction Results Display */}
        <div className="iot-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="card-title">Inference Output</span>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '16px' }}>
            Direct response from Flask <code>POST /api/predict</code>
          </p>

          {predictionResult ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div
                  id="result-occupancy-badge"
                  className={`occupancy-badge ${isOccupied ? 'occupied' : 'unoccupied'}`}
                  style={{ fontSize: '1.4rem', padding: '12px 28px' }}
                >
                  {predictionResult.occupancy}
                </div>
              </div>

              {/* Confidence Details */}
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.86rem' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={16} style={{ color: 'var(--cyan-primary)' }} />
                    Confidence Score
                  </span>
                  <span id="result-confidence-val" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    {predictionResult.confidence}%
                  </span>
                </div>
                <div className="confidence-track">
                  <div
                    className="confidence-fill"
                    style={{
                      width: `${predictionResult.confidence}%`,
                      background: isOccupied 
                        ? 'linear-gradient(90deg, #06b6d4, #10b981)' 
                        : 'linear-gradient(90deg, #06b6d4, #f59e0b)'
                    }}
                  />
                </div>
              </div>

              {/* Recommendation */}
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
                  Energy Advisory
                </div>
                <div id="result-recommendation-val" style={{ fontSize: '1rem', fontWeight: 600, color: isOccupied ? '#34d399' : '#fbbf24', marginTop: '4px' }}>
                  {predictionResult.recommendation}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '8px' }}>
                  Model: <strong>{predictionResult.model}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Cpu className="empty-state-icon" />
              <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Ready for Inference</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                Fill in the sensor inputs or click "USE LATEST LIVE READING" to execute inference.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
