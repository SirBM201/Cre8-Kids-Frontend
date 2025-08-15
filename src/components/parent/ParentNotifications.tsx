import React, { useState } from 'react';
import { Bell, Check, X, Clock, AlertTriangle, Info, Star, Mail, Smartphone } from 'lucide-react';

const ParentNotifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const tabs = [
    { id: 'all', label: 'All', color: 'from-blue-400 to-blue-600' },
    { id: 'important', label: 'Important', color: 'from-red-400 to-red-600' },
    { id: 'learning', label: 'Learning', color: 'from-green-400 to-green-600' },
    { id: 'system', label: 'System', color: 'from-gray-400 to-gray-600' }
  ];

  // Mock notification data
  const notifications = [
    {
      id: '1',
      type: 'important',
      title: 'Weekly Learning Report Ready',
      message: 'Your child\'s weekly learning progress report is now available.',
      time: '2 hours ago',
      read: false,
      icon: '📊',
      category: 'learning'
    },
    {
      id: '2',
      type: 'learning',
      title: 'New Badge Earned! 🏆',
      message: 'Emma has earned the "Math Whiz" badge for completing 10 math quizzes.',
      time: '4 hours ago',
      read: false,
      icon: '🏆',
      category: 'learning'
    },
    {
      id: '3',
      type: 'system',
      title: 'App Update Available',
      message: 'A new version of Cre8 Kids is available with exciting new features.',
      time: '1 day ago',
      read: true,
      icon: '🔄',
      category: 'system'
    },
    {
      id: '4',
      type: 'important',
      title: 'Screen Time Limit Reached',
      message: 'Emma has reached her daily screen time limit of 2 hours.',
      time: '1 day ago',
      read: true,
      icon: '⏰',
      category: 'important'
    },
    {
      id: '5',
      type: 'learning',
      title: 'New Content Available',
      message: '5 new stories and 3 new quizzes have been added to the library.',
      time: '2 days ago',
      read: true,
      icon: '📚',
      category: 'learning'
    },
    {
      id: '6',
      type: 'system',
      title: 'Backup Completed',
      message: 'Your child\'s learning progress has been successfully backed up.',
      time: '3 days ago',
      read: true,
      icon: '💾',
      category: 'system'
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'important':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'learning':
        return <Star className="w-5 h-5 text-green-600" />;
      case 'system':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'important':
        return 'border-l-red-500 bg-red-50';
      case 'learning':
        return 'border-l-green-500 bg-green-50';
      case 'system':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab !== 'all' && notification.category !== activeTab) return false;
    if (showUnreadOnly && notification.read) return false;
    return true;
  });

  const markAsRead = (id: string) => {
    // Here you would typically update the backend
    console.log('Marking notification as read:', id);
  };

  const markAllAsRead = () => {
    // Here you would typically update the backend
    console.log('Marking all notifications as read');
  };

  const deleteNotification = (id: string) => {
    // Here you would typically update the backend
    console.log('Deleting notification:', id);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
          <p className="text-gray-600 mt-1">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={markAllAsRead}
            className="btn-secondary flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Mark All Read
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
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
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={(e) => setShowUnreadOnly(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium text-gray-700">Show unread only</span>
          </label>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No notifications</h3>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-2xl border-l-4 transition-all duration-200 hover:shadow-md ${
                notification.read ? 'bg-white' : getNotificationColor(notification.type)
              } ${getNotificationColor(notification.type)}`}
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl">{notification.icon}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notification.title}
                      </h4>
                      <p className={`text-sm mt-1 ${notification.read ? 'text-gray-500' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {notification.time}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          notification.category === 'learning' ? 'bg-green-100 text-green-800' :
                          notification.category === 'important' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {notification.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete notification"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Notification Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Delivery Methods</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-800">Email</p>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-800">Push Notifications</p>
                    <p className="text-sm text-gray-600">Get instant alerts on your device</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Notification Types</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800">Learning Progress</p>
                  <p className="text-sm text-gray-600">Weekly reports and achievements</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800">Screen Time Alerts</p>
                  <p className="text-sm text-gray-600">Daily limits and bedtime reminders</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800">System Updates</p>
                  <p className="text-sm text-gray-600">App updates and maintenance</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentNotifications;
