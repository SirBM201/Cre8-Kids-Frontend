import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BookOpen, Music, Brain, Heart, Users, Download, Hash, Star, Trophy } from 'lucide-react';

const KidHome: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useApp();

  const currentChild = state.kidProfiles.find(p => p.id === state.currentChildId);
  const todayProgress = state.progress[new Date().toISOString().split('T')[0]] || {
    learningMinutes: 0,
    completedItems: [],
    badgesEarned: []
  };

  const homeTiles = [
    {
      id: 'stories',
      title: 'Stories',
      description: 'Read amazing tales!',
      icon: BookOpen,
      color: 'from-purple-400 to-purple-600',
      route: '/kid/stories',
      emoji: '📚',
      locked: false
    },
    {
      id: 'songs',
      title: 'Songs',
      description: 'Sing and dance!',
      icon: Music,
      color: 'from-green-400 to-green-600',
      route: '/kid/songs',
      emoji: '🎵',
      locked: !state.focusBeforeFun.funUnlockedUntil
    },
    {
      id: 'quizzes',
      title: 'Quizzes',
      description: 'Test your knowledge!',
      icon: Brain,
      color: 'from-yellow-400 to-yellow-600',
      route: '/kid/quizzes',
      emoji: '🧠',
      locked: false
    },
    {
      id: 'calm-corner',
      title: 'Calm Corner',
      description: 'Take a peaceful break',
      icon: Heart,
      color: 'from-pink-400 to-pink-600',
      route: '/kid/calm-corner',
      emoji: '🧘',
      locked: false
    },
    {
      id: 'co-play',
      title: 'Co-Play',
      description: 'Play with family!',
      icon: Users,
      color: 'from-indigo-400 to-indigo-600',
      route: '/kid/co-play',
      emoji: '👨‍👩‍👧‍👦',
      locked: false
    },
    {
      id: 'offline-packs',
      title: 'Offline Packs',
      description: 'Download for later',
      icon: Download,
      color: 'from-gray-400 to-gray-600',
      route: '/kid/offline-packs',
      emoji: '📱',
      locked: false
    },
    {
      id: 'class-code',
      title: 'Enter Class Code',
      description: 'Join your class!',
      icon: Hash,
      color: 'from-orange-400 to-orange-600',
      route: '/kid/class-code',
      emoji: '🏫',
      locked: false
    }
  ];

  return (
    <div className="pb-24 px-4 py-6">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome back, {currentChild?.displayName || 'Friend'}! 👋
        </h1>
        <p className="text-xl text-gray-600">
          Ready for another day of learning and fun?
        </p>
      </div>

      {/* Progress Summary */}
      <div className="bg-white rounded-3xl p-6 mb-8 shadow-lg border-2 border-primary-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Today's Progress</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {todayProgress.learningMinutes}
              </div>
              <div className="text-sm text-gray-600">Minutes Learned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {todayProgress.completedItems.length}
              </div>
              <div className="text-sm text-gray-600">Activities Done</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {todayProgress.badgesEarned.length}
              </div>
              <div className="text-sm text-gray-600">Badges Earned</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Learning Goal</span>
              <span>{state.parentSettings.focusBeforeFun.dailyLearningMinutes} minutes</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min(100, (todayProgress.learningMinutes / state.parentSettings.focusBeforeFun.dailyLearningMinutes) * 100)}%` 
                }}
              ></div>
            </div>
          </div>

          {/* Focus Before Fun Status */}
          {state.focusBeforeFun.funUnlockedUntil ? (
            <div className="mt-4 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              🎉 Fun activities unlocked! You've earned your play time!
            </div>
          ) : (
            <div className="mt-4 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              📚 Keep learning to unlock fun activities!
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {todayProgress.badgesEarned.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-6 mb-8 text-white text-center shadow-lg">
          <h3 className="text-2xl font-bold mb-2">🎖️ New Badges!</h3>
          <p className="text-lg">
            You've earned {todayProgress.badgesEarned.length} new badge{todayProgress.badgesEarned.length > 1 ? 's' : ''} today!
          </p>
        </div>
      )}

      {/* Activity Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {homeTiles.map((tile) => {
          const IconComponent = tile.icon;
          
          return (
            <div
              key={tile.id}
              className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                tile.locked ? 'opacity-60' : ''
              }`}
              onClick={() => !tile.locked && navigate(tile.route)}
            >
              <div className={`bg-gradient-to-br ${tile.color} rounded-3xl p-6 h-32 flex flex-col items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300`}>
                <div className="text-4xl mb-2">{tile.emoji}</div>
                <h3 className="text-lg font-bold text-center mb-1">{tile.title}</h3>
                <p className="text-xs text-center text-white/80">{tile.description}</p>
                
                {/* Lock Overlay */}
                {tile.locked && (
                  <div className="absolute inset-0 bg-black/30 rounded-3xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🔒</div>
                      <div className="text-xs font-medium">Complete {state.parentSettings.focusBeforeFun.dailyLearningMinutes} minutes of learning first!</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Challenge */}
      <div className="mt-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl p-6 text-white text-center shadow-lg">
        <h3 className="text-2xl font-bold mb-2">🌟 Daily Challenge</h3>
        <p className="text-lg mb-4">
          Complete a story and a quiz today to earn a special badge!
        </p>
        <div className="flex justify-center space-x-4">
          <div className="bg-white/20 rounded-full px-4 py-2">
            <span className="text-sm">📚 Story</span>
          </div>
          <div className="bg-white/20 rounded-full px-4 py-2">
            <span className="text-sm">🧠 Quiz</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KidHome;
