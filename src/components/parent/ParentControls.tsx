import React, { useState } from 'react';
import { Clock, Shield, Eye, Lock, Settings } from 'lucide-react';

const ParentControls: React.FC = () => {
  const [activeTab, setActiveTab] = useState('screen-time');
  const [isEditing, setIsEditing] = useState(false);

  const tabs = [
    { id: 'screen-time', label: 'Screen Time', icon: Clock, color: 'from-blue-400 to-blue-600' },
    { id: 'content-filter', label: 'Content Filter', icon: Shield, color: 'from-green-400 to-green-600' },
    { id: 'safety', label: 'Safety', icon: Lock, color: 'from-purple-400 to-purple-600' },
    { id: 'advanced', label: 'Advanced', icon: Settings, color: 'from-orange-400 to-orange-600' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Parent Controls</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn-primary flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          {isEditing ? 'Save Changes' : 'Edit Settings'}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        {activeTab === 'screen-time' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Screen Time Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Limit (minutes)</label>
                <input
                  type="number"
                  min="15"
                  max="240"
                  defaultValue="60"
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedtime</label>
                <input
                  type="time"
                  defaultValue="20:00"
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Wake Time</label>
                <input
                  type="time"
                  defaultValue="07:00"
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'content-filter' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Content Filtering</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Rating Filter</label>
                <select
                  defaultValue="3-8"
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
                >
                  <option value="3-5">3-5 years</option>
                  <option value="3-8">3-8 years</option>
                  <option value="6-12">6-12 years</option>
                  <option value="all">All ages</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Categories</label>
                <div className="space-y-2">
                  {['Stories', 'Quizzes', 'Songs', 'Games', 'Videos'].map((category) => (
                    <label key={category} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked
                        disabled={!isEditing}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language Filter</label>
                <select
                  defaultValue="en"
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
                >
                  <option value="en">English</option>
                  <option value="yo">Yoruba</option>
                  <option value="ha">Hausa</option>
                  <option value="ig">Igbo</option>
                  <option value="all">All languages</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Educational Level</label>
                <select
                  defaultValue="beginner"
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'safety' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Safety & Privacy</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-800">Safe Search</h4>
                  <p className="text-sm text-gray-600">Filter out inappropriate content</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-800">Location Privacy</h4>
                  <p className="text-sm text-gray-600">Prevent location sharing</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-800">Data Collection</h4>
                  <p className="text-sm text-gray-600">Limit data collection for analytics</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Advanced Controls</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">App Lock PIN</label>
                <input
                  type="password"
                  defaultValue="1234"
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
                  placeholder="Enter 4-digit PIN"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auto-Logout (minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  defaultValue="15"
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                <select
                  defaultValue="daily"
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sync Settings</label>
                <div className="space-y-2">
                  {['Progress Data', 'Settings', 'Profiles', 'Downloads'].map((item) => (
                    <label key={item} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked
                        disabled={!isEditing}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentControls;
