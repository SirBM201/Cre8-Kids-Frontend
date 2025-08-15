import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Users, GraduationCap, Sparkles } from 'lucide-react';

const ModeSelector: React.FC = () => {
  const navigate = useNavigate();

  const modes = [
    {
      id: 'kid',
      title: 'Kid Mode',
      description: 'Stories, songs, quizzes, and fun learning!',
      icon: Star,
      color: 'from-blue-400 to-purple-500',
      route: '/kid'
    },
    {
      id: 'parent',
      title: 'Parent Mode',
      description: 'Settings, progress reports, and controls',
      icon: Users,
      color: 'from-green-400 to-blue-500',
      route: '/parent'
    },
    {
      id: 'educator',
      title: 'Educator Mode',
      description: 'Class assignments and lesson creation',
      icon: GraduationCap,
      color: 'from-purple-400 to-pink-500',
      route: '/educator'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Cre8 Kids
              </h1>
              <p className="text-xl text-gray-600 mt-2">Learn & Create Safely</p>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your experience below. Kid Mode is designed for children ages 3-12, 
            while Parent and Educator modes provide tools for grown-ups.
          </p>
        </div>

        {/* Mode Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {modes.map((mode) => {
            const IconComponent = mode.icon;
            return (
              <div
                key={mode.id}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                onClick={() => navigate(mode.route)}
              >
                <div className={`bg-gradient-to-br ${mode.color} rounded-3xl p-8 h-full shadow-xl hover:shadow-2xl transition-all duration-300`}>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">{mode.title}</h2>
                    <p className="text-white/90 text-lg leading-relaxed">{mode.description}</p>
                    
                    {/* Age indicators for Kid Mode */}
                    {mode.id === 'kid' && (
                      <div className="mt-6 flex justify-center space-x-2">
                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Ages 3-5
                        </span>
                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Ages 6-8
                        </span>
                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Ages 9-12
                        </span>
                      </div>
                    )}
                    
                    {/* Features for Parent Mode */}
                    {mode.id === 'parent' && (
                      <div className="mt-6 text-white/80 text-sm">
                        <p>• Safety controls</p>
                        <p>• Progress tracking</p>
                        <p>• Screen time management</p>
                      </div>
                    )}
                    
                    {/* Features for Educator Mode */}
                    {mode.id === 'educator' && (
                      <div className="mt-6 text-white/80 text-sm">
                        <p>• Create assignments</p>
                        <p>• Track class progress</p>
                        <p>• Build lessons</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p className="text-sm">
            Cre8 Kids is designed with safety and learning in mind. 
            No public chats, social feeds, or targeted ads in Kid Mode.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;
