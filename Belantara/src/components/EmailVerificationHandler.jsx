import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const EmailVerificationHandler = () => {
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        
        if (!email) {
          // If email is not in local storage, prompt user
          email = window.prompt('Please provide your email for confirmation');
        }

        try {
          // Attempt to sign in with email link
          await signInWithEmailLink(auth, email, window.location.href);
          
          // Clear email from storage
          window.localStorage.removeItem('emailForSignIn');
          
          // Update status
          setVerificationStatus('success');
          
          // Redirect after 3 seconds
          setTimeout(() => {
            navigate('/settings');
          }, 3000);
        } catch (error) {
          console.error('Error during email verification:', error);
          setVerificationStatus('error');
          setErrorMessage(error.message);
        }
      } else {
        setVerificationStatus('error');
        setErrorMessage('Invalid verification link');
      }
    };

    verifyEmail();
  }, [auth, navigate]);

  const renderContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <div className="flex items-center space-x-3 text-blue-600">
            <Loader className="w-6 h-6 animate-spin" />
            <p>Verifying your email...</p>
          </div>
        );
      
      case 'success':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-green-600">
              <CheckCircle className="w-6 h-6" />
              <p>Email verified successfully!</p>
            </div>
            <p className="text-sm text-gray-600">
              Redirecting you to settings in a few seconds...
            </p>
          </div>
        );
      
      case 'error':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <XCircle className="w-6 h-6" />
              <p>Verification failed</p>
            </div>
            <p className="text-sm text-red-600">{errorMessage}</p>
            <button
              onClick={() => navigate('/settings')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Return to Settings
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6">Email Verification</h2>
        {renderContent()}
      </div>
    </div>
  );
};

export default EmailVerificationHandler; 