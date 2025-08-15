import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Shield, 
  BarChart3, 
  Download, 
  LogOut,
  Settings,
  Bell
} from 'lucide-react';

const ParentSidebar: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/parent', icon: Home, label: 'Dashboard', color: 'from-blue-400 to-blue-600' },
    { path: '/parent/profiles', icon: Users, label: 'Profiles', color: 'from-green-400 to-green-600' },
    { path: '/parent/controls', icon: Shield, label: 'Controls', color: 'from-purple-400 to-purple-600' },
    { path: '/parent/reports', icon: BarChart3, label: 'Reports', color: 'from-orange-400 to-orange-600' },
    { path: '/parent/downloads', icon: Download, label: 'Downloads', color: 'from-indigo-400 to-indigo-600' }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-40">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Parent Portal</h1>
            <p className="text-sm text-gray-600">Safe & Secure</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                isActive
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <IconComponent className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button 
            onClick={() => navigate('/parent/settings')}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button 
            onClick={() => navigate('/parent/notifications')}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
          >
            <Bell className="w-4 h-4" />
            Notifications
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ParentSidebar;
