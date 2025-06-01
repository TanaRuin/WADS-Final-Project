import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import api from '../api/axiosInstance';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    monthlyData: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Use your custom axios instance here:
        const response = await api.get('/dashboard/get');

        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  
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
      
      {/* Dashboard Content */}
      {!loading && !error && (
        <>
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
                    onClick={() => navigate('/admin/tickets')}

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
          
          {/* Monthly resolution chart */}
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
  );
};

export default Dashboard;