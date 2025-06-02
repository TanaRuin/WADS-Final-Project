import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import belantaraImage from '../assets/imagesbelantara.png';



function AuthPage({ view = 'login' }) {
  const [currentView, setCurrentView] = useState(view);
  const navigate = useNavigate();

  // For showing error messages
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  useEffect(() => {
    setCurrentView(view);
    setError('');
    
    // Initialize Google OAuth
    const initializeGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: true
        });
        setGoogleLoaded(true);
      } else {
        // Retry after a short delay if Google script hasn't loaded yet
        setTimeout(initializeGoogle, 100);
      }
    };

    initializeGoogle();
  }, [view]);

  const changeView = (newView) => {
    setCurrentView(newView);
    navigate(`/${newView}`);
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();

    if (!username || !password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/user/login', {
        username,
        password,
      });

      const { accessToken, userdata } = response.data;

      // Store token and accesslevel
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('accessLevel', userdata.accessLevel); 

      // Redirect based on access level
      if (userdata.accessLevel === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const firstName = e.target.firstName.value.trim();
    const lastName = e.target.lastName.value.trim();
    const username = e.target.username.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const confirmPassword = e.target.confirmPassword.value.trim();

    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/user/register', {
        firstName,
        lastName,
        username,
        email,
        password,
      });

      // Redirect to dashboard after successful registration
      alert("Register Successful")
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  const identifier = e.target.identifier.value.trim();

  if (!identifier) {
    setError('Please enter your email or username');
    setLoading(false);
    return;
  }

  try {
    await axios.post('http://localhost:5000/api/user/forgot-password', { identifier });
    setError('');
    alert('Password reset link has been sent to your email');
    changeView('login');
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
  } finally {
    setLoading(false);
  }
};


  const handleGoogleResponse = async (response) => {
    setLoading(true);
    try {
      const backendresponse = await axios.post('http://localhost:5000/api/user/google-login', {
        idToken: response.credential
      });

      const { accessToken} = backendresponse.data;

      localStorage.setItem('accessToken', accessToken);
      
 
      navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (googleLoaded && window.google) {
      setError('');
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('One-tap sign-in not available, using button flow');
        }
      });
    } else {
      setError('Google Sign-In is not available. Please try again.');
    }
  };

  const renderLoginForm = () => (
    <form onSubmit={handleLoginSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{error}</div>}

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          Username<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter your username"
          required
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password<span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          required
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" disabled={loading} />
          <span className="text-sm text-gray-700">Keep Me Logged in</span>
        </label>
        <button
          type="button"
          onClick={() => changeView('forgot')}
          className="text-sm text-blue-600 hover:underline disabled:text-gray-400"
          disabled={loading}
        >
          Forgot Your Password?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
        style={{ backgroundColor: loading ? '#9ca3af' : '#2563eb' }}
        onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#1d4ed8')}
        onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#2563eb')}
      >
        {loading ? 'Signing in...' : 'Submit'}
      </button>

      <button
        type="button"
        disabled={loading || !googleLoaded}
        className="w-full text-gray-700 py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center disabled:bg-gray-100 disabled:cursor-not-allowed"
        style={{ backgroundColor: loading || !googleLoaded ? '#f3f4f6' : '#ffffff' }}
        onMouseEnter={(e) => (!loading && googleLoaded) && (e.target.style.backgroundColor = '#f9fafb')}
        onMouseLeave={(e) => (!loading && googleLoaded) && (e.target.style.backgroundColor = '#ffffff')}
        onClick={handleGoogleLogin}
      >
        <FontAwesomeIcon icon={faGoogle} className="mr-2" style={{ color: '#ea4335' }} />
        {!googleLoaded ? 'Loading Google...' : loading ? 'Signing in...' : 'Sign in with Google'}
      </button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              changeView('register');
            }}
            className="text-green-600 underline hover:no-underline ml-1"
          >
            Create Account
          </a>
        </p>
      </div>
    </form>
  );

  const renderRegisterForm = () => (
    <form onSubmit={handleRegisterSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Enter your first name"
            required
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Enter your last name"
            required
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>
      </div>

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          Username<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter your username"
          required
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email<span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          required
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password<span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password (min 6 characters)"
          required
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password<span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm your password"
          required
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
        style={{ backgroundColor: loading ? '#9ca3af' : '#2563eb' }}
        onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#1d4ed8')}
        onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#2563eb')}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              changeView('login');
            }}
            className="text-blue-600 underline hover:no-underline ml-1"
          >
            Sign In
          </a>
        </p>
      </div>
    </form>
  );

  const renderForgotPasswordForm = () => (
    <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
  {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{error}</div>}

  <div>
    <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
      Email or Username<span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      id="identifier"
      name="identifier"
      placeholder="Enter your email address or username"
      required
      disabled={loading}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
    />
  </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
        style={{ backgroundColor: loading ? '#9ca3af' : '#2563eb' }}
        onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#1d4ed8')}
        onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#2563eb')}
      >
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Remember your password?
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              changeView('login');
            }}
            className="text-blue-600 underline hover:no-underline ml-1"
          >
            Back to Login
          </a>
        </p>
      </div>
    </form>
  );

  const getTitle = () => {
    switch (currentView) {
      case 'register':
        return { title: 'Create Account', subtitle: 'Create your new account' };
      case 'forgot':
        return { title: 'Reset Password', subtitle: 'Enter your email to reset your password' };
      default:
        return { title: 'Welcome Back', subtitle: 'Please sign in to your account' };
    }
  };

  const { title, subtitle } = getTitle();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-sm lg:max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
            <p className="text-gray-600">{subtitle}</p>
          </div>

          {currentView === 'login' && renderLoginForm()}
          {currentView === 'register' && renderRegisterForm()}
          {currentView === 'forgot' && renderForgotPasswordForm()}
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

export default AuthPage;