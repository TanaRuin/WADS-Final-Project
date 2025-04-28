import { useState } from 'react';
import { Settings, Users, Search, Edit2 } from 'lucide-react';
import "./App.css";
import belantaraImage from './assets/belantara.png';

export default function HelpdeskDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [tickets] = useState({
    total: 100,
    recent: {
      user: "",
      submitted: "",
      subject: "",
      issue: ""
    }
  });

  const [assignees] = useState({
    total: 5,
    list: [
      { name: "", email: "" },
      { name: "", email: "" },
      { name: "", email: "" },
      { name: "", email: "" }
    ]
  });
  
  return (
    <div className="fixed inset-0 flex flex-col md:flex-row">
      <div className="w-full md:w-48 bg-white shadow-md flex flex-col h-screen">
        <div className="flex-none p-4 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-white border-2 border-green-500 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
              <img src={belantaraImage} alt="Belantara Foundation" className="rounded-full" />
            </div>
          </div>
        </div>
        
        {/* Menu items */}
        <div className="flex-grow overflow-y-auto">
          <div className="mt-6">
            {/* Dashboard */}
            <button 
              className={`w-full flex items-center px-4 py-2 ${activeTab === 'dashboard' ? 'bg-gray-100 text-black' : 'text-gray-500 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="w-4 h-4 bg-gray-800 mr-3"></div>
              <span>Dashboard</span>
            </button>
            
            {/* Tickets */}
            <button 
              className={`w-full flex items-center px-4 py-2 ${activeTab === 'tickets' ? 'bg-gray-100 text-black' : 'text-gray-500 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('tickets')}
            >
              <div className="w-4 h-4 bg-gray-800 mr-3"></div>
              <span>Tickets</span>
            </button>
            
            {/* Settings */}
            <button 
              className={`w-full flex items-center px-4 py-2 ${activeTab === 'settings' ? 'bg-gray-100 text-black' : 'text-gray-500 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={16} className="mr-3" />
              <span>Settings</span>
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 w-full">
          <div className="flex space-x-2 mb-4 justify-center">
            <SocialIcon type="facebook" />
            <SocialIcon type="twitter" />
            <SocialIcon type="youtube" />
            <SocialIcon type="instagram" />
          </div>
          <button 
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded w-full" 
            style={{ backgroundColor: '#dc2626' }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 bg-gray-100 overflow-auto">
        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <button className="p-2 md:hidden">
                <div className="flex flex-col space-y-1">
                  <div className="h-0.5 w-6 bg-black"></div>
                  <div className="h-0.5 w-6 bg-black"></div>
                  <div className="h-0.5 w-6 bg-black"></div>
                </div>
              </button>
              
              <div className="relative w-full md:w-64 ml-auto md:ml-0">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tickets */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-700">Total Tickets</h2>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <div className="w-6 h-6 bg-green-500 rounded-sm"></div>
                  </div>
                  <span className="text-5xl font-bold">{tickets.total}</span>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-blue-800 font-medium">Most Recent Ticket</h3>
                    <button className="text-blue-800 font-medium">See Details</button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">User</p>
                      <p className="font-medium">{tickets.recent.user || "No data"}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Submitted</p>
                      <p className="font-medium">{tickets.recent.submitted || "No data"}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Subject</p>
                      <p className="font-medium">{tickets.recent.subject || "No data"}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Ticket Issue</p>
                      <p className="font-medium">{tickets.recent.issue || "No data"}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Assignees */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-700">Total Assignees</h2>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <Users size={24} className="text-green-500" />
                  </div>
                  <span className="text-5xl font-bold">{assignees.total}</span>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Assignee List</h3>
                    <button className="text-green-500 font-medium">View All</button>
                  </div>
                  
                  <div className="space-y-4">
                    {assignees.list.map((assignee, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                            <Users size={16} className="text-green-500" />
                          </div>
                          <div>
                            <p className="font-medium">{assignee.name || `Assignee ${index + 1}`}</p>
                            <p className="text-sm text-gray-500">{assignee.email || "No email"}</p>
                          </div>
                        </div>
                        <button className="text-blue-800">
                          <Edit2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Tickets</h1>
          </div>
        )}
        
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
          </div>
        )}
      </div>
    </div>
  );
}

function SocialIcon({ type = "facebook" }) {
  let bgColorClass = "bg-blue-600"; 
  
  if (type === "twitter") {
    bgColorClass = "bg-blue-400";
  } else if (type === "youtube") {
    bgColorClass = "bg-red-600";
  } else if (type === "instagram") {
    bgColorClass = "bg-pink-600";
  }
  
  return (
    <div className={`w-8 h-8 rounded-full ${bgColorClass} flex items-center justify-center`}>
      {type === "facebook" && <div className="w-3 h-3 bg-white rounded-sm"></div>}
      {type === "twitter" && <div className="w-3 h-3 bg-white"></div>}
      {type === "youtube" && <div className="w-3 h-3 bg-white"></div>}
      {type === "instagram" && <div className="w-3 h-3 bg-white rounded-sm"></div>}
    </div>
  );
}