import { useState, useEffect } from 'react';
import { User, FileText, Camera } from 'lucide-react';
import api from '../api/axiosInstance';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cropData, setCropData] = useState({
    x: 0,
    y: 0,
    width: 200,
    height: 200
  });

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    jobTitle: '',
    description: '',
    profileImage: ''
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
          username: data.username ||  '',
          email: data.email || '',
          jobTitle: data.jobTitle || '',
          description: data.description || '',
          profileImage: data.profileImage || ''
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

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Convert file to URL for cropper
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const cropImage = (imageSrc, cropData, imageSize) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const image = new Image();
      
      image.onload = () => {
        // Calculate the scale factor between original and display image
        const scaleX = image.naturalWidth / imageSize.width;
        const scaleY = image.naturalHeight / imageSize.height;
        
        // Convert display coordinates to original image coordinates
        const originalCropData = {
          x: cropData.x * scaleX,
          y: cropData.y * scaleY,
          width: cropData.width * scaleX,
          height: cropData.height * scaleY
        };
        
        // Set canvas size to desired output size
        canvas.width = cropData.width;
        canvas.height = cropData.height;
        
        // Draw the cropped portion
        ctx.drawImage(
          image,
          originalCropData.x,      // source x
          originalCropData.y,      // source y  
          originalCropData.width,  // source width
          originalCropData.height, // source height
          0,                       // destination x
          0,                       // destination y
          cropData.width,          // destination width
          cropData.height          // destination height
        );
        
        canvas.toBlob(resolve, 'image/jpeg', 0.9);
      };
      
      image.src = imageSrc;
    });
  };

  const handleCropConfirm = async () => {
    try {
      setUploadingImage(true);
      
      // Create cropped image blob - now passing imageSize
      const croppedBlob = await cropImage(imageToCrop, cropData, imageSize);
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Image = reader.result;
          
          const res = await api.post('/user/uploadpfp', {
            image: base64Image
          });

          if (res.data.success) {
            setProfileData(prev => ({
              ...prev,
              profileImage: res.data.user.profileImage
            }));
            alert('Profile picture updated successfully!');
            setShowCropper(false);
            setImageToCrop(null);
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Error uploading image. Please try again.');
        } finally {
          setUploadingImage(false);
        }
      };
      
      reader.readAsDataURL(croppedBlob);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
      setUploadingImage(false);
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setImageToCrop(null);
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
      {/* Image Cropper Modal */}
      {showCropper && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-screen overflow-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Crop Your Profile Picture</h3>
            
            <div className="relative mb-4">
              <ImageCropper
                imageSrc={imageToCrop}
                cropData={cropData}
                setCropData={setCropData}
                onImageSizeChange={setImageSize}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCropCancel}
                disabled={uploadingImage}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCropConfirm}
                disabled={uploadingImage}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center"
              >
                {uploadingImage ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  'Crop & Upload'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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

              {/* Profile Picture Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-200 overflow-hidden border-4 border-gray-300">
                    {profileData.profileImage ? (
                      <img 
                        src={profileData.profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={40} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <label 
                    htmlFor="profileImageUpload" 
                    className="absolute -bottom-2 -right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 cursor-pointer transition-colors shadow-lg"
                  >
                    {uploadingImage ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                    ) : (
                      <Camera size={16} />
                    )}
                  </label>
                  <input
                    id="profileImageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Click the camera icon to upload a new profile picture
                </p>
              </div>

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

// Image Cropper Component
const ImageCropper = ({ imageSrc, cropData, setCropData, onImageSizeChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const containerWidth = 400;
      const containerHeight = 300;
      const aspectRatio = img.width / img.height;
      
      let displayWidth, displayHeight;
      if (aspectRatio > containerWidth / containerHeight) {
        displayWidth = containerWidth;
        displayHeight = containerWidth / aspectRatio;
      } else {
        displayHeight = containerHeight;
        displayWidth = containerHeight * aspectRatio;
      }
      
      const newImageSize = { width: displayWidth, height: displayHeight };
      setImageSize(newImageSize);
      
      // Pass imageSize to parent component
      if (onImageSizeChange) {
        onImageSizeChange(newImageSize);
      }
      
      // Center the crop area
      setCropData({
        x: Math.max(0, (displayWidth - 200) / 2),
        y: Math.max(0, (displayHeight - 200) / 2),
        width: Math.min(200, displayWidth),
        height: Math.min(200, displayHeight)
      });
    };
    img.src = imageSrc;
  }, [imageSrc, setCropData, onImageSizeChange]);

  const handleMouseDown = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    
    const containerRect = e.currentTarget.closest('[data-cropper-container]').getBoundingClientRect();
    const currentX = e.clientX - containerRect.left;
    const currentY = e.clientY - containerRect.top;
    
    if (type === 'move') {
      setDragStart({
        x: currentX - cropData.x,
        y: currentY - cropData.y
      });
      setIsDragging(true);
    } else if (type === 'resize') {
      setDragStart({ x: currentX, y: currentY });
      setIsResizing(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging && !isResizing) return;
    
    e.preventDefault();
    const containerRect = e.currentTarget.getBoundingClientRect();
    const currentX = e.clientX - containerRect.left;
    const currentY = e.clientY - containerRect.top;
    
    if (isDragging) {
      const newX = Math.max(0, Math.min(imageSize.width - cropData.width, currentX - dragStart.x));
      const newY = Math.max(0, Math.min(imageSize.height - cropData.height, currentY - dragStart.y));
      
      setCropData(prev => ({
        ...prev,
        x: newX,
        y: newY
      }));
    } else if (isResizing) {
      const newWidth = Math.max(50, Math.min(imageSize.width - cropData.x, currentX - cropData.x));
      const newHeight = Math.max(50, Math.min(imageSize.height - cropData.y, currentY - cropData.y));
      
      setCropData(prev => ({
        ...prev,
        width: newWidth,
        height: newHeight
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  return (
    <div className="relative inline-block">
      <div 
        className="relative border border-gray-300 cursor-crosshair"
        style={{ width: imageSize.width, height: imageSize.height }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        data-cropper-container
      >
        <img 
          src={imageSrc} 
          alt="Crop preview"
          className="w-full h-full object-contain"
          draggable={false}
        />
        
        {/* Overlay with cutout for crop area */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top overlay */}
          <div 
            className="absolute top-0 left-0 right-0 bg-black bg-opacity-50"
            style={{ height: cropData.y }}
          ></div>
          
          {/* Bottom overlay */}
          <div 
            className="absolute left-0 right-0 bg-black bg-opacity-50"
            style={{ 
              top: cropData.y + cropData.height,
              bottom: 0
            }}
          ></div>
          
          {/* Left overlay */}
          <div 
            className="absolute left-0 bg-black bg-opacity-50"
            style={{ 
              top: cropData.y,
              width: cropData.x,
              height: cropData.height
            }}
          ></div>
          
          {/* Right overlay */}
          <div 
            className="absolute right-0 bg-black bg-opacity-50"
            style={{ 
              top: cropData.y,
              width: imageSize.width - (cropData.x + cropData.width),
              height: cropData.height,
              left: cropData.x + cropData.width
            }}
          ></div>
        </div>
        
        {/* Crop area border */}
        <div
          className="absolute border-2 border-white cursor-move pointer-events-auto"
          style={{
            left: cropData.x,
            top: cropData.y,
            width: cropData.width,
            height: cropData.height
          }}
          onMouseDown={(e) => handleMouseDown(e, 'move')}
        >
          {/* Resize handle */}
          <div
            className="absolute bottom-0 right-0 w-4 h-4 bg-white border border-gray-400 cursor-se-resize"
            style={{ transform: 'translate(2px, 2px)' }}
            onMouseDown={(e) => handleMouseDown(e, 'resize')}
          ></div>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mt-2">
        Drag to move the crop area, drag the corner to resize
      </p>
    </div>
  );
};
