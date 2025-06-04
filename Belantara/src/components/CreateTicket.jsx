
import React, { useState } from 'react';
import { Save, AlertTriangle, Tag, FileText, Flag } from 'lucide-react';
import api from '../api/axiosInstance';

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    category: '',
    priority: 'medium',
    Issue: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  
const categories = [
    'Environmental Conservation',
    'Community Programs',
    'Volunteer Support',
    'Partnerships & Donations',
    'Technical Support',
    'General Inquiry'
];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600 bg-green-100' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'high', label: 'High', color: 'text-red-600 bg-red-100' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.Issue.trim()) {
      setError('Issue title is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    if (!formData.category) {
      setError('Category is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/ticket/add', {
        category: formData.category,
        priority: formData.priority,
        Issue: formData.Issue.trim(),
        description: formData.description.trim()
      });

      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          category: '',
          priority: 'medium',
          Issue: '',
          description: ''
        });
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      setError(error.response?.data?.message || 'Failed to create ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      priority: 'medium',
      Issue: '',
      description: ''
    });
    setError('');
    setSuccess(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Ticket</h1>
        <p className="text-gray-600">Submit a support request and we'll get back to you as soon as possible.</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                Ticket created successfully! We'll review your request and get back to you soon.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Issue Title */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 mr-2" />
              Issue Title *
            </label>
            <input
              type="text"
              name="Issue"
              value={formData.Issue}
              onChange={handleInputChange}
              placeholder="Brief description of your issue"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
              maxLength={100}
            />
            <p className="mt-1 text-xs text-gray-500">{formData.Issue.length}/100 characters</p>
          </div>

          {/* Category and Priority Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 mr-2" />
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Flag className="w-4 h-4 mr-2" />
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
              <div className="mt-2">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  priorities.find(p => p.value === formData.priority)?.color || 'text-gray-600 bg-gray-100'
                }`}>
                  {priorities.find(p => p.value === formData.priority)?.label || 'Medium'}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 mr-2" />
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Please provide detailed information about your issue, including steps to reproduce if applicable..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={loading}
              maxLength={1000}
            />
            <p className="mt-1 text-xs text-gray-500">{formData.description.length}/1000 characters</p>
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Tips for better support:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Be specific about the issue you're experiencing</li>
              <li>• Include steps to reproduce the problem if applicable</li>
              <li>• Mention any error messages you received</li>
              <li>• Specify when the issue started occurring</li>
            </ul>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={loading || !formData.Issue.trim() || !formData.description.trim() || !formData.category}
              className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                  Creating Ticket...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Ticket
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Additional Information */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">What happens next?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-semibold">1</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">Ticket Submitted</h4>
            <p className="text-sm text-gray-600">Your request is logged in our system</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-yellow-600 font-semibold">2</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">Under Review</h4>
            <p className="text-sm text-gray-600">Our team reviews and assigns your ticket</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-semibold">3</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">Resolution</h4>
            <p className="text-sm text-gray-600">We'll contact you with updates or solutions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;