import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AdminPage from './pages/admin';
import AuthPage from './pages/auth';
import ResetPasswordPage from './pages/reset';
import UserPage from './pages/user'; // Make sure this import is correct


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<AuthPage view="login" />} />
        <Route path="/register" element={<AuthPage view="register" />} />
        <Route path="/forgot" element={<AuthPage view="forgot" />} />
        
        {/* Reset Page Route */}
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        
        {/* Admin Section */}
        <Route path="/admin/*" element={<AdminPage />} />
        
        {/* User Section */}
        <Route path="/user/*" element={<UserPage />} />
        
        {/* Legacy Dashboard Route - Redirect to User */}
        <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />
        
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;