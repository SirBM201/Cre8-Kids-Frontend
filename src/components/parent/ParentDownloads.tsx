import React, { useState } from 'react';
import { Download, Trash2, CheckCircle, Clock, HardDrive, Wifi, WifiOff } from 'lucide-react';

const ParentDownloads: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const categories = [
    { id: 'all', label: 'All Categories', color: 'from-blue-400 to-blue-600' },
    { id: 'stories', label: 'Stories', color: 'from-purple-400 to-purple-600' },
    { id: 'songs', label: 'Songs', color: 'from-green-400 to-green-600' },
    { id: 'quizzes', label: 'Quizzes', color: 'from-yellow-400 to-yellow-600' },
    { id: 'offline-packs', label: 'Offline Packs', color: 'from-orange-400 to-orange-600' }
  ];

  const sortOptions = [
    { id: 'recent', label: 'Most Recent' },
    { id: 'size', label: 'Size' },
    { id: 'name', label: 'Name' },
    { id: 'category', label: 'Category' }
  ];

  // Mock data for downloads
  const downloads = [
    {
      id: '1',
      name: 'Story Collection Pack 1',
      category: 'stories',
      size: '45 MB',
      status: 'downloaded',
      date: '2024-01-15',
      icon: '📚',
      description: 'Collection of 10 educational stories for ages 3-8'
    },
    {
      id: '2',
      name: 'Nursery Rhymes Pack',
      category: 'songs',
      size: '32 MB',
      status: 'downloading',
      date: '2024-01-14',
      icon: '🎵',
      description: 'Classic nursery rhymes and children songs',
      progress: 65
    },
    {
      id: '3',
      name: 'Math Quiz Pack',
      category: 'quizzes',
      size: '28 MB',
      status: 'queued',
      date: '2024-01-13',
      icon: '🧮',
      description: 'Interactive math quizzes for different age groups'
    },
    {
      id: '4',
      name: 'Offline Adventure Pack',
      category: 'offline-packs',
      size: '156 MB',
      status: 'downloaded',
      date: '2024-01-12',
      icon: '🎒',
      description: 'Complete offline learning experience'
    }
  ];

  const filteredDownloads = selectedCategory === 'all' 
    ? downloads 
    : downloads.filter(item => item.category === selectedCategory);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'downloaded':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'downloading':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'queued':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'downloaded':
        return 'Downloaded';
      case 'downloading':
        return 'Downloading...';
      case 'queued':
        return 'Queued';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'downloaded':
        return 'text-green-600 bg-green-50';
      case 'downloading':
        return 'text-blue-600 bg-blue-50';
      case 'queued':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Downloads & Offline Content</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HardDrive className="w-4 h-4" />
            <span>2.1 GB used</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Wifi className="w-4 h-4" />
            <span>WiFi Only</span>
          </div>
        </div>
      </div>

      {/* Storage Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Storage Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Download className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">2.1 GB</p>
            <p className="text-sm text-gray-600">Used</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">12</p>
            <p className="text-sm text-gray-600">Downloaded</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">3</p>
            <p className="text-sm text-gray-600">Queued</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <WifiOff className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">8.9 GB</p>
            <p className="text-sm text-gray-600">Available</p>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 ${
                selectedCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                  : 'bg-white text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="md:ml-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
          >
            {sortOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Downloads List */}
      <div className="space-y-4">
        {filteredDownloads.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-start gap-4">
              <div className="text-4xl">{item.icon}</div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                    <span className="text-sm text-gray-500">{item.size}</span>
                  </div>
                </div>

                {/* Progress Bar for Downloading Items */}
                {item.status === 'downloading' && item.progress && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Downloading...</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Category: {item.category}</span>
                    <span>Date: {item.date}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {item.status === 'downloaded' && (
                      <>
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {item.status === 'downloading' && (
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    {item.status === 'queued' && (
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDownloads.length === 0 && (
        <div className="text-center py-12">
          <Download className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No downloads found</h3>
          <p className="text-gray-500">Try selecting a different category or start downloading content</p>
        </div>
      )}

      {/* Download Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Download Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-3 mb-3">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm font-medium text-gray-700">Download over WiFi only</span>
            </label>
            <label className="flex items-center gap-3 mb-3">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm font-medium text-gray-700">Auto-download updates</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded" />
              <span className="text-sm font-medium text-gray-700">Download in background</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auto-cleanup old downloads
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none">
              <option>Never</option>
              <option>After 30 days</option>
              <option>After 60 days</option>
              <option>After 90 days</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDownloads;
