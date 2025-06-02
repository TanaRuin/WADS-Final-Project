import { useState, useEffect } from 'react';
import { User, FileText } from 'lucide-react';
import api from '../api/axiosInstance';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    jobTitle: '',
    description: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get('/user/getProfile');
        const data = res.data.userdata;

        setProfileData(prev => ({
          ...prev,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          username: data.username || data.email || '',
          email: data.email || '',
          jobTitle: data.jobTitle || '',
          description: data.description || ''
        }));

        setError(null);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
      const payload = {
        description: profileData.description
      };

      const res = await api.put('/user/updateProfile', payload);
      alert("Profile updated successfully!");
      setProfileData(prev => ({ ...prev, ...res.data }));
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Error updating profile.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Main Form */}
      {!loading && !error && (
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg font-medium text-gray-700 flex items-center mb-6">
                <User size={20} className="mr-2" />
                Personal Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <button
                    type="button"
                    className="w-full text-left border border-gray-300 bg-gray-100 text-gray-700 rounded-lg p-3 cursor-default"
                  >
                    {profileData.firstName || 'N/A'}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <button
                    type="button"
                    className="w-full text-left border border-gray-300 bg-gray-100 text-gray-700 rounded-lg p-3 cursor-default"
                  >
                    {profileData.lastName || 'N/A'}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <button
                    type="button"
                    className="w-full text-left border border-gray-300 bg-gray-100 text-gray-700 rounded-lg p-3 cursor-default"
                  >
                    {profileData.username || 'N/A'}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <button
                    type="button"
                    className="w-full text-left border border-gray-300 bg-gray-100 text-gray-700 rounded-lg p-3 cursor-default"
                  >
                    {profileData.email || 'N/A'}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  <button
                    type="button"
                    className="w-full text-left border border-gray-300 bg-gray-100 text-gray-700 rounded-lg p-3 cursor-default"
                  >
                    {profileData.jobTitle || 'N/A'}
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg font-medium text-gray-700 flex items-center mb-4">
                <FileText size={20} className="mr-2" />
                Description
              </h2>
              <textarea
                name="description"
                value={profileData.description}
                onChange={handleInputChange}
                rows="6"
                className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Submit */}
            <div className="flex justify-center sm:justify-end">
              <button
                type="submit"
                disabled={updating}
                style={{
                  backgroundColor: updating ? '#93c5fd' : '#3b82f6',
                  color: 'white'
                }}
                className="w-full sm:w-auto px-8 py-3 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium hover:bg-blue-600"
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Settings;
