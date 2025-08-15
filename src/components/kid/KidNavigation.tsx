import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Music, Brain, Heart, Users, Download, Hash } from 'lucide-react';

const KidNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/kid', icon: BookOpen, label: 'Home', color: 'from-blue-400 to-blue-600' },
    { path: '/kid/stories', icon: BookOpen, label: 'Stories', color: 'from-purple-400 to-purple-600' },
    { path: '/kid/songs', icon: Music, label: 'Songs', color: 'from-green-400 to-green-600' },
    { path: '/kid/quizzes', icon: Brain, label: 'Quizzes', color: 'from-yellow-400 to-yellow-600' },
    { path: '/kid/calm-corner', icon: Heart, label: 'Calm', color: 'from-pink-400 to-pink-600' },
    { path: '/kid/co-play', icon: Users, label: 'Co-Play', color: 'from-indigo-400 to-indigo-600' },
    { path: '/kid/offline-packs', icon: Download, label: 'Offline', color: 'from-gray-400 to-gray-600' },
    { path: '/kid/class-code', icon: Hash, label: 'Class', color: 'from-orange-400 to-orange-600' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-primary-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-2 py-2">
        <div className="grid grid-cols-8 gap-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200 transform hover:scale-105 ${
                  isActive 
                    ? `bg-gradient-to-br ${item.color} text-white shadow-lg` 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <IconComponent className={`w-6 h-6 mb-1 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-gray-600'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KidNavigation;
