import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AdminPage from './pages/admin';
import AuthPage from './pages/auth';
import ResetPasswordPage from './pages/reset';
// import Dashboard from './pages/dash'; // We will replace this
import UserDashboardPage from './pages/UserDashboardPage'; // New User Dashboard Page

// Helper for protected routes (basic example)
const ProtectedRoute = ({ element, accessLevelRequired }) => {
  const token = localStorage.getItem('accessToken');
  const userAccessLevel = localStorage.getItem('accessLevel');

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (accessLevelRequired && userAccessLevel !== accessLevelRequired) {
    // If access level doesn't match, redirect to a default page or login
    // For simplicity, redirecting to login. You might want a different behavior.
    alert(`Access Denied. Required: ${accessLevelRequired}, You have: ${userAccessLevel}`);
    return <Navigate to="/login" replace />;
  }
  return element;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<AuthPage view="login" />} />
        <Route path="/register" element={<AuthPage view="register" />} />
        <Route path="/forgot" element={<AuthPage view="forgot" />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Admin Section - Protected */}
        <Route
          path="/admin/*"
          element={<ProtectedRoute element={<AdminPage />} accessLevelRequired="admin" />}
        />

        {/* User Dashboard Section - Protected */}
        <Route
          path="/user/*"
          element={<ProtectedRoute element={<UserDashboardPage />} accessLevelRequired="user" />}
        />
        
        {/* Default Redirect Logic */}
        <Route path="/" element={<NavigateToDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} /> {/* Catch-all redirects to NavigateToDashboard */}

      </Routes>
    </Router>
  );
};

// Component to handle initial navigation based on role
const NavigateToDashboard = () => {
  const token = localStorage.getItem('accessToken');
  const accessLevel = localStorage.getItem('accessLevel');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (accessLevel === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (accessLevel === 'user') {
    return <Navigate to="/user/dashboard" replace />;
  } else {
    // Fallback if accessLevel is not set or unexpected value
    return <Navigate to="/login" replace />;
  }
};

export default App;
