import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { auth } from '../config/firebase';
import api from '../api/axiosInstance';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

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
    priorityDataComplete: [],
    statusDataComplete: [],
    monthlyData: []
  });

  // Color mapping functions
  const getPriorityColor = (priority) => {
    const colors = {
      'High': '#ef4444', // red
      'Medium': '#eab308', // yellow
      'Low': '#22c55e' // green
    };
    return colors[priority] || '#6b7280'; // default gray
  };

  const getStatusColor = (status) => {
    const colors = {
      'Open': '#22c55e', // green
      'Pending': '#eab308', // yellow
      'Closed': '#ef4444' // red
    };
    return colors[status] || '#6b7280'; // default gray
  };

  // Function to capitalize first letter
  const capitalize = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Create complete legend data
  const createCompleteLegendData = (data, type) => {
    const baseItems = type === 'priority' 
      ? [
          { name: 'High', value: 0, color: getPriorityColor('High') },
          { name: 'Medium', value: 0, color: getPriorityColor('Medium') },
          { name: 'Low', value: 0, color: getPriorityColor('Low') }
        ]
      : [
          { name: 'Open', value: 0, color: getStatusColor('Open') },
          { name: 'Pending', value: 0, color: getStatusColor('Pending') },
          { name: 'Closed', value: 0, color: getStatusColor('Closed') }
        ];

    // Update values from actual data
    data.forEach(item => {
      const capitalizedName = capitalize(item.name);
      const baseItem = baseItems.find(base => base.name === capitalizedName);
      if (baseItem) {
        baseItem.value = item.value;
      }
    });

    return baseItems;
  };

  useEffect(() => {
    // Check authentication state
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User is signed in with Firebase
        setUserData({
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        });

        // Set some default data for Firebase users since we don't have backend data
        setDashboardData({
          total: 1,
          recent: {
            user: user.displayName || user.email,
            submitted: new Date().toLocaleDateString(),
            subject: "Welcome to Dashboard",
            issue: "Getting Started",
            category: "General",
            priority: "Medium",
            status: "Open"
          },
          priorityData: [
            { name: "Medium", value: 1, color: "#eab308" }
          ],
          statusData: [
            { name: "Open", value: 1, color: "#22c55e" }
          ],
          monthlyData: [
            { name: new Date().toLocaleString('default', { month: 'short' }), resolved: 0, unresolved: 1 }
          ]
        });
        setError(null);
      } else {
        // No Firebase user, redirect to login
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
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

      {/* User Info (for Firebase users) */}
      {userData && !loading && !error && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center space-x-4">
            {userData.photoURL && (
              <img src={userData.photoURL} alt="Profile" className="w-12 h-12 rounded-full" />
            )}
            <div>
              <h2 className="text-xl font-semibold">{userData.name}</h2>
              <p className="text-gray-600">{userData.email}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Dashboard Content */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Total Tickets Card */}
          <div className="bg-white rounded-lg shadow p-4 lg:col-span-3">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-700">Overview</h2>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="w-13 h-13 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <Ticket size={25}/>
              </div>
              <div>
                <p className="text-sm text-gray-500">Welcome to your dashboard!</p>
                <p className="text-sm text-gray-500">You're signed in using Google Authentication</p>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-blue-800 font-medium text-sm md:text-base mb-2">Recent Activity</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <p className="text-xs md:text-sm text-gray-500">User</p>
                  <p className="font-medium text-xs md:text-sm truncate">{dashboardData.recent.user}</p>
                </div>
                
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Date</p>
                  <p className="font-medium text-xs md:text-sm">{dashboardData.recent.submitted}</p>
                </div>

                <div>
                  <p className="text-xs md:text-sm text-gray-500">Status</p>
                  <p className="font-medium text-xs md:text-sm">{dashboardData.recent.status}</p>
                </div>

                <div>
                  <p className="text-xs md:text-sm text-gray-500">Category</p>
                  <p className="font-medium text-xs md:text-sm truncate">{dashboardData.recent.category}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;