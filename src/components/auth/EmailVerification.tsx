import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { authAPI } from '../../services/api';

interface EmailVerificationProps {
  email: string;
  onVerificationComplete: () => void;
}

export default function EmailVerification({ email, onVerificationComplete }: EmailVerificationProps) {
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendMessage('');
    setResendError('');

    try {
      const response = await authAPI.resendVerification(email);
      if (response.success) {
        setResendMessage('Verification email sent successfully! Please check your inbox.');
      } else {
        setResendError(response.error || 'Failed to resend verification email');
      }
    } catch (error) {
      setResendError('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Check Your Email
          </h1>
          <p className="text-gray-600">
            We've sent a verification link to
          </p>
          <p className="text-blue-600 font-semibold break-all">
            {email}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">What happens next?</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Click the verification link in your email</li>
                <li>• Your account will be activated</li>
                <li>• You can then log in and start using Cre8 Kids</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleResendVerification}
            disabled={isResending}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            {isResending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span>
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </span>
          </button>

          {resendMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800">{resendMessage}</span>
              </div>
            </div>
          )}

          {resendError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-800">{resendError}</span>
              </div>
            </div>
          )}

          <button
            onClick={onVerificationComplete}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            I've Verified My Email
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or{' '}
            <button
              onClick={handleResendVerification}
              disabled={isResending}
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              request a new one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
