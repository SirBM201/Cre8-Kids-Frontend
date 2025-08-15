import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import KidMode from './components/KidMode';
import ParentMode from './components/ParentMode';
import EducatorMode from './components/EducatorMode';
import ModeSelector from './components/ModeSelector';
import Login from './components/auth/Login';
import ResetPassword from './components/auth/ResetPassword';

import './App.css';

// Protected Route component (temporarily bypassed for testing)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // TEMPORARILY BYPASS AUTHENTICATION FOR TESTING
  // Always allow access
  return <>{children}</>;
  
  // Original authentication logic (commented out)
  /*
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
  */
};

// Main App Routes component (temporarily bypassed for testing)
const AppRoutes: React.FC = () => {
  // TEMPORARILY BYPASS AUTHENTICATION FOR TESTING
  // const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Routes>
        {/* Temporarily removed login requirement */}
        {/* <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} /> */}
        {/* <Route path="/reset-password" element={<ResetPassword />} /> */}

        <Route path="/" element={<ModeSelector />} />
        <Route path="/kid/*" element={<KidMode />} />
        <Route path="/parent/*" element={<ParentMode />} />
        <Route path="/educator/*" element={<EducatorMode />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
