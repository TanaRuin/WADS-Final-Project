import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AdminPage from './pages/admin';
import AuthPage from './pages/auth';
import ResetPasswordPage from './pages/reset';
import UserPage from './pages/user';
import Settings from './components/settings';
import EmailVerification from './components/EmailVerification';
import { auth } from './config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes - Public */}
        <Route path="/login" element={<AuthPage view="login" />} />
        <Route path="/register" element={<AuthPage view="register" />} />
        <Route path="/forgot" element={<AuthPage view="forgot" />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        
        {/* Email Verification Route - Public */}
        <Route path="/verify-email" element={<EmailVerification />} />

        {/* Protected Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        } />
        
        <Route path="/user/*" element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />

        {/* Redirects */}
        <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;