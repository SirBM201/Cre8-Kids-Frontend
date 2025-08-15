import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, isAuthenticated, clearAuthData } from '../services/api';

interface User {
  id: string;
  email: string;
  role: 'parent' | 'educator';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, role: 'parent' | 'educator') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // TEMPORARILY BYPASS AUTHENTICATION FOR TESTING
        // Set demo user automatically
        setUser({
          id: 'demo-user-123',
          email: 'demo@cre8kids.com',
          role: 'parent' as const,
          displayName: 'Demo User'
        });
        setIsLoading(false);
        return;
        
        // Original authentication logic (commented out)
        /*
        if (isAuthenticated()) {
          // Try to get user profile to validate token
          const response = await authAPI.refreshToken();
          if (response.success && response.data?.token) {
            // Token is valid, try to get user profile
            // For now, we'll assume the user is authenticated if token refresh works
            // In a real app, you'd decode the JWT to get user info
            setUser({
              id: 'user-1', // This would come from JWT decode
              email: 'user@example.com', // This would come from JWT decode
              role: 'parent' as const, // This would come from JWT decode
            });
          } else {
            // Token is invalid, clear auth data
            clearAuthData();
            setUser(null);
          }
        }
        */
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuthData();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(email, password);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, role: 'parent' | 'educator') => {
    try {
      setIsLoading(true);
      const response = await authAPI.register(email, password, role);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
    // You might want to call the logout API endpoint here
    authAPI.logout().catch(console.error);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.changePassword(currentPassword, newPassword);
      
      if (response.success) {
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Password change failed' };
      }
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error: 'Password change failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
