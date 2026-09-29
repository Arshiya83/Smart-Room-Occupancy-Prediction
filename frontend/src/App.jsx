import React, { useState } from 'react';
import { LiveDataProvider } from './context/LiveDataContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import LiveMonitoring from './pages/LiveMonitoring';
import OccupancyPrediction from './pages/OccupancyPrediction';
import EnergyAdvisory from './pages/EnergyAdvisory';
import Analytics from './pages/Analytics';
import MLModels from './pages/MLModels';
import AboutProject from './pages/AboutProject';

const TAB_TITLES = {
  'dashboard': 'System Overview & Live Dashboard',
  'live-monitoring': 'Live IoT Telemetry & Sensor Graphs',
  'occupancy-prediction': 'Manual ML Occupancy Inference',
  'energy-recommendation': 'Building Automation Energy Advisory',
  'analytics': 'Historical Sensor & Prediction Analytics',
  'ml-models': 'Supervised ML Model Benchmark',
  'about-project': 'Architecture & Project Documentation',
};

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'live-monitoring':
        return <LiveMonitoring />;
      case 'occupancy-prediction':
        return <OccupancyPrediction />;
      case 'energy-recommendation':
        return <EnergyAdvisory />;
      case 'analytics':
        return <Analytics />;
      case 'ml-models':
        return <MLModels />;
      case 'about-project':
        return <AboutProject />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <LiveDataProvider>
      <div className="app-container">
        <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />
        <main className="app-main">
          <Header pageTitle={TAB_TITLES[currentTab] || 'SmartRoom AI'} />
          {renderContent()}
        </main>
      </div>
    </LiveDataProvider>
  );
}
