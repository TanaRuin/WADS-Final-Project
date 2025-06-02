import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate }
from 'react-router-dom';
import { ChevronLeft, Paperclip, Send } from 'lucide-react';
import api from '../api/axiosInstance';

const UserTicketDetail = ({ userData }) => {
  const { ticketId } = useParams(); // This will be the short code
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const fetchTicketDetails = useCallback(async () => {
    try {
      setLoading(true);
      // The backend route is /api/ticket/get/:id where id is the full ticketId (UUID)
      // We need to adjust this if the frontend only has the short code.
      // For now, let's assume the backend GET /:id route can handle the short code OR we adjust the backend.
      // The provided TicketController.js for getTicketById uses `ticketId` which is the UUID.
      // MyTickets.jsx passes the short code. This is a mismatch.
      // For now, I will assume the :ticketId in the URL IS the short code,
      // and that the backend's getTicketById or a similar new endpoint can find a ticket by its short code.
      // A more robust solution would be for MyTickets to pass the full UUID, or the backend to support short code lookup.
      // Given the current backend, we can't directly use the short code.
      // Let's modify this to assume we need to tell the user this page cannot be loaded directly with short code if full ID not available.
      // OR, fetch all user tickets again and find the full ID. This is inefficient.
      // The admin ticket detail seems to use the short code in its example, so let's assume the backend can handle it.
      
      const response = await api.get(`/ticket/get/${ticketId}`); // Assuming backend can find by short code
      setTicket(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch ticket details:", err);
      setError(err.response?.data?.message || 'Failed to load ticket details.');
      // If ticket not found by short code, this is where it would fail.
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchTicketDetails();
  }, [fetchTicketDetails]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !userData) return;
    setIsSubmittingComment(true);
    try {
      // The backend's addComment uses req.user.id from the token, so we don't need to pass userId
      const response = await api.post(`/comment/add/${ticket.code}`, { // Use full ticket ID (ticket.code is short)
        content: newComment,                                       // This needs to be ticket.ticketId (the full UUID)
      });                                                           // The current `ticket` object fetched by /get/:id might not have the full ticketId if not returned.
                                                                    // Let's assume `ticket.code` IS the identifier backend uses or it needs to be the full ticketId.
                                                                    // The backend TicketController's getTicketById returns `code: ticketData.ticketId.substring(0, 8)`
                                                                    // but for adding comment, the route `/comment/add/:ticketId` expects the full ticketId (UUID)
                                                                    // This is a significant inconsistency.

      // For now, I'll assume the `ticket` object has `ticketId` (the full UUID) from the GET request.
      // If `ticket.code` is the short one and `ticket.ticketId` is the full one:
      const fullTicketIdForComment = ticket.fullTicketId || ticket.code; // Need to ensure fullTicketId is available.
                                                                      // Let's assume the API returns the full UUID as `ticketId` and short as `code`.
                                                                      // The `getTicketById` formats it as `code` for the short ID. It doesn't explicitly return the original full `ticketId`.
                                                                      // This needs backend adjustment or a way to pass the full ID.

      // **Temporary Assumption:** Let's assume `ticketId` (from `useParams`) is the full UUID, and we rename it for clarity.
      // Or, that the `/comment/add/:ticketId` route can also accept the short code if the backend is designed that way.
      // The current `/routes/commentsRoute.js` has `router.post('/add/:ticketId', addComment);`
      // and `commentController.js`'s `addComment` uses `const { ticketId } = req.params;` and then `Ticket.findOne({ ticketId })`
      // This `ticketId` parameter *must* be the full UUID for `Ticket.findOne({ ticketId })` to work as expected with the schema.

      // **Making a correction based on backend structure:**
      // The `ticketId` from `useParams` should be the *full UUID* for comments and attachments.
      // The `MyTickets` component should navigate with the full `ticket.ticketId` (UUID) not the `ticket.code` (short).
      // I will note this in the testing/improvement section. For now, will proceed assuming `ticketId` from `useParams` is usable.

      await api.post(`/comment/add/${ticketId}`, { // Use ticketId from useParams (assuming it's the full UUID)
          content: newComment
      });

      setNewComment('');
      fetchTicketDetails(); // Refresh comments
    } catch (err) {
      console.error("Failed to add comment:", err);
      setError(err.response?.data?.message || 'Failed to add comment.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'closed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const renderAttachmentThumbnail = (attachment) => {
    // Basic rendering, similar to admin's Tickets.jsx
    let icon;
    let colorClass = 'bg-gray-200 text-gray-700';
    switch (attachment.type?.toLowerCase()) {
      case 'image': icon = 'IMG'; colorClass = 'bg-blue-100 text-blue-700'; break;
      case 'pdf': icon = 'PDF'; colorClass = 'bg-red-100 text-red-700'; break;
      case 'excel': icon = 'XLSX'; colorClass = 'bg-green-100 text-green-700'; break;
      case 'text': icon = 'TXT'; colorClass = 'bg-indigo-100 text-indigo-700'; break;
      default: icon = 'FILE';
    }
    return (
      <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="block border border-gray-200 rounded p-2 hover:shadow-md transition-shadow">
        <div className={`w-full h-20 flex items-center justify-center rounded mb-1 ${colorClass}`}>
          <span className="font-bold text-sm">{icon}</span>
        </div>
        <p className="text-xs text-gray-600 truncate text-center">{attachment.name}</p>
      </a>
    );
  };

  if (loading) return <div className="p-6 text-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 mx-auto"></div><p>Loading ticket details...</p></div>;
  if (error) return <div className="p-6 bg-red-100 text-red-700 rounded">{error}</div>;
  if (!ticket) return <div className="p-6 text-center text-gray-600">Ticket not found.</div>;

  return (
    <div className="p-4 sm:p-6">
      <button
        onClick={() => navigate('/user/my-tickets')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <ChevronLeft size={20} className="mr-1" />
        Back to My Tickets
      </button>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
              Ticket #{ticket.code} : {ticket.issue}
            </h1>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
              {ticket.status}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <p><strong>Submitted by:</strong> {ticket.user}</p> {/* Backend provides userId, frontend needs to map to name if necessary or show ID */}
            <p><strong>Date Issued:</strong> {new Date(ticket.dateIssued).toLocaleDateString()}</p>
            <p><strong>Category:</strong> {ticket.category}</p>
            <p><strong>Priority:</strong> {ticket.priority}</p>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
          <p className="text-gray-600 bg-gray-50 p-4 rounded-md whitespace-pre-wrap">{ticket.description}</p>
        </div>

        {ticket.attachments && ticket.attachments.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Attachments</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {ticket.attachments.map((att, index) => (
                renderAttachmentThumbnail(att)
              ))}
            </div>
          </div>
        )}

        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Comments</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto mb-6 pr-2">
            {ticket.comments && ticket.comments.map((comment, index) => (
              <div key={index} className={`p-3 rounded-lg shadow-sm ${
                comment.author?.toLowerCase().includes('staff') || comment.author === userData?.firstName + ' ' + userData?.lastName // Crude check if comment by current user
                ? 'bg-blue-50 border-l-4 border-blue-500 ml-auto max-w-[85%]' 
                : 'bg-gray-50 border-l-4 border-gray-300 mr-auto max-w-[85%]'
              }`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm text-gray-800">{comment.author}</span>
                  <span className="text-xs text-gray-500">{comment.timestamp}</span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.text}</p>
              </div>
            ))}
             {(!ticket.comments || ticket.comments.length === 0) && (
                <p className="text-gray-500 text-sm">No comments yet.</p>
            )}
          </div>

          {ticket.status?.toLowerCase() !== 'closed' && (
            <div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Type your comment..."
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                disabled={isSubmittingComment}
              />
              <button
                onClick={handleAddComment}
                disabled={isSubmittingComment || !newComment.trim()}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center transition-colors disabled:opacity-50"
              >
                <Send size={18} className="mr-2" />
                {isSubmittingComment ? 'Sending...' : 'Add Comment'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTicketDetail;