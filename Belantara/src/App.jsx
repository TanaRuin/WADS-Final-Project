
import { useState, useEffect } from 'react';
import { Settings, Ticket, LayoutDashboard, Menu, X } from 'lucide-react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import "./App.css";
import axios from 'axios';
import belantaraImage from './assets/belantara.png';
// Import components
import SettingsPage from './Settings';
import TicketsPage from './Tickets';

export default function HelpdeskDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    total: 0,
    recent: {
      user: "",
      submitted: "",
      subject: "",
      issue: "",
      category: "",
      priority: "",
      status: ""
    },
    priorityData: [],
    statusData: [],
    monthlyData: []
  });

  // Fetch dashboard data from the backend
  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const response = await axios.get('http://localhost:5000/api/ticket/dashboard', {

      });

      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

    if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false); // Close sidebar on mobile when tab changes
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
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
        {/* Logo section */}
        <div className="flex-none p-4 pt-16 md:pt-4 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-white border-2 border-green-500 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden">
              <img src={belantaraImage} alt="Belantara Foundation" className="w-full h-full object-cover rounded-full" />
            </div>
          </div>
        </div>
        
        {/* Menu items */}
        <div className="flex-grow overflow-y-auto px-2">
          <div className="mt-6 space-y-1">
            {/* Dashboard */}
            <button 
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'dashboard' 
                  ? 'bg-gray-100 text-black' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
              onClick={() => handleTabChange('dashboard')}
            >
              <LayoutDashboard size={18} className="mr-3" />
              <span className="font-medium">Dashboard</span>
            </button>
            
            {/* Tickets */}
            <button 
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'tickets' 
                  ? 'bg-gray-100 text-black' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
              onClick={() => handleTabChange('tickets')}
            >
              <Ticket size={18} className="mr-3" />
              <span className="font-medium">Tickets</span>
            </button>
            
            {/* Settings */}
            <button 
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'settings' 
                  ? 'bg-gray-100 text-black' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
              onClick={() => handleTabChange('settings')}
            >
              <Settings size={18} className="mr-3" />
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </div>
        
   <div className="p-4 border-t border-gray-200">
  <div className="grid grid-cols-4 gap-2 mb-4">
    {/* Facebook Button */}
    <button
      type="button"
      className="aspect-square rounded-full border border-gray-300 flex items-center justify-center hover:bg-blue-100 transition-colors"
      aria-label="Facebook"
    >
      <FaFacebook size={20} color="#2563EB" />
    </button>

    {/* Twitter/X Button */}
    <button
      type="button"
      className="aspect-square rounded-full border border-gray-300 flex items-center justify-center hover:bg-blue-50 transition-colors"
      aria-label="Twitter/X"
    >
      <FaTwitter size={20} color="#60A5FA" />
    </button>

    {/* LinkedIn Button */}
    <button
      type="button"
      className="aspect-square rounded-full border border-gray-300 flex items-center justify-center hover:bg-blue-50 transition-colors"
      aria-label="LinkedIn"
    >
      <FaLinkedin size={20} color="#1E40AF" />
    </button>

    {/* Instagram Button */}
    <button
      type="button"
      className="aspect-square rounded-full border border-gray-300 flex items-center justify-center hover:bg-pink-50 transition-colors"
      aria-label="Instagram"
    >
      <FaInstagram size={20} color="#DB2777" />
    </button>
  </div>
          <button 
            className="text-white font-medium px-4 py-2 rounded-lg w-full transition-colors hover:bg-red-700" 
            style={{ backgroundColor: '#dc2626' }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto pt-16 md:pt-0">
        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="p-4">
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            {/* Dashboard Content */}
            {!loading && !error && (
              <>
                {/* Three sections on top */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                  {/* Total Tickets Card */}
                  <div className="bg-white rounded-lg shadow p-4 lg:col-span-1">
                    <div className="flex justify-between mb-4">
                      <h2 className="text-lg font-medium text-gray-700">Total Tickets</h2>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <div className="w-13 h-13 rounded-full bg-green-100 flex items-center justify-center mr-4">
                        <Ticket size={25}/>
                      </div>
                      <span className="text-4xl md:text-5xl font-bold">{dashboardData.total}</span>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-blue-800 font-medium text-sm md:text-base">Most Recent Ticket</h3>
                        <button
                          className="text-blue-800 font-medium text-xs md:text-sm border border-black px-2 md:px-3 py-1 rounded hover:bg-gray-50 transition-colors"
                          onClick={() => setActiveTab('tickets')}
                        >
                          See Details
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs md:text-sm text-gray-500">User</p>
                          <p className="font-medium text-xs md:text-sm truncate">{dashboardData.recent.user || "No data"}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs md:text-sm text-gray-500">Date Issued</p>
                          <p className="font-medium text-xs md:text-sm">{dashboardData.recent.submitted || "No data"}</p>
                        </div>

                        <div>
                          <p className="text-xs md:text-sm text-gray-500">Status</p>
                          <p className="font-medium text-xs md:text-sm">{dashboardData.recent.status || "No data"}</p>
                        </div>

                        <div>
                          <p className="text-xs md:text-sm text-gray-500">Category</p>
                          <p className="font-medium text-xs md:text-sm truncate">{dashboardData.recent.category || "No data"}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs md:text-sm text-gray-500">Issue</p>
                          <p className="font-medium text-xs md:text-sm truncate">{dashboardData.recent.subject || "No data"}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs md:text-sm text-gray-500">Priority</p>
                          <p className="font-medium text-xs md:text-sm">{dashboardData.recent.priority || "No data"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Priority Chart Card */}
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Tickets by Priority</h3>
                    <div className="h-56 md:h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dashboardData.priorityData}
                            cx="50%"
                            cy="50%"
                            innerRadius="40%"
                            outerRadius="60%"
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, value }) => `${name} (${value})`}
                            labelLine={false}
                          >
                            {dashboardData.priorityData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>

                          {/* Centered Text */}
                          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" dy="-20">
                            <tspan fontSize="18" fontWeight="bold" fill="#333">
                              {dashboardData.priorityData.reduce((sum, item) => sum + item.value, 0)}
                            </tspan>
                            <tspan x="50%" dy="20" fontSize="14" fill="#666">Tickets</tspan>
                          </text>

                          <Tooltip />
                          <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Status Chart Card */}
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Tickets by Status</h3>
                    <div className="h-56 md:h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dashboardData.statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius="40%"
                            outerRadius="60%"
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, value }) => `${name} (${value})`}
                            labelLine={false}
                          >
                            {dashboardData.statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>

                          {/* Centered text */}
                          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" dy="-20">
                            <tspan fontSize="18" fontWeight="bold" fill="#333">
                              {dashboardData.statusData.reduce((sum, item) => sum + item.value, 0)}
                            </tspan>
                            <tspan x="50%" dy="20" fontSize="14" fill="#666">Tickets</tspan>
                          </text>

                          <Tooltip />
                          <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                
                {/* Monthly resolution chart at the bottom */}
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Total Resolved and Unresolved Tickets by Month</h3>
                  <div className="h-64 md:h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dashboardData.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12 }}
                          interval="preserveStartEnd"
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="resolved" 
                          stroke="#eab308" 
                          activeDot={{ r: 8 }} 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="unresolved" 
                          stroke="#0ea5e9" 
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        
        {/* Tickets Tab */}
        {activeTab === 'tickets' && <TicketsPage />}
        
        {/* Settings Tab */}
        {activeTab === 'settings' && <SettingsPage />}
      </div>
    </div>
  );
}