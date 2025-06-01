import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import belantaraImage from '../assets/imagesbelantara.png';

function ResetPasswordPage() {
  const { token } = useParams(); 
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isValidToken, setIsValidToken] = useState(null);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  // Verify token when component mounts
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/verify-reset-token/${token}`);
        const data = await response.json();
        
        if (data.success) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
          setMessage({
            type: 'error',
            text: 'Invalid or expired reset token. Please request a new password reset.'
          });
        }
      } catch (error) {
        console.error('Token verification error:', error);
        setIsValidToken(false);
        setMessage({
          type: 'error',
          text: 'Unable to verify reset token. Please try again.'
        });
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Passwords do not match'
      });
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setMessage({
        type: 'error',
        text: 'Password must be at least 6 characters long'
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: 'success',
          text: 'Password reset successfully! Redirecting to login...'
        });
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Failed to reset password'
        });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setMessage({
        type: 'error',
        text: 'Network error. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while verifying token
  if (isValidToken === null) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying reset token...</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-gray-50">
          <img
            src={belantaraImage}
            alt="Belantara Foundation Logo"
            className="max-w-full h-auto max-h-32 sm:max-h-48 lg:max-h-none"
          />
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (isValidToken === false) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-sm lg:max-w-md text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Invalid Reset Link</h1>
            <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-4">
              <p className="text-red-700">{message.text}</p>
            </div>
            <button
              onClick={() => navigate('/forgot')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Request New Reset Link
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-gray-50">
          <img
            src={belantaraImage}
            alt="Belantara Foundation Logo"
            className="max-w-full h-auto max-h-32 sm:max-h-48 lg:max-h-none"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-sm lg:max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Your Password</h1>
            <p className="text-gray-600">Enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display success/error messages */}
            {message.text && (
              <div className={`p-3 rounded-md text-sm ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password<span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your new password"
                required
                minLength="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password<span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your new password"
                required
                minLength="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: isLoading ? '#9ca3af' : '#2563eb' }}
              onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#1d4ed8')}
              onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#2563eb')}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Remember your password? 
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/login');
                  }}
                  className="text-blue-600 underline hover:no-underline ml-1"
                >
                  Sign In
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-gray-50">
        <img
          src={belantaraImage}
          alt="Belantara Foundation Logo"
          className="max-w-full h-auto max-h-32 sm:max-h-48 lg:max-h-none"
        />
      </div>
    </div>
  );
}

export default ResetPasswordPage;