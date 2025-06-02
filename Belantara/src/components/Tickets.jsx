import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, ArrowLeft, Paperclip } from 'lucide-react';
import api from '../api/axiosInstance';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newComment, setNewComment] = useState('');

  // Fetch all tickets
    const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/ticket/getall');
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single ticket by ID
  const fetchTicketById = async (ticketId) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/ticket/get/${ticketId}`);
      setSelectedTicket(data);
      window.history.pushState({}, '', `?ticket=${ticketId}`);
    } catch (error) {
      console.error('Error fetching ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  // Close ticket
   const closeTicket = async (ticketId) => {
    try {
      await api.post(`/ticket/close/${ticketId}`);
      await fetchTicketById(ticketId);
      await fetchTickets();
    } catch (error) {
      console.error('Error closing ticket:', error);
    }
  };

  // Handle back to tickets list
  const handleBackToTickets = () => {
    setSelectedTicket(null);
    // Remove ticket ID from URL
    window.history.pushState({}, '', window.location.pathname);
  };

  // Get status text and color
  const getStatusDisplay = (status) => {
    const statusConfig = {
      open: { text: 'Open', color: 'bg-green-500' },
      closed: { text: 'Closed', color: 'bg-red-500' },
      pending: { text: 'Pending', color: 'bg-orange-500' },
      resolved: { text: 'Resolved', color: 'bg-blue-500' }
    };
    return statusConfig[status] || { text: status, color: 'bg-gray-500' };
  };

  // Filter tickets based on search
  const filteredTickets = tickets.filter(ticket =>
    ticket.issue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check URL params on component mount
  useEffect(() => {
    fetchTickets();
    
    // Check if there's a ticket ID in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const ticketId = urlParams.get('ticket');
    if (ticketId) {
      fetchTicketById(ticketId);
    }
  }, []);

  if (selectedTicket) {
    const statusDisplay = getStatusDisplay(selectedTicket.status);
    
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackToTickets}
              className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back to Tickets
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ticket Details */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{selectedTicket.issue}</h1>
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${statusDisplay.color}`}></span>
                  <span className="text-sm font-medium">{statusDisplay.text}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <span className="text-gray-500">Submitted by</span>
                  <p className="font-semibold">{selectedTicket.user}</p>
                </div>
                <div>
                  <span className="text-gray-500">Date submitted</span>
                  <p className="font-semibold">{selectedTicket.dateIssued}</p>
                </div>
                <div>
                  <span className="text-gray-500">Category</span>
                  <p className="font-semibold">{selectedTicket.category}</p>
                </div>
                <div>
                  <span className="text-gray-500">Priority</span>
                  <p className="font-semibold">{selectedTicket.priority}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-gray-500 text-sm mb-2">Description</h3>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedTicket.description}</p>
              </div>

              {/* Attachments */}
              {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-gray-500 text-sm mb-3">Attachments</h3>
                  <div className="flex flex-wrap gap-4">
                    {selectedTicket.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                        <Paperclip className="w-4 h-4 text-gray-500" />
                        <div className="text-center">
                          <div className={`w-12 h-12 rounded flex items-center justify-center mb-1 ${
                            attachment.type === 'image' ? 'bg-green-100' :
                            attachment.type === 'pdf' ? 'bg-red-100' :
                            attachment.type === 'excel' ? 'bg-green-100' :
                            attachment.type === 'text' ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            <span className="text-xs font-semibold uppercase">
                              {attachment.type === 'image' ? 'IMG' :
                               attachment.type === 'pdf' ? 'PDF' :
                               attachment.type === 'excel' ? 'XLS' :
                               attachment.type === 'text' ? 'TXT' : 'FILE'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">{attachment.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Close Ticket Button */}
              {selectedTicket.status !== 'closed' && (
                <button
                  onClick={() => closeTicket(selectedTicket.ticketId)}
                   style={{
                    backgroundColor: '#dc2626', 
                    color: 'white',
                    padding: '0.5rem 1rem', 
                    borderRadius: '0.5rem',
                    transition: 'background-color 0.2s ease-in-out', 
                  }}
                >
                  Close Ticket
                </button>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Comments</h2>
              
              {/* Comments List */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {selectedTicket.comments && selectedTicket.comments.map((comment, index) => (
                  <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-sm">{comment.author}</span>
                      <span className="text-xs text-gray-500">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div className="border-t pt-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
                <button
                  onClick={() => {
                    console.log('Adding comment:', newComment);
                    setNewComment('');
                  }}
                  style={{
    marginTop: '0.5rem',       // mt-2
    backgroundColor: '#2563eb', // blue-600
    color: 'white',
    padding: '0.5rem 1rem',    // px-4 py-2
    borderRadius: '0.5rem',    // rounded-lg
    transition: 'background-color 0.2s ease-in-out',
    cursor: 'pointer',
  }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-end items-center mb-6">
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
            <button
              onClick={fetchTickets}
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">Date Issued</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">Issue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">Priority</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.map((ticket) => {
                  const statusDisplay = getStatusDisplay(ticket.status);
                  return (
                    <tr
                      key={ticket.ticketId || ticket.code}
                      onClick={() => fetchTicketById(ticket.ticketId)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.user}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.dateIssued}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{statusDisplay.text}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.issue}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.priority}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredTickets.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No tickets found
            </div>
          )}
          
          {loading && (
            <div className="text-center py-8 text-gray-500">
              Loading tickets...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tickets;