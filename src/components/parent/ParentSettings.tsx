import React, { useState } from 'react';
import { Settings, User, Shield, Bell, Globe, Moon, Sun, Lock, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ParentSettings: React.FC = () => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('account');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    { id: 'account', label: 'Account', icon: User, color: 'from-blue-400 to-blue-600' },
    { id: 'privacy', label: 'Privacy', icon: Shield, color: 'from-green-400 to-green-600' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'from-purple-400 to-purple-600' },
    { id: 'appearance', label: 'Appearance', icon: Globe, color: 'from-orange-400 to-orange-600' }
  ];

  const [settings, setSettings] = useState({
    account: {
      displayName: 'Demo User',
      email: 'demo@cre8kids.com',
      language: 'en',
      timezone: 'UTC+1'
    },
    privacy: {
      dataCollection: true,
      analytics: false,
      marketing: false,
      locationSharing: false
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      weeklyReport: true,
      activityAlerts: true,
      securityAlerts: true
    },
    appearance: {
      theme: 'light',
      fontSize: 'medium',
      highContrast: false,
      reducedMotion: false
    }
  });

  const handleSave = () => {
    // Here you would typically save to backend
    dispatch({ type: 'UPDATE_PARENT_SETTINGS', payload: settings });
    setIsEditing(false);
  };

  const handleReset = () => {
    // Reset to default values
    setSettings({
      account: {
        displayName: 'Demo User',
        email: 'demo@cre8kids.com',
        language: 'en',
        timezone: 'UTC+1'
      },
      privacy: {
        dataCollection: true,
        analytics: false,
        marketing: false,
        locationSharing: false
      },
      notifications: {
        email: true,
        push: true,
        sms: false,
        weeklyReport: true,
        activityAlerts: true,
        securityAlerts: true
      },
      appearance: {
        theme: 'light',
        fontSize: 'medium',
        highContrast: false,
        reducedMotion: false
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <div className="flex gap-3">
          {isEditing && (
            <button
              onClick={handleReset}
              className="btn-secondary"
            >
              Reset
            </button>
          )}
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            {isEditing ? 'Save Changes' : 'Edit Settings'}
          </button>
        </div>
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
        {activeTab === 'account' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Account Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                <input
                  type="text"
                  value={settings.account.displayName}
                  onChange={(e) => setSettings({
                    ...settings,
                    account: { ...settings.account, displayName: e.target.value }
                  })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={settings.account.email}
                  onChange={(e) => setSettings({
                    ...settings,
                    account: { ...settings.account, email: e.target.value }
                  })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={settings.account.language}
                  onChange={(e) => setSettings({
                    ...settings,
                    account: { ...settings.account, language: e.target.value }
                  })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
                >
                  <option value="en">English</option>
                  <option value="yo">Yoruba</option>
                  <option value="ha">Hausa</option>
                  <option value="ig">Igbo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select
                  value={settings.account.timezone}
                  onChange={(e) => setSettings({
                    ...settings,
                    account: { ...settings.account, timezone: e.target.value }
                  })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
                >
                  <option value="UTC+1">UTC+1 (West Africa)</option>
                  <option value="UTC+0">UTC+0 (GMT)</option>
                  <option value="UTC-5">UTC-5 (Eastern US)</option>
                  <option value="UTC+5:30">UTC+5:30 (India)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Privacy & Data</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-800">Data Collection</h4>
                  <p className="text-sm text-gray-600">Allow us to collect usage data to improve the app</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.privacy.dataCollection}
                    onChange={(e) => setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, dataCollection: e.target.checked }
                    })}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-800">Analytics</h4>
                  <p className="text-sm text-gray-600">Help us understand how the app is used</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.privacy.analytics}
                    onChange={(e) => setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, analytics: e.target.checked }
                    })}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-800">Marketing Communications</h4>
                  <p className="text-sm text-gray-600">Receive updates about new features and content</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.privacy.marketing}
                    onChange={(e) => setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, marketing: e.target.checked }
                    })}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-800">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive important updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, email: e.target.checked }
                    })}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-800">Push Notifications</h4>
                  <p className="text-sm text-gray-600">Get instant alerts on your device</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, push: e.target.checked }
                    })}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-800">Weekly Reports</h4>
                  <p className="text-sm text-gray-600">Receive weekly learning progress summaries</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.weeklyReport}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, weeklyReport: e.target.checked }
                    })}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Appearance & Accessibility</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSettings({
                      ...settings,
                      appearance: { ...settings.appearance, theme: 'light' }
                    })}
                    disabled={!isEditing}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-colors ${
                      settings.appearance.theme === 'light'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    Light
                  </button>
                  <button
                    onClick={() => setSettings({
                      ...settings,
                      appearance: { ...settings.appearance, theme: 'dark' }
                    })}
                    disabled={!isEditing}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-colors ${
                      settings.appearance.theme === 'dark'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    Dark
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                <select
                  value={settings.appearance.fontSize}
                  onChange={(e) => setSettings({
                    ...settings,
                    appearance: { ...settings.appearance, fontSize: e.target.value }
                  })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="extra-large">Extra Large</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-800">High Contrast</h4>
                  <p className="text-sm text-gray-600">Increase contrast for better visibility</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.appearance.highContrast}
                    onChange={(e) => setSettings({
                      ...settings,
                      appearance: { ...settings.appearance, highContrast: e.target.checked }
                    })}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-800">Reduced Motion</h4>
                  <p className="text-sm text-gray-600">Minimize animations and transitions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.appearance.reducedMotion}
                    onChange={(e) => setSettings({
                      ...settings,
                      appearance: { ...settings.appearance, reducedMotion: e.target.checked }
                    })}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentSettings;
