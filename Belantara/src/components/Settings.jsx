import { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, User, Lock, FileText } from 'lucide-react';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    changePassword: '',
    confirmPassword: '',
    description: '',
    jobTitle: ''
  });

  const [profileImage, setProfileImage] = useState(null);

  // Load user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/user/getProfile');
        setProfileData(prev => ({
          ...prev,
          ...res.data.userdata,
          changePassword: '',
          confirmPassword: '',
        }));

        if (res.data.userdata.profileImage) {
          setProfileImage(res.data.userdata.profileImage);
        }
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

  const handleFileChange = (e) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    setSelectedFile(file);
    setProfileImage(URL.createObjectURL(file));
  }
};



  const handleSubmit = async (e) => {
  e.preventDefault();

  // Password change logic
  if (profileData.changePassword || profileData.confirmPassword) {
    if (profileData.changePassword !== profileData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setUpdating(true);
      await axios.put('http://localhost:5000/api/user/changePassword', {
        newPassword: profileData.changePassword,
        confirmPassword: profileData.confirmPassword
      });
      alert("Password changed successfully!");
      setProfileData(prev => ({ ...prev, changePassword: "", confirmPassword: "" }));
    } catch (error) {
      console.error("Failed to change password:", error);
      alert("Error changing password.");
    } finally {
      setUpdating(false);
    }
    return;  
  }

  try {
    setUpdating(true);

    // Upload image if there's a selected file
    if (selectedFile) {
      const formData = new FormData();
      formData.append('profileImage', selectedFile);

      const imageRes = await axios.post('http://localhost:5000/api/user/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProfileImage(imageRes.data.userdata.profileImage); // Update profile image in state
      setSelectedFile(null); // Clear selected file after upload
    }

    // Update other profile info
    const payload = {
      description: profileData.description,
    };

    const res = await axios.put('http://localhost:5000/api/user/updateProfile', payload);
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
    <div className="p-4">
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Settings Content */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Profile Image Card */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-700 flex items-center">
                <User size={20} className="mr-2" />
                Profile Picture
              </h2>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z" stroke="#6B46C1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
                <label htmlFor="profile-image-upload" className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 cursor-pointer shadow-md hover:bg-purple-700 transition-colors">
                  <Camera size={16} color="white" />
                  <input 
                    type="file" 
                    id="profile-image-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-medium">{`${profileData.firstName} ${profileData.lastName}`}</h3>
                <p className="text-gray-500 text-sm">{profileData.jobTitle}</p>
                <p className="text-gray-400 text-xs mt-1">{profileData.email}</p>
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-700 flex items-center">
                <FileText size={20} className="mr-2" />
                Description
              </h3>
            </div>
            
            <textarea
              name="description"
              value={profileData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-3 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Personal Details Card */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-700 flex items-center">
                <User size={20} className="mr-2" />
                Personal Details
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  readOnly
                  className="w-full border border-gray-300 rounded p-2 bg-gray-100 text-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  readOnly
                  className="w-full border border-gray-300 rounded p-2 bg-gray-100 text-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  readOnly
                  className="w-full border border-gray-300 rounded p-2 bg-gray-100 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={profileData.jobTitle}
                  readOnly
                  className="w-full border border-gray-300 rounded p-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                  placeholder="Job title"
                />
              </div>

            </div>
          </div>

          {/* Password Change Card - Full Width */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-700 flex items-center">
                <Lock size={20} className="mr-2" />
                Change Password
              </h3>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    name="changePassword"
                    value={profileData.changePassword}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter new password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={profileData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={updating}
                  className="bg-purple-600 text-white px-8 py-2 rounded font-medium hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;