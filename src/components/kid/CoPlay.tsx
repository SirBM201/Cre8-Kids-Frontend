import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { contentAPI } from '../../services/api';
import { Users, Play, Clock, Loader2, Filter, Sparkles, Heart } from 'lucide-react';

interface CoPlayCard {
  id: string;
  title: string;
  description?: string;
  steps: string;
  age_band: string;
  estimated_minutes: number;
  created_at: string;
}

const CoPlay: React.FC = () => {
  const { state } = useApp();
  const [selectedAgeBand, setSelectedAgeBand] = useState<string>('all');
  const [coPlayCards, setCoPlayCards] = useState<CoPlayCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const currentChild = state.kidProfiles.find(p => p.id === state.currentChildId);
  const childAgeBand = currentChild?.ageBand || '6-8';

  // Fetch co-play cards from backend
  useEffect(() => {
    const fetchCoPlayCards = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await contentAPI.getCoPlayCards();
        
        if (response.success && response.data) {
          setCoPlayCards(response.data);
        } else {
          setError(response.error || 'Failed to load co-play activities');
        }
      } catch (err) {
        setError('Failed to load co-play activities. Please try again.');
        console.error('Error fetching co-play cards:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoPlayCards();
  }, []);

  const ageBands = [
    { id: 'all', label: 'All Ages', color: 'from-blue-400 to-blue-600' },
    { id: '3-5', label: 'Ages 3-5', color: 'from-green-400 to-green-600' },
    { id: '6-8', label: 'Ages 6-8', color: 'from-purple-400 to-purple-600' },
    { id: '9-12', label: 'Ages 9-12', color: 'from-orange-400 to-orange-600' }
  ];

  const filteredCards = coPlayCards.filter(card => 
    selectedAgeBand === 'all' || card.age_band === selectedAgeBand
  );

  const parseSteps = (steps: string) => {
    try {
      return JSON.parse(steps);
    } catch {
      return [];
    }
  };

  const getCoPlayEmoji = (title: string) => {
    if (title.toLowerCase().includes('market') || title.toLowerCase().includes('color')) return '🛒';
    if (title.toLowerCase().includes('cooking') || title.toLowerCase().includes('baking')) return '👨‍🍳';
    if (title.toLowerCase().includes('garden') || title.toLowerCase().includes('plant')) return '🌱';
    if (title.toLowerCase().includes('art') || title.toLowerCase().includes('craft')) return '🎨';
    if (title.toLowerCase().includes('music') || title.toLowerCase().includes('dance')) return '💃';
    if (title.toLowerCase().includes('story') || title.toLowerCase().includes('read')) return '📚';
    return '👨‍👩‍👧‍👦';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 pb-20">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Co-Play</h1>
                <p className="text-gray-600">Loading your family activities...</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 pb-20">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Co-Play</h1>
                <p className="text-gray-600">Oops! Something went wrong</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-2xl font-bold text-gray-600 mb-2">Unable to load co-play activities</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Co-Play</h1>
              <p className="text-gray-600">Learn and have fun together with your family!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-3xl p-6 text-center border-2 border-indigo-200">
          <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Co-Play!</h2>
          <p className="text-gray-600">
            These activities are designed for you and your family to enjoy together. 
            Learning is more fun when we do it as a team!
          </p>
        </div>
      </div>

      {/* Age Band Filter */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center mb-4">
          <Filter className="w-4 h-4 text-gray-600 mr-2" />
          <span className="text-sm font-medium text-gray-700">Filter by age:</span>
        </div>
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

      {/* Cards Count */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <p className="text-gray-600 text-center">
          Found {filteredCards.length} co-play activit{filteredCards.length !== 1 ? 'ies' : 'y'} 
          {selectedAgeBand !== 'all' && ` for ages ${selectedAgeBand}`}
        </p>
      </div>

      {/* Co-Play Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => {
            const isRecommended = card.age_band === childAgeBand;
            const steps = parseSteps(card.steps);
            
            return (
              <div 
                key={card.id} 
                className={`bg-white rounded-3xl shadow-lg border-2 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
                  isRecommended ? 'border-indigo-300' : 'border-gray-100'
                }`}
                onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
              >
                {/* Card Header */}
                <div className={`relative h-32 flex items-center justify-center ${
                  isRecommended 
                    ? 'bg-gradient-to-br from-indigo-100 to-blue-100' 
                    : 'bg-gradient-to-br from-blue-100 to-indigo-100'
                }`}>
                  <div className="text-5xl">{getCoPlayEmoji(card.title)}</div>
                  {isRecommended && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Perfect!
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Info */}
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{card.title}</h3>
                    <p className="text-gray-600 text-sm">{card.description}</p>
                  </div>

                  {/* Age Band Badge */}
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      card.age_band === '3-5' ? 'bg-green-100 text-green-800' :
                      card.age_band === '6-8' ? 'bg-purple-100 text-purple-800' :
                      card.age_band === '9-12' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      Ages {card.age_band}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Clock className="w-4 h-4" />
                    <span>About {card.estimated_minutes} minutes</span>
                  </div>

                  {/* Steps Preview */}
                  {steps.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">What you'll do together:</p>
                      <div className="space-y-1">
                        {steps.slice(0, 2).map((step: string, index: number) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-sm text-gray-700">{step}</span>
                          </div>
                        ))}
                        {steps.length > 2 && (
                          <p className="text-sm text-gray-500 italic">
                            +{steps.length - 2} more steps...
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-indigo-400 to-blue-500 hover:from-indigo-500 hover:to-blue-600 text-white py-3 px-4 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                    <Play className="w-5 h-5" />
                    {selectedCard === card.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>

                {/* Expanded Details */}
                {selectedCard === card.id && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="pt-4">
                      <h4 className="font-semibold text-gray-800 mb-3">Complete Steps:</h4>
                      <div className="space-y-2">
                        {steps.map((step: string, index: number) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <span className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-sm text-gray-700">{step}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                        <div className="flex items-center gap-2 text-indigo-700">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm font-medium">Family Tip:</span>
                        </div>
                        <p className="text-sm text-indigo-600 mt-1">
                          Take turns leading each step and celebrate together when you complete the activity!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No co-play activities found</h3>
            <p className="text-gray-500">Try selecting a different age group</p>
          </div>
        )}
      </div>

      {/* Family Benefits */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">🌟 Benefits of Co-Play</h3>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-indigo-50 rounded-2xl p-4">
              <div className="text-3xl mb-2">💝</div>
              <h4 className="font-bold text-gray-800 mb-2">Stronger Bonds</h4>
              <p className="text-sm text-gray-600">Spending quality time together strengthens family relationships</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4">
              <div className="text-3xl mb-2">🧠</div>
              <h4 className="font-bold text-gray-800 mb-2">Better Learning</h4>
              <p className="text-sm text-gray-600">Children learn more effectively when parents are involved</p>
            </div>
            <div className="bg-purple-50 rounded-2xl p-4">
              <div className="text-3xl mb-2">😊</div>
              <h4 className="font-bold text-gray-800 mb-2">More Fun</h4>
              <p className="text-sm text-gray-600">Everything is more enjoyable when we do it together!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoPlay;
