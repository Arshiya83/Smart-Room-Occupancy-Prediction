import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Cpu, 
  Zap, 
  BarChart3, 
  Boxes, 
  Info,
  Radio
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'live-monitoring', label: 'Live Monitoring', icon: Activity },
  { id: 'occupancy-prediction', label: 'Occupancy Prediction', icon: Cpu },
  { id: 'energy-recommendation', label: 'Energy Recommendation', icon: Zap },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'ml-models', label: 'ML Models', icon: Boxes },
  { id: 'about-project', label: 'About Project', icon: Info },
];

export default function Sidebar({ currentTab, onSelectTab }) {
  return (
    <aside className="app-sidebar" id="sidebar-navigation">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-icon">
          <Radio size={22} />
        </div>
        <div>
          <h1 className="brand-title">SmartRoom AI</h1>
          <p className="brand-subtitle">IoT &bull; ML Occupancy</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="nav-item-icon" />
              <span className="nav-item-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer with ThingSpeak Details */}
      <div className="sidebar-footer">
        <div className="thingspeak-badge" title="Active Live Sensor Feed">
          <Radio size={14} className="animate-pulse text-cyan-400" />
          <span>ThingSpeak #3285964</span>
        </div>
      </div>
    </aside>
  );
}
