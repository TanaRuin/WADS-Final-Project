import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import NavbarComponent from '../components/navbar';
import DashboardComponent from '../components/dashboard';
import TicketsComponent from '../components/Tickets';
import SettingsComponent from '../components/Settings';

const AdminPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <NavbarComponent 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 overflow-auto pt-16 md:pt-0">
        <Routes>
          <Route path="dashboard" element={<DashboardComponent />} />
          <Route path="tickets" element={<TicketsComponent />} />
          <Route path="settings" element={<SettingsComponent />} />
          <Route path="" element={<Navigate to="dashboard" replace />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPage;
