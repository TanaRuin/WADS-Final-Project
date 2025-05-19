import { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera } from 'lucide-react';

export default function SettingsPage() {
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

  // Load user profile on mount using async/await inside useEffect
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user/getProfile');
        setProfileData(prev => ({
          ...prev,
          ...res.data,
          changePassword: '',
          confirmPassword: '',
        }));
        if (res.data.profileImageUrl) {
          setProfileImage(res.data.profileImageUrl);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
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

    if ((profileData.changePassword || profileData.confirmPassword) &&
        profileData.changePassword !== profileData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const payload = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        description: profileData.description,
        jobTitle: profileData.jobTitle
      };
      if(profileData.changePassword) {
        payload.password = profileData.changePassword;
      }

      const res = await axios.put('http://localhost:5000/api/user/updateProfile', payload);
      alert('Profile updated successfully!');
      setProfileData(prev => ({ ...prev, ...res.data, changePassword: '', confirmPassword: '' }));
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Error updating profile.');
    }
  };

  // Upload profile image handler using async/await
  const handleImageUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('profileImage', file);

      try {
        const res = await axios.post('http://localhost:5000/api/user/profile-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setProfileImage(res.data.profileImageUrl);
        alert('Profile image updated!');
      } catch (error) {
        console.error('Failed to upload profile image:', error);
        alert('Error uploading image.');
      }
    }
  };
  return (
    <div className="p-6 w-full">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column - Profile image and description */}
        <div className="w-full md:w-1/3 space-y-4">
          {/* Profile Image Card */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="relative w-36 h-36 mb-4">
              <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z" stroke="#6B46C1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              <label htmlFor="profile-image-upload" className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 cursor-pointer shadow-md hover:bg-purple-700 transition-colors">
                <Camera size={20} color="white" />
                <input 
                  type="file" 
                  id="profile-image-upload" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <h2 className="text-xl font-semibold text-center"> </h2>
            <p className="text-gray-500 text-sm text-center"> {profileData.jobTitle}</p>
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-3"> Description </h3>
            <textarea
              name="description"
              value={profileData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-2 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter description"
            ></textarea>
          </div>
        </div>
        
        {/* Right column - Form fields */}
        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="border-b border-gray-200 mb-4 pb-1">
              <div className="flex">
                <h2 className="text-purple-600 border-b-2 border-purple-600 pb-2 font-medium">
                  Personal Details
                </h2>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name:</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    readOnly
                    className="w-full border border-gray-300 rounded p-2 bg-gray-100 text-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name:</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    readOnly
                    className="w-full border border-gray-300 rounded p-2 bg-gray-100 text-gray-700"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  readOnly
                  className="w-full border border-gray-300 rounded p-2 bg-gray-100 text-gray-700"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Change Password:</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password:</label>
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
  style={{ backgroundColor: '#9333ea' }}
  className="text-white px-8 py-2 rounded font-medium hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
>
  Submit
</button>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}