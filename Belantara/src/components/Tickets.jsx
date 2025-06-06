import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowLeft, Paperclip, User } from 'lucide-react';
import api from '../api/axiosInstance';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  
  // Ref to store the polling interval
  const pollingIntervalRef = useRef(null);

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

  // Fetch ticket silently (without loading state) for polling
  const fetchTicketSilently = async (ticketId) => {
    try {
      const { data } = await api.get(`/ticket/get/${ticketId}`);
      setSelectedTicket(data);
    } catch (error) {
      console.error('Error fetching ticket silently:', error);
    }
  };

  // Start polling for ticket updates
  const startPolling = (ticketId) => {
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    // Poll every 5 seconds (adjust as needed)
    pollingIntervalRef.current = setInterval(() => {
      fetchTicketSilently(ticketId);
    }, 5000);
  };

  // Stop polling
  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  // Add a new comment
  const addComment = async (ticketId, content) => {
    setAddingComment(true);
    try {
      console.log('Sending comment:', content);
      const { data } = await api.post(
        `/comment/add/${ticketId}`,
        { content });

      // Refresh the ticket to get updated comments and potentially updated status
      await fetchTicketById(ticketId);
      console.log('Refetched ticket');
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    } finally {
      setAddingComment(false);
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

  // Handle adding comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      await addComment(selectedTicket.ticketId, newComment.trim());
      setNewComment('');
    } catch (error) {
      alert('Failed to add comment. Please try again.');
    }
  };

  // Handle back to tickets list
  const handleBackToTickets = () => {
    setSelectedTicket(null);
    stopPolling(); // Stop polling when leaving ticket view
    // Remove ticket ID from URL
    window.history.pushState({}, '', window.location.pathname);
  };

  // Handle ticket selection
  const handleTicketSelect = (ticketId) => {
    fetchTicketById(ticketId);
    startPolling(ticketId); // Start polling when viewing a ticket
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
    (statusFilter === '' || ticket.status === statusFilter) &&
    (priorityFilter === '' || ticket.priority === priorityFilter) &&
    (
      (ticket.Issue || ticket.issue)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return timestamp;
    }
  };

  // Auto-fetch tickets on every render
  useEffect(() => {
    fetchTickets();
    
    // Check if there's a ticket ID in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const ticketId = urlParams.get('ticket');
    if (ticketId) {
      fetchTicketById(ticketId);
      startPolling(ticketId); // Start polling for URL-loaded ticket
    }

    // Cleanup polling on component unmount
    return () => {
      stopPolling();
    };
  }, []);

  // Cleanup polling when selectedTicket changes
  useEffect(() => {
    if (selectedTicket) {
      startPolling(selectedTicket.ticketId);
    } else {
      stopPolling();
    }
    
    return () => {
      stopPolling();
    };
  }, [selectedTicket?.ticketId]);

  if (selectedTicket) {
    const statusDisplay = getStatusDisplay(selectedTicket.status);
    
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackToTickets}
              className="flex items-center mr-4 transition-colors"
              style={{ color: '#2563eb' }}
              onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
              onMouseLeave={(e) => e.target.style.color = '#2563eb'}
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back to Tickets
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ticket Details */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedTicket.Issue || selectedTicket.issue}
                </h1>
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
                <div>
                  <span className="text-grey-500">Issue</span>
                  <p className="font-semibold">{selectedTicket.Issue}</p>
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
                  className="px-4 py-2 rounded-lg transition-colors text-white"
                  style={{ backgroundColor: '#dc2626' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
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
                {selectedTicket.comments && selectedTicket.comments.length > 0 ? (
                  selectedTicket.comments.map((comment, index) => (
                    <div key={comment.id || index} className="border-b border-gray-100 pb-3 last:border-b-0">
                      <div className="flex items-start space-x-3 mb-2">
                        {/* Profile Picture */}
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          {comment.profilePicture ? (
                            <img 
                              src={comment.profilePicture} 
                              alt={comment.author}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-sm text-gray-900">{comment.author}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              {formatTimestamp(comment.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{comment.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No comments yet</p>
                )}
              </div>

              {/* Add Comment */}
              <div className="border-t pt-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  disabled={addingComment}
                />
                <button
                  onClick={handleAddComment}
                  disabled={addingComment || !newComment.trim()}
                  className="mt-2 px-4 py-2 rounded-lg transition-colors text-white"
                  style={{ 
                    backgroundColor: addingComment || !newComment.trim() ? '#9ca3af' : '#2563eb',
                    cursor: addingComment || !newComment.trim() ? 'not-allowed' : 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (!addingComment && newComment.trim()) {
                      e.target.style.backgroundColor = '#1d4ed8';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!addingComment && newComment.trim()) {
                      e.target.style.backgroundColor = '#2563eb';
                    }
                  }}
                >
                  {addingComment ? 'Sending...' : 'Send'}
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
        <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Status Filter */}
          <div className="w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          
          {/* Priority Filter */}
          <div className="w-full sm:w-auto">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          {/* Search */}
          <div className="relative w-full sm:w-auto">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
                      onClick={() => handleTicketSelect(ticket.ticketId)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.user}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.dateIssued}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{statusDisplay.text}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ticket.Issue || ticket.issue}
                      </td>
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
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tickets;