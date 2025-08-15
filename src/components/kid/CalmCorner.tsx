import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { contentAPI } from '../../services/api';
import { Heart, Play, Pause, Clock, Loader2, Filter, Sparkles } from 'lucide-react';

interface CalmItem {
  id: string;
  title: string;
  description?: string;
  type: string;
  content: string;
  age_band: string;
  duration: number;
  audio_url?: string;
  image_url?: string;
  created_at: string;
}

const CalmCorner: React.FC = () => {
  const { state } = useApp();
  const [selectedAgeBand, setSelectedAgeBand] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [calmItems, setCalmItems] = useState<CalmItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingItem, setPlayingItem] = useState<string | null>(null);

  const currentChild = state.kidProfiles.find(p => p.id === state.currentChildId);
  const childAgeBand = currentChild?.ageBand || '6-8';

  // Fetch calm corner items from backend
  useEffect(() => {
    const fetchCalmItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await contentAPI.getCalmCorner();
        
        if (response.success && response.data) {
          setCalmItems(response.data);
        } else {
          setError(response.error || 'Failed to load calming activities');
        }
      } catch (err) {
        setError('Failed to load calming activities. Please try again.');
        console.error('Error fetching calm items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalmItems();
  }, []);

  const ageBands = [
    { id: 'all', label: 'All Ages', color: 'from-blue-400 to-blue-600' },
    { id: '3-5', label: 'Ages 3-5', color: 'from-green-400 to-green-600' },
    { id: '6-8', label: 'Ages 6-8', color: 'from-purple-400 to-purple-600' },
    { id: '9-12', label: 'Ages 9-12', color: 'from-orange-400 to-orange-600' }
  ];

  const types = [
    { id: 'all', label: 'All Types', color: 'from-gray-400 to-gray-600' },
    { id: 'audio', label: 'Audio', color: 'from-blue-400 to-blue-600' },
    { id: 'story', label: 'Story', color: 'from-purple-400 to-purple-600' },
    { id: 'breathing', label: 'Breathing', color: 'from-green-400 to-green-600' },
    { id: 'meditation', label: 'Meditation', color: 'from-pink-400 to-pink-600' }
  ];

  const filteredItems = calmItems.filter(item => {
    const ageMatch = selectedAgeBand === 'all' || item.age_band === selectedAgeBand;
    const typeMatch = selectedType === 'all' || item.type === selectedType;
    return ageMatch && typeMatch;
  });

  const handlePlayItem = (itemId: string) => {
    if (playingItem === itemId) {
      setPlayingItem(null);
    } else {
      setPlayingItem(itemId);
    }
  };

  const getCalmEmoji = (type: string) => {
    switch (type) {
      case 'audio':
        return '🎧';
      case 'story':
        return '📖';
      case 'breathing':
        return '🫁';
      case 'meditation':
        return '🧘';
      default:
        return '✨';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pb-20">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Calm Corner</h1>
                <p className="text-gray-600">Loading your peaceful activities...</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pb-20">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Calm Corner</h1>
                <p className="text-gray-600">Oops! Something went wrong</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-2xl font-bold text-gray-600 mb-2">Unable to load calming activities</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Calm Corner</h1>
              <p className="text-gray-600">Take a peaceful break and find your calm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-3xl p-6 text-center border-2 border-pink-200">
          <div className="text-4xl mb-3">🧘‍♀️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Your Calm Corner</h2>
          <p className="text-gray-600">
            When you're feeling overwhelmed, excited, or need a moment to breathe, 
            this is your special place to find peace and calm.
          </p>
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

        {/* Type Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Activity Type
          </h3>
          <div className="flex flex-wrap gap-3">
            {types.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-4 py-2 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 ${
                  selectedType === type.id
                    ? `bg-gradient-to-r ${type.color} text-white shadow-lg`
                    : 'bg-white text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items Count */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <p className="text-gray-600 text-center">
          Found {filteredItems.length} calming activit{filteredItems.length !== 1 ? 'ies' : 'y'} 
          {selectedAgeBand !== 'all' && ` for ages ${selectedAgeBand}`}
          {selectedType !== 'all' && ` of type ${selectedType}`}
        </p>
      </div>

      {/* Calm Items Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isRecommended = item.age_band === childAgeBand;
            
            return (
              <div 
                key={item.id} 
                className={`bg-white rounded-3xl shadow-lg border-2 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  isRecommended ? 'border-pink-300' : 'border-gray-100'
                }`}
              >
                {/* Item Header */}
                <div className={`relative h-32 flex items-center justify-center ${
                  isRecommended 
                    ? 'bg-gradient-to-br from-pink-100 to-purple-100' 
                    : 'bg-gradient-to-br from-purple-100 to-pink-100'
                }`}>
                  <div className="text-5xl">{getCalmEmoji(item.type)}</div>
                  {isRecommended && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Perfect!
                      </span>
                    </div>
                  )}
                </div>

                {/* Item Info */}
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>

                  {/* Age Band Badge */}
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      item.age_band === '3-5' ? 'bg-green-100 text-green-800' :
                      item.age_band === '6-8' ? 'bg-purple-100 text-purple-800' :
                      item.age_band === '9-12' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      Ages {item.age_band}
                    </span>
                  </div>

                  {/* Content Preview */}
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.content.substring(0, 80)}...
                    </p>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(item.duration)}</span>
                    </div>
                    <span className="text-sm text-gray-500 capitalize">{item.type}</span>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handlePlayItem(item.id)}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                      playingItem === item.id
                        ? 'bg-gradient-to-r from-red-400 to-red-600 text-white shadow-lg'
                        : 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-lg hover:from-pink-500 hover:to-purple-600'
                    }`}
                  >
                    {playingItem === item.id ? (
                      <>
                        <Pause className="w-5 h-5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Start Activity
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No calming activities found</h3>
            <p className="text-gray-500">Try selecting different filters</p>
          </div>
        )}
      </div>

      {/* Calming Tips */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">💡 Calming Tips</h3>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-pink-50 rounded-2xl p-4">
              <div className="text-3xl mb-2">🫁</div>
              <h4 className="font-bold text-gray-800 mb-2">Take Deep Breaths</h4>
              <p className="text-sm text-gray-600">Breathe in slowly through your nose, hold, then breathe out through your mouth</p>
            </div>
            <div className="bg-purple-50 rounded-2xl p-4">
              <div className="text-3xl mb-2">🧘</div>
              <h4 className="font-bold text-gray-800 mb-2">Find a Quiet Spot</h4>
              <p className="text-sm text-gray-600">Sit comfortably and close your eyes for a few minutes</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4">
              <div className="text-3xl mb-2">💭</div>
              <h4 className="font-bold text-gray-800 mb-2">Think Happy Thoughts</h4>
              <p className="text-sm text-gray-600">Picture something that makes you smile and happy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalmCorner;
