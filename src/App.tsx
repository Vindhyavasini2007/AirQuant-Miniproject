import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CityProvider } from './context/CityContext';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { MapPage } from './pages/MapPage';
import { PredictionsPage } from './pages/PredictionsPage';
import { HistoricalPage } from './pages/HistoricalPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { HealthInsightsPage } from './pages/HealthInsightsPage';
import { AlertsPage } from './pages/AlertsPage';
import { AboutPage } from './pages/AboutPage';

export const App: React.FC = () => {
  return (
    <CityProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing page has custom hero layout */}
          <Route path="/" element={<LandingPage />} />

          {/* SaaS Sidebar Layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/live" element={<LiveMonitoringPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/predictions" element={<PredictionsPage />} />
            <Route path="/historical" element={<HistoricalPage />} />
            <Route path="/compare" element={<ComparisonPage />} />
            <Route path="/health" element={<HealthInsightsPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CityProvider>
  );
};

export default App;
