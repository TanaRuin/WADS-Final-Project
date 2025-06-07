import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Settings, LayoutDashboard, Menu, X } from 'lucide-react';
import Dashboard from '../components/dashboard';
import SettingsComponent from '../components/settings';
import { auth } from '../config/firebase';
import belantaraImage from '../assets/belantara.png';

const UserPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const goTo = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed md:relative
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        transition-transform duration-300 ease-in-out
        w-64 md:w-48 h-full bg-white shadow-lg
        z-40 flex flex-col
        overflow-y-auto
      `}>
        {/* Logo */}
        <div className="flex-none p-4 pt-16 md:pt-4 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-white border-2 border-green-500 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden">
              <img src={belantaraImage} alt="Belantara" className="w-full h-full object-cover rounded-full" />
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-grow overflow-y-auto px-2">
          <div className="mt-6 space-y-1">
            {/* Dashboard */}
            <button
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                location.pathname === '/user/dashboard'
                  ? 'bg-gray-100 text-black'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
              onClick={() => goTo('/user/dashboard')}
            >
              <LayoutDashboard size={18} className="mr-3" />
              <span className="font-medium">Dashboard</span>
            </button>

            {/* Settings */}
            <button
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                location.pathname === '/user/settings'
                  ? 'bg-gray-100 text-black'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
              onClick={() => goTo('/user/settings')}
            >
              <Settings size={18} className="mr-3" />
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white font-medium px-4 py-2 rounded-lg transition-colors hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto pt-16 md:pt-0">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings" element={<SettingsComponent />} />
          <Route path="/" element={<Navigate to="/user/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserPage; 