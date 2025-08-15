import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Award, BookOpen, Music, Brain } from 'lucide-react';

const ParentReports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedChild, setSelectedChild] = useState('all');

  const periods = [
    { id: 'week', label: 'This Week', color: 'from-blue-400 to-blue-600' },
    { id: 'month', label: 'This Month', color: 'from-green-400 to-green-600' },
    { id: 'quarter', label: 'This Quarter', color: 'from-purple-400 to-purple-600' }
  ];

  const children = [
    { id: 'all', name: 'All Children', avatar: '👥' },
    { id: '1', name: 'Emma', avatar: '👧' },
    { id: '2', name: 'Liam', avatar: '👦' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Learning Reports</h2>
        <div className="flex gap-3">
          <select
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
          >
            {children.map(child => (
              <option key={child.id} value={child.id}>
                {child.avatar} {child.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex gap-3">
        {periods.map((period) => (
          <button
            key={period.id}
            onClick={() => setSelectedPeriod(period.id)}
            className={`px-4 py-2 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 ${
              selectedPeriod === period.id
                ? `bg-gradient-to-r ${period.color} text-white shadow-lg`
                : 'bg-white text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Learning Time</p>
              <p className="text-2xl font-bold text-gray-800">8.5 hrs</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Badges Earned</p>
              <p className="text-2xl font-bold text-gray-800">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Activities</p>
              <p className="text-2xl font-bold text-gray-800">24</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-2xl font-bold text-gray-800">85%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Progress Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Learning Progress</h3>
        <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Progress chart coming soon...</p>
          </div>
        </div>
      </div>

      {/* Activity Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Activity Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-gray-700">Stories</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800">8 activities</p>
                <p className="text-sm text-gray-500">3.2 hours</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Music className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-700">Songs</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800">6 activities</p>
                <p className="text-sm text-gray-500">2.1 hours</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-gray-700">Quizzes</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800">10 activities</p>
                <p className="text-sm text-gray-500">3.2 hours</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Daily Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Monday</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800">2.5 hours</p>
                <p className="text-sm text-green-600">+15%</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Tuesday</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800">1.8 hours</p>
                <p className="text-sm text-red-600">-8%</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Wednesday</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800">3.2 hours</p>
                <p className="text-sm text-green-600">+25%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
            <div className="text-4xl mb-2">🏆</div>
            <h4 className="font-semibold text-gray-800 mb-1">Story Master</h4>
            <p className="text-sm text-gray-600">Read 10 stories</p>
            <p className="text-xs text-gray-500 mt-2">Earned 2 days ago</p>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200">
            <div className="text-4xl mb-2">🎵</div>
            <h4 className="font-semibold text-gray-800 mb-1">Music Lover</h4>
            <p className="text-sm text-gray-600">Listened to 5 songs</p>
            <p className="text-xs text-gray-500 mt-2">Earned 1 day ago</p>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <div className="text-4xl mb-2">🧠</div>
            <h4 className="font-semibold text-gray-800 mb-1">Quiz Champion</h4>
            <p className="text-sm text-gray-600">Completed 3 quizzes</p>
            <p className="text-xs text-gray-500 mt-2">Earned today</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentReports;
