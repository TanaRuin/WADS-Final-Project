import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AdminPage from './pages/admin';
import AuthPage from './pages/auth'; 
import ResetPasswordPage from './pages/reset';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<AuthPage view="login" />} />
        <Route path="/register" element={<AuthPage view="register" />} />
        <Route path="/forgot" element={<AuthPage view="forgot" />} />

        {/* Admin Section */}
        <Route path="/admin/*" element={<AdminPage />} />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        {/*Reset Page Route*/}
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        
      </Routes>
    </Router>
  );
};

export default App;
