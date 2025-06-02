import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, PlusCircle } from 'lucide-react';
import api from '../api/axiosInstance';

const CreateTicketForm = ({ userData }) => {
  const [formData, setFormData] = useState({
    Issue: '',
    description: '',
    category: '',
    priority: 'Medium', // Default priority
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const categories = ['Technical Issue', 'Billing Inquiry', 'Account Access', 'Software Bug', 'Hardware Problem', 'General Question', 'Feedback'];
  const priorities = ['Low', 'Medium', 'High'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.Issue || !formData.description || !formData.category || !formData.priority) {
      setError('Please fill in all fields.');
      return;
    }
    setError(null);
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const payload = { ...formData, userId: userData.userId }; // Assuming backend uses userId from token
      const response = await api.post('/ticket/create', payload);

      setSuccessMessage(`Ticket "${response.data.ticket.Issue}" created successfully! Ticket ID: ${response.data.ticket.ticketId.substring(0,8)}`);
      setFormData({ Issue: '', description: '', category: '', priority: 'Medium' });
      setTimeout(() => {
        navigate('/user/my-tickets');
      }, 3000); // Redirect after 3 seconds
    } catch (err) {
      console.error("Failed to create ticket:", err);
      setError(err.response?.data?.message || 'Failed to create ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <PlusCircle size={28} className="text-blue-600 mr-3" />
        <h1 className="text-2xl font-bold text-gray-800">Create New Ticket</h1>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
          <p className="font-bold">Success</p>
          <p>{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <div>
          <label htmlFor="Issue" className="block text-sm font-medium text-gray-700 mb-1">
            Subject / Issue <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="Issue"
            id="Issue"
            value={formData.Issue}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              name="priority"
              id="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              {priorities.map(prio => (
                <option key={prio} value={prio}>{prio}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Add attachment upload here if needed in the future */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send size={18} className="mr-2" />
                Submit Ticket
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicketForm;