import React from 'react';
import { Thermometer, Droplets, Wind, Sun } from 'lucide-react';

const SENSOR_META = {
  temperature: {
    label: 'Temperature',
    unit: '°C',
    icon: Thermometer,
    cardClass: 'temp',
    idealRange: '20°C - 26°C',
  },
  humidity: {
    label: 'Humidity',
    unit: '%',
    icon: Droplets,
    cardClass: 'humidity',
    idealRange: '30% - 60%',
  },
  co2: {
    label: 'Carbon Dioxide',
    unit: 'ppm',
    icon: Wind,
    cardClass: 'co2',
    idealRange: '< 800 ppm',
  },
  light: {
    label: 'Light Intensity',
    unit: 'Lux',
    icon: Sun,
    cardClass: 'light',
    idealRange: '100 - 500 Lux',
  },
};

export default function MetricCard({ type, value, timestamp, entryId }) {
  const meta = SENSOR_META[type] || {
    label: type,
    unit: '',
    icon: Sun,
    cardClass: 'temp',
    idealRange: 'N/A',
  };

  const Icon = meta.icon;
  const isLoaded = value !== undefined && value !== null;

  return (
    <div className={`sensor-card ${meta.cardClass}`} id={`metric-card-${type}`}>
      <div className="sensor-card-top">
        <span className="sensor-name">{meta.label}</span>
        <div className="sensor-icon-wrapper">
          <Icon size={20} />
        </div>
      </div>

      <div className="sensor-value-row">
        {isLoaded ? (
          <>
            <span className="sensor-value" id={`metric-val-${type}`}>
              {typeof value === 'number' ? value.toFixed(1) : value}
            </span>
            <span className="sensor-unit">{meta.unit}</span>
          </>
        ) : (
          <span style={{ fontSize: '0.95rem', color: 'var(--text-dim)' }}>
            Waiting for live data...
          </span>
        )}
      </div>

      <div className="sensor-footer">
        <span>Ideal: {meta.idealRange}</span>
        {entryId && <span>Feed #{entryId}</span>}
      </div>
    </div>
  );
}
