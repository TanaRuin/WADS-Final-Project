// src/pages/GoogleCallback.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Google OAuth2 flow returns 'code' in URL params, not hash
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          setError('Google login was cancelled or failed');
          setLoading(false);
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        if (!code) {
          setError('No authorization code received from Google');
          setLoading(false);
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        // Send the authorization code to your backend
        const response = await axios.post('https://e2425-wads-l4ccg5-server.csbihub.id/api/user/google-login', {
          code: code, // Send the authorization code, not access token
        });

        // Store the tokens from your backend response
        const { accessToken } = response.data;
        
        localStorage.setItem('accessToken', accessToken);

        // Redirect directly to dashboard
        navigate('/dashboard');

      } catch (err) {
        console.error('Google login error:', err);
        setError(err.response?.data?.message || 'Google login failed. Please try again.');
        setLoading(false);
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleGoogleCallback();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Signing you in with Google...</h2>
          <p className="text-gray-600">Please wait while we verify your account.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md p-6">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Google Login Failed</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleCallback;