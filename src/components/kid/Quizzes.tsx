import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { contentAPI } from '../../services/api';
import { Brain, Play, Star, Clock, Award, Loader2, Filter } from 'lucide-react';

interface Quiz {
  id: string;
  title: string;
  description?: string;
  age_band: string;
  difficulty: string;
  time_limit?: number;
  questionCount?: number;
  tags: string;
  created_at: string;
}

const Quizzes: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useApp();
  const [selectedAgeBand, setSelectedAgeBand] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentChild = state.kidProfiles.find(p => p.id === state.currentChildId);
  const childAgeBand = currentChild?.ageBand || '6-8';

  // Fetch quizzes from backend
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await contentAPI.getQuizzes();
        
        if (response.success && response.data) {
          setQuizzes(response.data);
        } else {
          setError(response.error || 'Failed to load quizzes');
        }
      } catch (err) {
        setError('Failed to load quizzes. Please try again.');
        console.error('Error fetching quizzes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const ageBands = [
    { id: 'all', label: 'All Ages', color: 'from-blue-400 to-blue-600' },
    { id: '3-5', label: 'Ages 3-5', color: 'from-green-400 to-green-600' },
    { id: '6-8', label: 'Ages 6-8', color: 'from-purple-400 to-purple-600' },
    { id: '9-12', label: 'Ages 9-12', color: 'from-orange-400 to-orange-600' }
  ];

  const difficulties = [
    { id: 'all', label: 'All Levels', color: 'from-gray-400 to-gray-600' },
    { id: 'easy', label: 'Easy', color: 'from-green-400 to-green-600' },
    { id: 'medium', label: 'Medium', color: 'from-yellow-400 to-yellow-600' },
    { id: 'hard', label: 'Hard', color: 'from-red-400 to-red-600' }
  ];

  const filteredQuizzes = quizzes.filter(quiz => {
    const ageMatch = selectedAgeBand === 'all' || quiz.age_band === selectedAgeBand;
    const difficultyMatch = selectedDifficulty === 'all' || quiz.difficulty === selectedDifficulty;
    return ageMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'hard':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (tags: string) => {
    try {
      const tagList = JSON.parse(tags);
      if (tagList.includes('math')) return '🧮';
      if (tagList.includes('science')) return '🔬';
      if (tagList.includes('language')) return '📚';
      if (tagList.includes('arts')) return '🎨';
      if (tagList.includes('history')) return '📜';
      if (tagList.includes('geography')) return '🌍';
    } catch {
      // If tags can't be parsed, return default
    }
    return '❓';
  };

  const parseTags = (tags: string) => {
    try {
      return JSON.parse(tags);
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pb-20">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Quizzes</h1>
                <p className="text-gray-600">Loading your learning challenges...</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pb-20">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Quizzes</h1>
                <p className="text-gray-600">Oops! Something went wrong</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-2xl font-bold text-gray-600 mb-2">Unable to load quizzes</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Quizzes</h1>
              <p className="text-gray-600">Test your knowledge and learn new things!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {/* Age Band Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Age Group
          </h3>
          <div className="flex flex-wrap gap-3">
            {ageBands.map((band) => (
              <button
                key={band.id}
                onClick={() => setSelectedAgeBand(band.id)}
                className={`px-4 py-2 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 ${
                  selectedAgeBand === band.id
                    ? `bg-gradient-to-r ${band.color} text-white shadow-lg`
                    : 'bg-white text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {band.label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Difficulty Level
          </h3>
          <div className="flex flex-wrap gap-3">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty.id}
                onClick={() => setSelectedDifficulty(difficulty.id)}
                className={`px-4 py-2 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 ${
                  selectedDifficulty === difficulty.id
                    ? `bg-gradient-to-r ${difficulty.color} text-white shadow-lg`
                    : 'bg-white text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {difficulty.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quizzes Count */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <p className="text-gray-600 text-center">
          Found {filteredQuizzes.length} quiz{filteredQuizzes.length !== 1 ? 'zes' : ''} 
          {selectedAgeBand !== 'all' && ` for ages ${selectedAgeBand}`}
          {selectedDifficulty !== 'all' && ` at ${selectedDifficulty} level`}
        </p>
      </div>

      {/* Quizzes Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            const isRecommended = quiz.age_band === childAgeBand;
            const tags = parseTags(quiz.tags);
            
            return (
              <div 
                key={quiz.id} 
                className={`bg-white rounded-3xl shadow-lg border-2 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
                  isRecommended ? 'border-purple-300' : 'border-gray-100'
                }`}
                onClick={() => navigate(`/kid/quiz/${quiz.id}`)}
              >
                {/* Quiz Header */}
                <div className={`relative h-32 flex items-center justify-center ${
                  isRecommended 
                    ? 'bg-gradient-to-br from-purple-100 to-blue-100' 
                    : 'bg-gradient-to-br from-blue-100 to-purple-100'
                }`}>
                  <div className="text-6xl">{getCategoryIcon(quiz.tags)}</div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                      {quiz.difficulty}
                    </span>
                  </div>
                  {isRecommended && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        Perfect!
                      </span>
                    </div>
                  )}
                </div>

                {/* Quiz Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{quiz.title}</h3>
                      <p className="text-gray-600 text-sm">{quiz.description || 'Test your knowledge!'}</p>
                    </div>
                  </div>

                  {/* Quiz Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1">
                        <Clock className="w-4 h-4" />
                      </div>
                      <p className="text-lg font-semibold text-gray-800">{quiz.time_limit || 5}</p>
                      <p className="text-xs text-gray-500">minutes</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1">
                        <Star className="w-4 h-4" />
                      </div>
                      <p className="text-lg font-semibold text-gray-800">{quiz.questionCount || 5}</p>
                      <p className="text-xs text-gray-500">questions</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1">
                        <Award className="w-4 h-4" />
                      </div>
                      <p className="text-lg font-semibold text-gray-800">100</p>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  </div>

                  {/* Age Band Badge */}
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      quiz.age_band === '3-5' ? 'bg-green-100 text-green-800' :
                      quiz.age_band === '6-8' ? 'bg-purple-100 text-purple-800' :
                      quiz.age_band === '9-12' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      Ages {quiz.age_band}
                    </span>
                  </div>

                  {/* Topics */}
                  {tags && tags.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Topics:</p>
                      <div className="flex flex-wrap gap-2">
                        {tags.slice(0, 3).map((tag: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                        {tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            +{tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-purple-400 to-blue-500 text-white py-3 px-6 rounded-2xl font-semibold text-lg hover:from-purple-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2">
                    <Play className="w-5 h-5" />
                    Start Quiz
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredQuizzes.length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No quizzes found</h3>
            <p className="text-gray-500">Try selecting different filters</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Quiz Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">0</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">0</p>
              <p className="text-sm text-gray-600">Points Earned</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">0%</p>
              <p className="text-sm text-gray-600">Average Score</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">0 min</p>
              <p className="text-sm text-gray-600">Time Spent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quizzes;
