import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ParentDashboard from './parent/ParentDashboard';
import ParentProfiles from './parent/ParentProfiles';
import ParentControls from './parent/ParentControls';
import ParentReports from './parent/ParentReports';
import ParentDownloads from './parent/ParentDownloads';
import ParentSettings from './parent/ParentSettings';
import ParentNotifications from './parent/ParentNotifications';
import ParentSidebar from './parent/ParentSidebar';
import PINGate from './parent/PINGate';

const ParentMode: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useApp();
  // TEMPORARILY BYPASS PIN GATE FOR TESTING
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const handlePINSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/');
  };

  // TEMPORARILY BYPASS PIN GATE FOR TESTING
  // if (!isAuthenticated) {
  //   return <PINGate onSuccess={handlePINSuccess} />;
  // }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <ParentSidebar onLogout={handleLogout} />
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        <Routes>
          <Route path="/" element={<ParentDashboard />} />
          <Route path="/profiles" element={<ParentProfiles />} />
          <Route path="/controls" element={<ParentControls />} />
          <Route path="/reports" element={<ParentReports />} />
          <Route path="/downloads" element={<ParentDownloads />} />
          <Route path="/settings" element={<ParentSettings />} />
          <Route path="/notifications" element={<ParentNotifications />} />
        </Routes>
      </div>
    </div>
  );
};

export default ParentMode;
