import React from 'react';
import { Mail, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const EmailVerificationTutorial = ({ email, verificationSent }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <Mail className="w-5 h-5 mr-2 text-blue-500" />
        Email Verification Guide
      </h2>

      <div className="space-y-6">
        {/* Step 1 */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">1</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Check Your Email</h3>
            <p className="mt-1 text-gray-600">
              We've sent a verification link to <span className="font-medium">{email}</span>.
              Check your inbox and spam folder.
            </p>
            {verificationSent && (
              <div className="mt-2 text-sm text-green-600 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Verification email sent successfully!
              </div>
            )}
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">2</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Click the Link</h3>
            <p className="mt-1 text-gray-600">
              Open the email and click the "Verify Email Address" button or link.
              This confirms that you own this email address.
            </p>
            <div className="mt-3 p-3 bg-gray-50 rounded-md">
              <div className="flex items-center text-sm text-gray-500">
                <AlertCircle className="w-4 h-4 mr-2 text-amber-500" />
                Make sure you're signed in to complete the verification
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">3</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Complete Verification</h3>
            <p className="mt-1 text-gray-600">
              After clicking the link, you'll be redirected back to our site.
              Your email will be verified automatically.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">4</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Refresh the Page</h3>
            <p className="mt-1 text-gray-600">
              Once verified, refresh this page to see your updated verification status.
              You'll see a green checkmark when complete.
            </p>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Having trouble?</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
            <li>Check your spam or junk folder if you don't see the email</li>
            <li>Make sure you're using the same device/browser where you started</li>
            <li>The verification link expires after 24 hours</li>
            <li>Click "Send Verification Email" again if you need a new link</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationTutorial; 