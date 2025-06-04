// UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Calendar, Tag, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import api from '../api/axiosInstance';

const UserDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Fetch user's tickets
 const fetchUserTickets = async () => {
  setLoading(true);
  try {
    const { data } = await api.get('/ticket/user');
    console.log('API Response:', data); // Add this to debug
    
    // Ensure data is always an array
    setTickets(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    setTickets([]); // Set empty array on error
  } finally {
    setLoading(false);
  }
};

  // View ticket details
  const viewTicket = async (ticketId) => {
    try {
      const { data } = await api.get(`/ticket/get/${ticketId}`);
      setSelectedTicket(data);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
    }
  };

  // Get status icon and color
  const getStatusDisplay = (status) => {
    const statusConfig = {
      open: { 
        icon: <AlertCircle className="w-4 h-4" />, 
        color: 'text-green-600 bg-green-100',
        text: 'Open' 
      },
      closed: { 
        icon: <XCircle className="w-4 h-4" />, 
        color: 'text-red-600 bg-red-100',
        text: 'Closed' 
      },
      pending: { 
        icon: <Clock className="w-4 h-4" />, 
        color: 'text-orange-600 bg-orange-100',
        text: 'Pending' 
      },
      resolved: { 
        icon: <CheckCircle className="w-4 h-4" />, 
        color: 'text-blue-600 bg-blue-100',
        text: 'Resolved' 
      }
    };
    return statusConfig[status] || { 
      icon: <AlertCircle className="w-4 h-4" />, 
      color: 'text-gray-600 bg-gray-100',
      text: status 
    };
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600 bg-red-100',
      medium: 'text-yellow-600 bg-yellow-100',
      low: 'text-green-600 bg-green-100'
    };
    return colors[priority?.toLowerCase()] || 'text-gray-600 bg-gray-100';
  };

  // Filter tickets
  const filteredTickets = tickets.filter(ticket =>
    ticket.Issue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  useEffect(() => {
    fetchUserTickets();
  }, []);

  // Ticket detail modal
  if (selectedTicket) {
    const statusDisplay = getStatusDisplay(selectedTicket.status);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedTicket.Issue}</h2>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <span className="text-sm text-gray-500">Status</span>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.color} mt-1`}>
                  {statusDisplay.icon}
                  <span className="ml-1">{statusDisplay.text}</span>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Priority</span>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)} mt-1`}>
                  {selectedTicket.priority}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Category</span>
                <p className="font-medium">{selectedTicket.category}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Date Created</span>
                <p className="font-medium">{formatDate(selectedTicket.createdAt)}</p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm text-gray-500 mb-2">Description</h3>
              <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedTicket.description}</p>
            </div>

            {selectedTicket.comments && selectedTicket.comments.length > 0 && (
              <div>
                <h3 className="text-sm text-gray-500 mb-3">Comments</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedTicket.comments.map((comment, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">{comment.author || 'System'}</span>
                        <span className="text-xs text-gray-500">{formatDate(comment.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.message || comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
          <p className="text-gray-600">Track and manage your support requests</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Tag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Tickets</p>
              <p className="text-2xl font-semibold text-gray-900">{tickets.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <AlertCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Open</p>
              <p className="text-2xl font-semibold text-gray-900">
                {tickets.filter(t => t.status === 'open').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg mr-3">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                {tickets.filter(t => t.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Closed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {tickets.filter(t => t.status === 'closed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-500">You haven't created any tickets yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.map((ticket) => {
                  const statusDisplay = getStatusDisplay(ticket.status);
                  return (
                    <tr key={ticket.ticketId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{ticket.Issue}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {ticket.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{ticket.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusDisplay.color}`}>
                          {statusDisplay.icon}
                          <span className="ml-1">{statusDisplay.text}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(ticket.dateIssued)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => viewTicket(ticket.ticketId)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;