import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "./App.css";
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage'; 

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Section Routes */}
        <Route path="/admin/*" element={<AdminPage />} />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
