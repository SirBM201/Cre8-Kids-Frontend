import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Edit, Plus, Trash2, Settings, X, Save } from 'lucide-react';

const ParentProfiles: React.FC = () => {
  const { state, dispatch } = useApp();
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState<string | null>(null);
  
  const [newProfile, setNewProfile] = useState({
    name: '',
    age: 5,
    avatar: '👦',
    accessibility: {
      highContrast: false,
      largeText: false,
      dyslexiaFriendly: false
    }
  });

  const handleAddProfile = () => {
    if (newProfile.name.trim()) {
      const profile = {
        id: Date.now().toString(),
        name: newProfile.name,
        age: newProfile.age,
        avatar: newProfile.avatar,
        accessibility: newProfile.accessibility,
        createdAt: new Date().toISOString()
      };
      
      dispatch({ type: 'ADD_KID_PROFILE', payload: profile });
      setNewProfile({
        name: '',
        age: 5,
        avatar: '👦',
        accessibility: {
          highContrast: false,
          largeText: false,
          dyslexiaFriendly: false
        }
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteProfile = (id: string) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      dispatch({ type: 'DELETE_KID_PROFILE', payload: id });
    }
  };

  const handleUpdateProfile = (id: string, updates: Partial<typeof newProfile>) => {
    dispatch({ type: 'UPDATE_KID_PROFILE', payload: { id, updates } });
    setEditingProfile(null);
  };

  const handleProfileSettings = (profileId: string) => {
    setShowSettingsModal(profileId);
  };

  const avatars = ['👦', '👧', '🧒', '👶', '🐱', '🐶', '🐰', '🐻', '🦊', '🐸'];

  // Show loading state if state is not ready
  if (!state || !state.kidProfiles) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Child Profiles</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Profile
          </button>
        </div>
      </div>

      {/* Add Profile Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={newProfile.name}
                onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="Enter child's name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                min="3"
                max="12"
                value={newProfile.age}
                onChange={(e) => setNewProfile({ ...newProfile, age: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
              <div className="grid grid-cols-5 gap-2">
                {avatars.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setNewProfile({ ...newProfile, avatar })}
                    className={`w-12 h-12 text-2xl rounded-xl border-2 transition-colors ${
                      newProfile.avatar === avatar
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accessibility</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newProfile.accessibility.highContrast}
                    onChange={(e) => setNewProfile({
                      ...newProfile,
                      accessibility: { ...newProfile.accessibility, highContrast: e.target.checked }
                    })}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">High Contrast</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newProfile.accessibility.largeText}
                    onChange={(e) => setNewProfile({
                      ...newProfile,
                      accessibility: { ...newProfile.accessibility, largeText: e.target.checked }
                    })}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Large Text</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newProfile.accessibility.dyslexiaFriendly}
                    onChange={(e) => setNewProfile({
                      ...newProfile,
                      accessibility: { ...newProfile.accessibility, dyslexiaFriendly: e.target.checked }
                    })}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Dyslexia Friendly</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddProfile}
              className="btn-primary"
              disabled={!newProfile.name.trim()}
            >
              Add Profile
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Profiles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.kidProfiles.map((profile) => (
          <div key={profile.id} className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">{profile.avatar || '👦'}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingProfile(editingProfile === profile.id ? null : profile.id)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteProfile(profile.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {editingProfile === profile.id ? (
              <ProfileEditForm
                profile={profile}
                onSave={handleUpdateProfile}
                onCancel={() => setEditingProfile(null)}
              />
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{profile.name}</h3>
                <p className="text-gray-600 mb-3">Age: {profile.age}</p>
                
                {Object.values(profile.accessibility).some(Boolean) && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Accessibility:</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.accessibility.highContrast && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">High Contrast</span>
                      )}
                      {profile.accessibility.largeText && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Large Text</span>
                      )}
                      {profile.accessibility.dyslexiaFriendly && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Dyslexia Friendly</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleProfileSettings(profile.id)}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                    {profile.settings && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Profile Settings Modal */}
      {showSettingsModal && (
        <ProfileSettingsModal
          profile={state.kidProfiles.find(p => p.id === showSettingsModal)!}
          onClose={() => setShowSettingsModal(null)}
          onSave={(settings) => {
            dispatch({ 
              type: 'UPDATE_KID_PROFILE_SETTINGS', 
              payload: { id: showSettingsModal, settings } 
            });
            setShowSettingsModal(null);
          }}
        />
      )}

      {(!state.kidProfiles || state.kidProfiles.length === 0) && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No profiles yet</h3>
          <p className="text-gray-500 mb-4">Create your first child profile to get started</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            Add First Profile
          </button>
        </div>
      )}
    </div>
  );
};

const ProfileEditForm: React.FC<{
  profile: any;
  onSave: (id: string, updates: any) => void;
  onCancel: () => void;
}> = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: profile.name,
    age: profile.age,
    avatar: profile.avatar || '👦',
    accessibility: { ...profile.accessibility }
  });

  const avatars = ['👦', '👧', '🧒', '👶', '🐱', '🐶', '🐰', '🐻', '🦊', '🐸'];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
        <input
          type="number"
          min="3"
          max="12"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
        <div className="grid grid-cols-5 gap-2">
          {avatars.map((avatar) => (
            <button
              key={avatar}
              onClick={() => setFormData({ ...formData, avatar })}
              className={`w-10 h-10 text-xl rounded-lg border-2 transition-colors ${
                formData.avatar === avatar
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {avatar}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSave(profile.id, formData)}
          className="btn-primary flex-1"
          disabled={!formData.name.trim()}
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="btn-secondary flex-1"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const ProfileSettingsModal: React.FC<{
  profile: any;
  onClose: () => void;
  onSave: (updates: any) => void;
}> = ({ profile, onClose, onSave }) => {
  const [settings, setSettings] = useState({
    learningGoals: {
      dailyMinutes: 15,
      weeklyTarget: 5,
      focusAreas: ['reading', 'math', 'creativity']
    },
    restrictions: {
      maxScreenTime: 60,
      bedtime: '20:00',
      contentFilter: 'age-appropriate'
    },
    notifications: {
      progressUpdates: true,
      achievementAlerts: true,
      weeklyReports: true
    }
  });

  const handleSave = () => {
    onSave(settings);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Settings for {profile.name}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Learning Goals */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Learning Goals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Learning Minutes</label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={settings.learningGoals.dailyMinutes}
                  onChange={(e) => setSettings({
                    ...settings,
                    learningGoals: {
                      ...settings.learningGoals,
                      dailyMinutes: parseInt(e.target.value)
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Target</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={settings.learningGoals.weeklyTarget}
                  onChange={(e) => setSettings({
                    ...settings,
                    learningGoals: {
                      ...settings.learningGoals,
                      weeklyTarget: parseInt(e.target.value)
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Focus Areas</label>
              <div className="flex flex-wrap gap-2">
                {['reading', 'math', 'creativity', 'science', 'social'].map((area) => (
                  <label key={area} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.learningGoals.focusAreas.includes(area)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSettings({
                            ...settings,
                            learningGoals: {
                              ...settings.learningGoals,
                              focusAreas: [...settings.learningGoals.focusAreas, area]
                            }
                          });
                        } else {
                          setSettings({
                            ...settings,
                            learningGoals: {
                              ...settings.learningGoals,
                              focusAreas: settings.learningGoals.focusAreas.filter(a => a !== area)
                            }
                          });
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700 capitalize">{area}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Restrictions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Restrictions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Screen Time (minutes)</label>
                <input
                  type="number"
                  min="15"
                  max="180"
                  value={settings.restrictions.maxScreenTime}
                  onChange={(e) => setSettings({
                    ...settings,
                    restrictions: {
                      ...settings.restrictions,
                      maxScreenTime: parseInt(e.target.value)
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedtime</label>
                <input
                  type="time"
                  value={settings.restrictions.bedtime}
                  onChange={(e) => setSettings({
                    ...settings,
                    restrictions: {
                      ...settings.restrictions,
                      bedtime: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Filter</label>
              <select
                value={settings.restrictions.contentFilter}
                onChange={(e) => setSettings({
                  ...settings,
                  restrictions: {
                    ...settings.restrictions,
                    contentFilter: e.target.value
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="age-appropriate">Age Appropriate</option>
                <option value="strict">Strict</option>
                <option value="moderate">Moderate</option>
                <option value="relaxed">Relaxed</option>
              </select>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.notifications.progressUpdates}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      progressUpdates: e.target.checked
                    }
                  })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Progress Updates</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.notifications.achievementAlerts}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      achievementAlerts: e.target.checked
                    }
                  })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Achievement Alerts</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.notifications.weeklyReports}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      weeklyReports: e.target.checked
                    }
                  })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Weekly Reports</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={handleSave}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentProfiles;
