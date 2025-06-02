import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import navbar from '../components/navbar'; // New Navbar for User
import MyTickets from '../components/MyTickets'; // New Component
import CreateTicketForm from '../components/CreateTicketForm'; // New Component
import UserTicketDetail from '../components/UserTicketDetail'; // New Component
import SettingsComponent from '../components/Settings'; // Can reuse if settings are similar
import api from '../api/axiosInstance';


const UserDashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/user/getProfile');
        setUserData(response.data.userdata);
      } catch (error) {
        console.error("Failed to fetch user profile for dashboard:", error);
        // Handle error, e.g., navigate to login
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchUserProfile();
  }, []);

  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
        <p className="ml-4 text-lg">Loading User Data...</p>
      </div>
    );
  }


  if (!userData) {
     return <Navigate to="/login" replace />; // Or some error page
  }


  return (
    <div className="flex h-screen bg-gray-100">
      <navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userName={`${userData.firstName} ${userData.lastName}`}
        profileImage={userData.profileImage}
      />
      <div className="flex-1 overflow-auto pt-16 md:pt-0">
        <Routes>
          <Route path="dashboard" element={<MyTickets userData={userData} />} /> {/* Default to MyTickets */}
          <Route path="my-tickets" element={<MyTickets userData={userData} />} />
          <Route path="my-tickets/:ticketId" element={<UserTicketDetail userData={userData} />} />
          <Route path="create-ticket" element={<CreateTicketForm userData={userData} />} />
          <Route path="settings" element={<SettingsComponent />} /> {/* Assuming SettingsComponent can be reused */}
          <Route path="" element={<Navigate to="dashboard" replace />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserDashboardPage;