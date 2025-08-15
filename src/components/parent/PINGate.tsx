import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Lock, Shield, Users, Eye, EyeOff } from 'lucide-react';

interface PINGateProps {
  onSuccess: () => void;
}

const PINGate: React.FC<PINGateProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { state } = useApp();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const correctPIN = state.parentSettings.pin;

  useEffect(() => {
    if (attempts >= 3) {
      setIsLocked(true);
      setTimeout(() => {
        setIsLocked(false);
        setAttempts(0);
        setError('');
      }, 30000); // 30 second lockout
    }
  }, [attempts]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      setError('Too many attempts. Please wait 30 seconds.');
      return;
    }

    if (pin === correctPIN) {
      setError('');
      onSuccess();
    } else {
      setError('Incorrect PIN. Please try again.');
      setAttempts(attempts + 1);
      setPin('');
    }
  };

  const handlePinChange = (value: string) => {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setPin(value);
      setError('');
      
      if (value.length === 4) {
        // Auto-submit when 4 digits are entered
        setTimeout(() => {
          if (value === correctPIN) {
            onSuccess();
          } else {
            setError('Incorrect PIN. Please try again.');
            setAttempts(attempts + 1);
            setPin('');
          }
        }, 100);
      }
    }
  };

  const remainingAttempts = 3 - attempts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Parent Access</h1>
          <p className="text-gray-600">
            Enter your 4-digit PIN to access parent controls and settings
          </p>
        </div>

        {/* PIN Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100">
          <form onSubmit={handlePinSubmit} className="space-y-6">
            {/* PIN Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Enter your 4-digit PIN
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => handlePinChange(e.target.value)}
                  placeholder="••••"
                  className="w-full text-center text-2xl font-mono tracking-widest py-4 px-6 border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  maxLength={4}
                  disabled={isLocked}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
                <p className="text-red-700 text-sm font-medium">{error}</p>
                {attempts > 0 && (
                  <p className="text-red-600 text-xs mt-1">
                    {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
                  </p>
                )}
              </div>
            )}

            {/* Lockout Message */}
            {isLocked && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-center">
                <p className="text-yellow-700 text-sm font-medium">
                  🔒 Too many failed attempts. Please wait 30 seconds before trying again.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={pin.length !== 4 || isLocked}
              className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200 transform ${
                pin.length === 4 && !isLocked
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLocked ? 'Locked' : 'Access Parent Mode'}
            </button>
          </form>

          {/* PIN Dots */}
          <div className="flex justify-center space-x-3 mt-6">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  index < pin.length
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Need Help?</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-gray-500" />
              <span>Default PIN is 1234 (you can change this in settings)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span>Contact your child's teacher if you've forgotten your PIN</span>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-700 transition-colors font-medium"
          >
            ← Back to Mode Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default PINGate;
