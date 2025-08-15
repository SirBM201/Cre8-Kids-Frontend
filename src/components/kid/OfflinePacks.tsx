import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { contentAPI } from '../../services/api';
import { Download, Wifi, WifiOff, CheckCircle, Loader2, Filter, Package, HardDrive } from 'lucide-react';

interface OfflinePack {
  id: string;
  title: string;
  description?: string;
  content_ids: string;
  file_size: number;
  download_count: number;
  created_at: string;
}

const OfflinePacks: React.FC = () => {
  const { state } = useApp();
  const [offlinePacks, setOfflinePacks] = useState<OfflinePack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingPacks, setDownloadingPacks] = useState<Set<string>>(new Set());
  const [downloadedPacks, setDownloadedPacks] = useState<Set<string>>(new Set());

  const currentChild = state.kidProfiles.find(p => p.id === state.currentChildId);
  const childAgeBand = currentChild?.ageBand || '6-8';

  // Fetch offline packs from backend
  useEffect(() => {
    const fetchOfflinePacks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await contentAPI.getOfflinePacks();
        
        if (response.success && response.data) {
          setOfflinePacks(response.data);
        } else {
          setError(response.error || 'Failed to load offline packs');
        }
      } catch (err) {
        setError('Failed to load offline packs. Please try again.');
        console.error('Error fetching offline packs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOfflinePacks();
  }, []);

  const handleDownloadPack = async (packId: string) => {
    setDownloadingPacks(prev => new Set(prev).add(packId));
    
    // Simulate download process
    setTimeout(() => {
      setDownloadingPacks(prev => {
        const newSet = new Set(prev);
        newSet.delete(packId);
        return newSet;
      });
      setDownloadedPacks(prev => new Set(prev).add(packId));
    }, 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const parseContentIds = (contentIds: string) => {
    try {
      return JSON.parse(contentIds);
    } catch {
      return [];
    }
  };

  const getPackEmoji = (title: string) => {
    if (title.toLowerCase().includes('starter') || title.toLowerCase().includes('beginner')) return '🚀';
    if (title.toLowerCase().includes('math')) return '🧮';
    if (title.toLowerCase().includes('science')) return '🔬';
    if (title.toLowerCase().includes('language')) return '📚';
    if (title.toLowerCase().includes('arts')) return '🎨';
    if (title.toLowerCase().includes('holiday')) return '🎉';
    if (title.toLowerCase().includes('summer')) return '☀️';
    if (title.toLowerCase().includes('winter')) return '❄️';
    return '📦';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-blue-500 rounded-2xl flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Offline Packs</h1>
                <p className="text-gray-600">Loading your downloadable content...</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-blue-500 rounded-2xl flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Offline Packs</h1>
                <p className="text-gray-600">Oops! Something went wrong</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-2xl font-bold text-gray-600 mb-2">Unable to load offline packs</h3>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-blue-500 rounded-2xl flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Offline Packs</h1>
              <p className="text-gray-600">Download content to use without internet!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-gray-100 to-blue-100 rounded-3xl p-6 text-center border-2 border-gray-200">
          <div className="text-4xl mb-3">📱</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Go Offline!</h2>
          <p className="text-gray-600">
            Download these learning packs to enjoy stories, songs, and activities 
            even when you don't have internet connection.
          </p>
        </div>
      </div>

      {/* Offline Status */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wifi className="w-6 h-6 text-green-500" />
              <div>
                <h3 className="font-semibold text-gray-800">Internet Status</h3>
                <p className="text-sm text-gray-600">You're online - ready to download!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">
                {downloadedPacks.size}
              </div>
              <div className="text-sm text-gray-600">Packs Downloaded</div>
            </div>
          </div>
        </div>
      </div>

      {/* Packs Count */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <p className="text-gray-600 text-center">
          Found {offlinePacks.length} offline pack{offlinePacks.length !== 1 ? 's' : ''} available for download
        </p>
      </div>

      {/* Offline Packs Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offlinePacks.map((pack) => {
            const isDownloading = downloadingPacks.has(pack.id);
            const isDownloaded = downloadedPacks.has(pack.id);
            const contentIds = parseContentIds(pack.content_ids);
            
            return (
              <div 
                key={pack.id} 
                className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Pack Header */}
                <div className="relative h-32 bg-gradient-to-br from-gray-100 to-blue-100 flex items-center justify-center">
                  <div className="text-5xl">{getPackEmoji(pack.title)}</div>
                  {isDownloaded && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                  )}
                </div>

                {/* Pack Info */}
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{pack.title}</h3>
                    <p className="text-gray-600 text-sm">{pack.description}</p>
                  </div>

                  {/* Pack Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1">
                        <Package className="w-4 h-4" />
                      </div>
                      <p className="text-lg font-semibold text-gray-800">{contentIds.length}</p>
                      <p className="text-xs text-gray-500">items</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1">
                        <HardDrive className="w-4 h-4" />
                      </div>
                      <p className="text-lg font-semibold text-gray-800">{formatFileSize(pack.file_size)}</p>
                      <p className="text-xs text-gray-500">size</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1">
                        <Download className="w-4 h-4" />
                      </div>
                      <p className="text-lg font-semibold text-gray-800">{pack.download_count}</p>
                      <p className="text-xs text-gray-500">downloads</p>
                    </div>
                  </div>

                  {/* Content Preview */}
                  {contentIds.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Includes:</p>
                      <div className="flex flex-wrap gap-2">
                        {contentIds.slice(0, 3).map((contentId: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {contentId.includes('story') ? '📚' : contentId.includes('quiz') ? '🧠' : '🎵'} {contentId}
                          </span>
                        ))}
                        {contentIds.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            +{contentIds.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => !isDownloaded && !isDownloading && handleDownloadPack(pack.id)}
                    disabled={isDownloaded || isDownloading}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                      isDownloaded
                        ? 'bg-green-500 text-white cursor-default'
                        : isDownloading
                        ? 'bg-blue-500 text-white cursor-wait'
                        : 'bg-gradient-to-r from-gray-400 to-blue-500 hover:from-gray-500 hover:to-blue-600 text-white shadow-lg'
                    }`}
                  >
                    {isDownloaded ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Downloaded
                      </>
                    ) : isDownloading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Download Pack
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {offlinePacks.length === 0 && (
          <div className="text-center py-12">
            <Download className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No offline packs available</h3>
            <p className="text-gray-500">Check back later for new downloadable content</p>
          </div>
        )}
      </div>

      {/* Offline Tips */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">💡 Offline Tips</h3>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="text-3xl mb-2">📱</div>
              <h4 className="font-bold text-gray-800 mb-2">Download When Online</h4>
              <p className="text-sm text-gray-600">Download packs when you have good internet connection</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4">
              <div className="text-3xl mb-2">💾</div>
              <h4 className="font-bold text-gray-800 mb-2">Save Storage Space</h4>
              <p className="text-sm text-gray-600">Remove packs you no longer need to free up space</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-4">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-bold text-gray-800 mb-2">Perfect for Travel</h4>
              <p className="text-sm text-gray-600">Great for car rides, flights, or areas with poor internet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflinePacks;
