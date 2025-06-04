import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserNavbar from '../components/UserNavbar';
import UserDashboard from '../components/UserDashboard';
import CreateTicket from '../components/CreateTicket';
import Settings from '../components/Settings'; 

const UserPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Navbar */}
      <UserNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden ml-0 md:ml-48">
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="create-ticket" element={<CreateTicket />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default UserPage;