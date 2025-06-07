import { useState, useEffect } from 'react';
import { auth, actionCodeSettings } from '../config/firebase';
import { sendEmailVerification, updateProfile } from 'firebase/auth';
import { Shield, Mail } from 'lucide-react';
import EmailVerification from './EmailVerification';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
      // Show tutorial automatically if email is not verified
      if (currentUser && !currentUser.emailVerified) {
        setShowTutorial(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const sendVerificationEmail = async () => {
    try {
      // Store the email for verification
      window.localStorage.setItem('emailForSignIn', auth.currentUser.email);
      
      // Send verification email with action code settings
      await sendEmailVerification(auth.currentUser, actionCodeSettings);
      setVerificationSent(true);
      setShowTutorial(true);
      alert('Verification email sent! Please check your inbox and click the verification link.');
    } catch (error) {
      console.error('Error sending verification email:', error);
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Please log in to access settings.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-6">Settings</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-full mr-4 bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Shield size={40} className="text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-medium">{user.displayName || 'No name set'}</p>
              </div>
            </div>
            
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>

            <div>
              <p className="text-gray-600">Account Type</p>
              <p className="font-medium">Email Account</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Security Settings</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-blue-500 mr-2" />
                  <h4 className="font-medium">Email Verification</h4>
                </div>
                {!user.emailVerified && (
                  <button
                    onClick={() => setShowTutorial(!showTutorial)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showTutorial ? 'Hide Tutorial' : 'Show Tutorial'}
                  </button>
                )}
              </div>
              
              {user.emailVerified ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-700 font-medium">✓ Your email is verified</p>
                  <p className="text-green-600 text-sm mt-1">Your account has an additional layer of security</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-700">Your email is not verified</p>
                    <p className="text-yellow-600 text-sm mt-1">Verify your email to add an extra layer of security to your account</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={sendVerificationEmail}
                      disabled={verificationSent}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <Mail size={16} className="mr-2" />
                      {verificationSent ? 'Verification Email Sent' : 'Send Verification Email'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-gray-500 text-sm">Receive email updates about your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Show verification component if email is not verified and showTutorial is true */}
      {!user.emailVerified && showTutorial && (
        <EmailVerification 
          email={user.email} 
          verificationSent={verificationSent} 
        />
      )}
    </div>
  );
};

export default Settings;
