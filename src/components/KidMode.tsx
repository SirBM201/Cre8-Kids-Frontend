import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import KidHome from './kid/KidHome';
import Stories from './kid/Stories';
import Songs from './kid/Songs';
import Quizzes from './kid/Quizzes';
import CalmCorner from './kid/CalmCorner';
import CoPlay from './kid/CoPlay';
import OfflinePacks from './kid/OfflinePacks';
import ClassCode from './kid/ClassCode';
import StoryReader from './kid/StoryReader';
import QuizRunner from './kid/QuizRunner';
import KidNavigation from './kid/KidNavigation';

const KidMode: React.FC = () => {
  const { state } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNavigation, setShowNavigation] = useState(true);

  // Hide navigation on story reader and quiz pages
  const hideNavigationPaths = ['/kid/story/', '/kid/quiz/'];
  const shouldHideNavigation = hideNavigationPaths.some(path => location.pathname.includes(path));

  return (
    <div className="kid-mode min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-primary-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: state.kidProfiles.find(p => p.id === state.currentChildId)?.avatarColor || '#3b82f6' }}
              >
                {state.kidProfiles.find(p => p.id === state.currentChildId)?.displayName?.charAt(0) || 'K'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Hi, {state.kidProfiles.find(p => p.id === state.currentChildId)?.displayName || 'Friend'}!
                </h1>
                <p className="text-sm text-gray-600">
                  {state.focusBeforeFun.dailyMinutesCompleted} / {state.parentSettings.focusBeforeFun.dailyLearningMinutes} minutes learned today
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Focus Before Fun Status */}
              {state.focusBeforeFun.funUnlockedUntil && (
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  🎉 Fun Time Unlocked!
                </div>
              )}
              
              {/* Mode Switch */}
              <button
                onClick={() => navigate('/')}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
              >
                Switch Mode
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<KidHome />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/calm-corner" element={<CalmCorner />} />
          <Route path="/co-play" element={<CoPlay />} />
          <Route path="/offline-packs" element={<OfflinePacks />} />
          <Route path="/class-code" element={<ClassCode />} />
          <Route path="/story/:storyId" element={<StoryReader />} />
          <Route path="/quiz/:quizId" element={<QuizRunner />} />
        </Routes>
      </div>

      {/* Bottom Navigation */}
      {!shouldHideNavigation && (
        <KidNavigation />
      )}
    </div>
  );
};

export default KidMode;
