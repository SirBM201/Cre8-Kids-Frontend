import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { contentAPI } from '../../services/api';
import { BookOpen, Clock, Star, Filter, Loader2 } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  description?: string;
  age_band: string;
  tags: string;
  estimated_minutes: number;
  pageCount?: number;
  created_at: string;
}

const Stories: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useApp();
  const [selectedAgeBand, setSelectedAgeBand] = useState<string>('all');
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentChild = state.kidProfiles.find(p => p.id === state.currentChildId);
  const childAgeBand = currentChild?.ageBand || '6-8';

  // Fetch stories from backend
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await contentAPI.getStories();
        
        if (response.success && response.data) {
          setStories(response.data);
        } else {
          setError(response.error || 'Failed to load stories');
        }
      } catch (err) {
        setError('Failed to load stories. Please try again.');
        console.error('Error fetching stories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  // Filter stories by age band
  const filteredStories = stories.filter(story => 
    selectedAgeBand === 'all' || story.age_band === selectedAgeBand
  );

  const ageBands = [
    { id: 'all', label: 'All Ages', color: 'from-blue-400 to-blue-600' },
    { id: '3-5', label: 'Ages 3-5', color: 'from-green-400 to-green-600' },
    { id: '6-8', label: 'Ages 6-8', color: 'from-purple-400 to-purple-600' },
    { id: '9-12', label: 'Ages 9-12', color: 'from-orange-400 to-orange-600' }
  ];

  const getStoryEmoji = (title: string, tags: string) => {
    const tagList = tags ? JSON.parse(tags) : [];
    if (title.toLowerCase().includes('kite') || title.toLowerCase().includes('moon')) return '🪁';
    if (title.toLowerCase().includes('market') || title.toLowerCase().includes('color')) return '🛒';
    if (tagList.includes('adventure')) return '🗺️';
    if (tagList.includes('friendship')) return '🤝';
    if (tagList.includes('imagination')) return '✨';
    return '📚';
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
      <div className="pb-24 px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📚 Amazing Stories
          </h1>
          <p className="text-xl text-gray-600">
            Loading your magical adventures...
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pb-24 px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📚 Amazing Stories
          </h1>
          <p className="text-xl text-gray-600">
            Oops! Something went wrong
          </p>
        </div>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-2xl font-bold text-gray-600 mb-2">Unable to load stories</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          📚 Amazing Stories
        </h1>
        <p className="text-xl text-gray-600">
          Discover magical worlds and exciting adventures!
        </p>
      </div>

      {/* Age Band Filter */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          <span className="text-gray-700 font-medium">Filter by age:</span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {ageBands.map((band) => (
            <button
              key={band.id}
              onClick={() => setSelectedAgeBand(band.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                selectedAgeBand === band.id
                  ? `bg-gradient-to-r ${band.color} text-white shadow-lg`
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {band.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stories Count */}
      <div className="text-center mb-6">
        <p className="text-gray-600">
          Found {filteredStories.length} story{filteredStories.length !== 1 ? 's' : ''} 
          {selectedAgeBand !== 'all' && ` for ages ${selectedAgeBand}`}
        </p>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((story) => {
          const storyEmoji = getStoryEmoji(story.title, story.tags);
          const isRecommended = story.age_band === childAgeBand;
          const tags = parseTags(story.tags);
          
          return (
            <div
              key={story.id}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => navigate(`/kid/story/${story.id}`)}
            >
              <div className={`bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                isRecommended ? 'border-purple-300' : 'border-gray-200'
              } overflow-hidden`}>
                
                {/* Story Header */}
                <div className={`bg-gradient-to-br ${
                  isRecommended 
                    ? 'from-purple-400 to-purple-600' 
                    : 'from-blue-400 to-blue-600'
                } p-6 text-white text-center`}>
                  <div className="text-5xl mb-3">{storyEmoji}</div>
                  <h3 className="text-xl font-bold mb-2">{story.title}</h3>
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{story.estimated_minutes || 5} min read</span>
                  </div>
                </div>

                {/* Story Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      story.age_band === '3-5' ? 'bg-green-100 text-green-800' :
                      story.age_band === '6-8' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      Ages {story.age_band}
                    </span>
                    {isRecommended && (
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        Perfect for you!
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {story.description || 'An exciting story awaits you!'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <BookOpen className="w-4 h-4" />
                      <span>{story.pageCount || 1} page{(story.pageCount || 1) !== 1 ? 's' : ''}</span>
                    </div>
                    
                    <div className="flex space-x-1">
                      {tags.slice(0, 2).map((tag: string, index: number) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Read Button */}
                <div className="px-6 pb-6">
                  <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                    📖 Read Story
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Stories Message */}
      {filteredStories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-gray-600 mb-2">No stories found</h3>
          <p className="text-gray-500">
            Try selecting a different age group or check back later for new stories!
          </p>
        </div>
      )}

      {/* Reading Tips */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-6 border-2 border-blue-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">💡 Reading Tips</h3>
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="text-3xl mb-2">🎧</div>
            <h4 className="font-bold text-gray-800 mb-2">Use Read-Aloud</h4>
            <p className="text-sm text-gray-600">Click the speaker button to hear the story read to you!</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="text-3xl mb-2">📖</div>
            <h4 className="font-bold text-gray-800 mb-2">Take Your Time</h4>
            <p className="text-sm text-gray-600">Read slowly and look at the pictures carefully!</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="text-3xl mb-2">💭</div>
            <h4 className="font-bold text-gray-800 mb-2">Think About It</h4>
            <p className="text-sm text-gray-600">What do you think will happen next?</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stories;
