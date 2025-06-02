import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Search, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';
import api from '../api/axiosInstance';

const MyTickets = ({ userData }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  useEffect(() => {
    const fetchTickets = async () => {
      if (!userData || !userData.userId) {
        setError("User data not available.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Fetch tickets for the logged-in user
        const response = await api.get(`/ticket/getall?userId=${userData.userId}`);
        setTickets(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch user tickets:", err);
        setError(err.response?.data?.message || 'Failed to load tickets. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [userData]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'closed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleViewTicket = (ticketId) => {
    const ticketCode = tickets.find(t => t.code === ticketId)?.code; // Get the short code
    if (ticketCode) {
         navigate(`/user/my-tickets/${ticketCode}`); // Navigate using the short code as ID
    } else {
        console.error("Could not find ticket code for ID:", ticketId);
    }
  };
  
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedTickets = (currentTickets) => {
    const sortableTickets = [...currentTickets];
    if (sortConfig.key) {
      sortableTickets.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === 'dateIssued' || sortConfig.key === 'createdAt') {
          valA = new Date(a.createdAt || a.dateIssued); // Use 'createdAt' from backend, fallback to 'dateIssued'
          valB = new Date(b.createdAt || b.dateIssued);
        }
        
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableTickets;
  };
  
  const getSortDirectionIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const filteredTickets = getSortedTickets(
    tickets.filter(ticket =>
      (ticket.Issue && ticket.Issue.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ticket.status && ticket.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ticket.priority && ticket.priority.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ticket.code && ticket.code.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">My Tickets</h1>
        <div className="flex items-center w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0 mr-2">
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              placeholder="Search my tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center transition-colors"
            onClick={() => window.location.reload()} // Simple refresh
          >
            <RefreshCw size={18} className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="text-center py-10">
          <Ticket size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">You have no tickets.</p>
          <button
            onClick={() => navigate('/user/create-ticket')}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Create a New Ticket
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Ticket ID', 'Issue', 'Status', 'Priority', 'Date Issued', 'Actions'].map((header, index) => {
                  const sortKeyMap = { 'Ticket ID': 'code', 'Date Issued': 'createdAt' };
                  const key = sortKeyMap[header] || header.toLowerCase();
                  return (
                    <th
                      key={index}
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort(key)}
                    >
                      <div className="flex items-center">
                        {header}
                        {getSortDirectionIcon(key)}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.code} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.code}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ticket.Issue}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)} text-white capitalize`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ticket.priority}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(ticket.createdAt || ticket.dateIssued).toLocaleDateString()} {/* Use createdAt from backend */}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleViewTicket(ticket.code)}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                      title="View Details"
                    >
                      <Eye size={18} className="mr-1" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyTickets;