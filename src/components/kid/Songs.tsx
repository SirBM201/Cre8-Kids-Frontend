import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { contentAPI } from '../../services/api';
import { Music, Play, Pause, Volume2, VolumeX, Heart, Download, Loader2, Filter } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  description?: string;
  age_band: string;
  tags: string;
  audio_url: string;
  duration: number;
  lyrics?: string;
  created_at: string;
}

const Songs: React.FC = () => {
  const { state } = useApp();
  const [selectedAgeBand, setSelectedAgeBand] = useState<string>('all');
  const [playingSong, setPlayingSong] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentChild = state.kidProfiles.find(p => p.id === state.currentChildId);
  const childAgeBand = currentChild?.ageBand || '6-8';

  // Fetch songs from backend
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await contentAPI.getSongs();
        
        if (response.success && response.data) {
          setSongs(response.data);
        } else {
          setError(response.error || 'Failed to load songs');
        }
      } catch (err) {
        setError('Failed to load songs. Please try again.');
        console.error('Error fetching songs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const ageBands = [
    { id: 'all', label: 'All Ages', color: 'from-blue-400 to-blue-600' },
    { id: '3-5', label: 'Ages 3-5', color: 'from-green-400 to-green-600' },
    { id: '6-8', label: 'Ages 6-8', color: 'from-purple-400 to-purple-600' },
    { id: '9-12', label: 'Ages 9-12', color: 'from-orange-400 to-orange-600' }
  ];

  const filteredSongs = selectedAgeBand === 'all' 
    ? songs 
    : songs.filter(song => song.age_band === selectedAgeBand);

  const handlePlaySong = (songId: string) => {
    if (playingSong === songId) {
      setPlayingSong(null);
    } else {
      setPlayingSong(songId);
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const getSongEmoji = (tags: string) => {
    try {
      const tagList = JSON.parse(tags);
      if (tagList.includes('movement')) return '💃';
      if (tagList.includes('counting')) return '🔢';
      if (tagList.includes('alphabet')) return '🔤';
      if (tagList.includes('animals')) return '🐾';
      if (tagList.includes('nature')) return '🌿';
      if (tagList.includes('friendship')) return '🤝';
    } catch {
      // If tags can't be parsed, return default
    }
    return '🎵';
  };

  const parseTags = (tags: string) => {
    try {
      return JSON.parse(tags);
    } catch {
      return [];
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-20">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Songs</h1>
                <p className="text-gray-600">Loading your musical adventures...</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-20">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Songs</h1>
                <p className="text-gray-600">Oops! Something went wrong</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-2xl font-bold text-gray-600 mb-2">Unable to load songs</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Songs</h1>
              <p className="text-gray-600">Sing along and learn with fun music!</p>
            </div>
          </div>
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

      {/* Songs Count */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <p className="text-gray-600 text-center">
          Found {filteredSongs.length} song{filteredSongs.length !== 1 ? 's' : ''} 
          {selectedAgeBand !== 'all' && ` for ages ${selectedAgeBand}`}
        </p>
      </div>

      {/* Songs Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSongs.map((song) => {
            const isRecommended = song.age_band === childAgeBand;
            const tags = parseTags(song.tags);
            
            return (
              <div 
                key={song.id} 
                className={`bg-white rounded-3xl shadow-lg border-2 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  isRecommended ? 'border-green-300' : 'border-gray-100'
                }`}
              >
                {/* Song Image */}
                <div className={`relative h-48 flex items-center justify-center ${
                  isRecommended 
                    ? 'bg-gradient-to-br from-green-100 to-blue-100' 
                    : 'bg-gradient-to-br from-blue-100 to-green-100'
                }`}>
                  <div className="text-6xl">{getSongEmoji(song.tags)}</div>
                  {playingSong === song.id && (
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  )}
                  {isRecommended && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Perfect for you!
                      </span>
                    </div>
                  )}
                </div>

                {/* Song Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{song.title}</h3>
                      <p className="text-gray-600 text-sm">Cre8 Kids</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Age Band Badge */}
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      song.age_band === '3-5' ? 'bg-green-100 text-green-800' :
                      song.age_band === '6-8' ? 'bg-purple-100 text-purple-800' :
                      song.age_band === '9-12' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      Ages {song.age_band}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {song.description || 'A fun and educational song!'}
                  </p>

                  {/* Duration and Tags */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">{formatDuration(song.duration)}</span>
                    <div className="flex space-x-1">
                      {tags.slice(0, 2).map((tag: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handlePlaySong(song.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                        playingSong === song.id
                          ? 'bg-gradient-to-r from-red-400 to-red-600 text-white shadow-lg'
                          : 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg hover:from-green-500 hover:to-green-700'
                      }`}
                    >
                      {playingSong === song.id ? (
                        <>
                          <Pause className="w-5 h-5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          Play
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={handleToggleMute}
                      className={`p-3 rounded-2xl transition-all duration-200 ${
                        isMuted 
                          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSongs.length === 0 && (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No songs found</h3>
            <p className="text-gray-500">Try selecting a different age band</p>
          </div>
        )}
      </div>

      {/* Audio Player Bar (Fixed Bottom) */}
      {playingSong && (
        <div className="fixed bottom-20 left-0 right-0 bg-white border-t-2 border-green-200 shadow-lg z-40">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">
                  {songs.find(s => s.id === playingSong)?.title}
                </h4>
                <p className="text-sm text-gray-600">
                  Cre8 Kids
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPlayingSong(null)}
                  className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                >
                  <Pause className="w-5 h-5" />
                </button>
                <button
                  onClick={handleToggleMute}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isMuted 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Songs;
