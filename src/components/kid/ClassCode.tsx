import React, { useState } from 'react';
import { Hash, Users, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const ClassCode: React.FC = () => {
  const [classCode, setClassCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classCode.trim()) return;

    setIsSubmitting(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      if (classCode.toLowerCase() === 'demo123') {
        setSubmitted(true);
      } else {
        setError('Invalid class code. Please check and try again.');
      }
    }, 1500);
  };

  const handleNewCode = () => {
    setClassCode('');
    setSubmitted(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center">
              <Hash className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Enter Class Code</h1>
              <p className="text-gray-600">Join your class and learn with friends!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        {!submitted ? (
          <div className="bg-white rounded-3xl shadow-lg border-2 border-orange-100 p-8">
            {/* Welcome Message */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🏫</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Join Your Class!</h2>
              <p className="text-gray-600 text-lg">
                Enter the class code your teacher gave you to access special learning activities and join your classmates.
              </p>
            </div>

            {/* Class Code Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="classCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Class Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="classCode"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                    placeholder="Enter your class code (e.g., DEMO123)"
                    className="w-full px-4 py-3 text-lg font-mono text-center border-2 border-gray-200 rounded-2xl focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-200"
                    maxLength={10}
                    disabled={isSubmitting}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Hash className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Class codes are usually 6-8 characters long
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!classCode.trim() || isSubmitting}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-105 ${
                  !classCode.trim() || isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white shadow-lg'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Joining Class...
                  </div>
                ) : (
                  'Join Class'
                )}
              </button>
            </form>

            {/* Help Text */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 mb-2">Don't have a class code?</p>
              <p className="text-sm text-gray-400">
                Ask your teacher or parent for the class code. They can find it in their educator or parent dashboard.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-lg border-2 border-green-100 p-8">
            {/* Success Message */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Class!</h2>
              <p className="text-gray-600 text-lg">
                You've successfully joined your class. You can now access special class activities and learn with your friends!
              </p>
            </div>

            {/* Class Info */}
            <div className="bg-green-50 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">Class Information</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Class Code:</strong> {classCode}</p>
                <p><strong>Status:</strong> Active Member</p>
                <p><strong>Joined:</strong> Just now</p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">What's Next?</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Check out your new class activities</p>
                <p>• Complete assignments from your teacher</p>
                <p>• See how you rank with your classmates</p>
                <p>• Participate in class challenges</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => window.location.href = '/kid'}
                className="flex-1 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Go to Home
              </button>
              <button
                onClick={handleNewCode}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Join Another Class
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <div className="max-w-4xl mx-auto px-4 pb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">🌟 Benefits of Joining a Class</h3>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-orange-50 rounded-2xl p-4">
              <div className="text-3xl mb-2">👥</div>
              <h4 className="font-bold text-gray-800 mb-2">Learn Together</h4>
              <p className="text-sm text-gray-600">Collaborate with classmates and share your progress</p>
            </div>
            <div className="bg-red-50 rounded-2xl p-4">
              <div className="text-3xl mb-2">🏆</div>
              <h4 className="font-bold text-gray-800 mb-2">Class Challenges</h4>
              <p className="text-sm text-gray-600">Participate in fun competitions with your friends</p>
            </div>
            <div className="bg-yellow-50 rounded-2xl p-4">
              <div className="text-3xl mb-2">📊</div>
              <h4 className="font-bold text-gray-800 mb-2">Track Progress</h4>
              <p className="text-sm text-gray-600">See how you're doing compared to your classmates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassCode;
