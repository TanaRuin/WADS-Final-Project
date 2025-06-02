import { useState, useEffect } from 'react';
import { Camera, User, Lock, FileText } from 'lucide-react';
import api from '../api/axiosInstance';

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

  // Load user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get('/user/getProfile');
        setProfileData(prev => ({
        ...prev,
        firstName: res.data.userdata.firstName || '',
        lastName: res.data.userdata.lastName || '',
        email: res.data.userdata.email || '',
        accessLevel: res.data.userdata.accessLevel || '',
        description: res.data.userdata.description || '',
        profileImage: res.data.userdata.profileImage || '',
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

  // Password change 
  if (profileData.changePassword || profileData.confirmPassword) {
    if (profileData.changePassword !== profileData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setUpdating(true);
      await api.put('/user/changePassword', {
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

    if (selectedFile) {
      const formData = new FormData();
      formData.append('profileImage', selectedFile);

      const imageRes = await api.post('/user/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProfileImage(imageRes.data.userdata.profileImage); 
      setSelectedFile(null); 
    }

    // Update other profile info
    const payload = {
      description: profileData.description,
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
    <div className="p-4 sm:p-6 lg:p-8">
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
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg font-medium text-gray-700 flex items-center mb-4">
              <User size={20} className="mr-2" />
              Profile Picture
            </h2>

            <div className="flex flex-col items-center">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-4">
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-purple-100 rounded-full flex items-center justify-center">
    
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21C20..." stroke="#6B46C1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
                <label htmlFor="profile-image-upload" className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 cursor-pointer shadow-md hover:bg-purple-700">
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
                <p className="text-gray-400 text-xs mt-1 break-all">{profileData.email}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-lg font-medium text-gray-700 flex items-center mb-4">
              <FileText size={20} className="mr-2" />
              Description
            </h3>
            <textarea
              name="description"
              value={profileData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-3 h-36 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Personal Info */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-lg font-medium text-gray-700 flex items-center mb-4">
              <User size={20} className="mr-2" />
              Personal Details
            </h3>

            <div className="space-y-4">
              {["firstName", "lastName", "email", "jobTitle"].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={profileData[field]}
                    readOnly
                    className="w-full border border-gray-300 rounded p-2 bg-gray-100 text-gray-700"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Password Update */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-lg font-medium text-gray-700 flex items-center mb-4">
              <Lock size={20} className="mr-2" />
              Change Password
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    name="changePassword"
                    value={profileData.changePassword}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={updating}
                  className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors focus:ring-2 focus:ring-purple-500 disabled:opacity-50 flex items-center"
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;