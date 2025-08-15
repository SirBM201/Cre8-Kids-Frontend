import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  Users, 
  Calendar,
  Play,
  Heart,
  Brain,
  Music,
  Shield,
  BarChart3
} from 'lucide-react';

const ParentDashboard: React.FC = () => {
  const { state } = useApp();

  // Mock data for demo
  const quickStats = {
    totalLearningTime: '8.5 hrs',
    activitiesCompleted: 24,
    badgesEarned: 12,
    learningStreak: 7
  };

  const recentActivities = [
    { type: 'story', title: 'The Brave Little Mouse', duration: '15 min', time: '2 hours ago' },
    { type: 'quiz', title: 'Math Quiz - Addition', duration: '20 min', time: '4 hours ago' },
    { type: 'song', title: 'ABC Song', duration: '5 min', time: '6 hours ago' },
    { type: 'activity', title: 'Drawing Exercise', duration: '25 min', time: '1 day ago' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'story':
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'quiz':
        return <Brain className="w-5 h-5 text-purple-600" />;
      case 'song':
        return <Music className="w-5 h-5 text-green-600" />;
      case 'activity':
        return <Play className="w-5 h-5 text-orange-600" />;
      default:
        return <Play className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'story':
        return 'bg-blue-50 border-blue-200';
      case 'quiz':
        return 'bg-purple-50 border-purple-200';
      case 'song':
        return 'bg-green-50 border-green-200';
      case 'activity':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-blue-100">
          Here's what your child has been learning today
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Learning Time</p>
              <p className="text-2xl font-bold text-gray-800">{quickStats.totalLearningTime}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Activities Done</p>
              <p className="text-2xl font-bold text-gray-800">{quickStats.activitiesCompleted}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Badges Earned</p>
              <p className="text-2xl font-bold text-gray-800">{quickStats.badgesEarned}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Learning Streak</p>
              <p className="text-2xl font-bold text-gray-800">{quickStats.learningStreak} days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Learning Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Learning Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Daily Goal Progress</span>
              <span className="text-sm text-gray-600">75% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {quickStats.totalLearningTime} of 2 hours completed
            </p>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Focus-Before-Fun Status</span>
              <span className="text-sm text-green-600 font-medium">✅ Unlocked</span>
            </div>
            <p className="text-sm text-gray-600">
              Learning goal met! Fun activities are now available.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h2>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div key={index} className={`flex items-center gap-4 p-3 rounded-xl border ${getActivityColor(activity.type)}`}>
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{activity.title}</h3>
                <p className="text-sm text-gray-600">{activity.duration} • {activity.time}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 capitalize">{activity.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly Progress</h2>
        <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Progress chart coming soon...</p>
          </div>
        </div>
      </div>

      {/* Daily Conversation Prompt */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">💬 Daily Conversation Prompt</h2>
        <p className="text-gray-700 mb-4">
          "Ask your child about the story they read today. What was their favorite part? 
          What did they learn from it?"
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Updated daily at 6:00 PM</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Manage Profiles</p>
                <p className="text-sm text-gray-600">Update child settings</p>
              </div>
            </div>
          </button>

          <button className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-colors text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Safety Controls</p>
                <p className="text-sm text-gray-600">Set screen time limits</p>
              </div>
            </div>
          </button>

          <button className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-colors text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">View Reports</p>
                <p className="text-sm text-gray-600">Check learning progress</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Learning Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">💡 Learning Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-700">• Encourage reading together for 15-20 minutes daily</p>
            <p className="text-sm text-gray-700">• Ask questions about what they're learning</p>
            <p className="text-sm text-gray-700">• Celebrate small achievements and progress</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-700">• Set consistent learning times each day</p>
            <p className="text-sm text-gray-700">• Mix learning with fun activities</p>
            <p className="text-sm text-gray-700">• Be patient and supportive</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
