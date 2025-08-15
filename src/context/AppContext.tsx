import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AppState, KidProfile, Progress, Badge } from '../types';
import { 
  seedStories, 
  seedQuizzes, 
  seedSongs, 
  seedCalmCorner, 
  seedCoPlay, 
  seedOfflinePacks,
  seedBadges,
  defaultParentSettings,
  defaultKidProfile
} from '../data/seedData';
import { userAPI, contentAPI, progressAPI, assignmentAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface AppAction {
  type: string;
  payload?: any;
}

const initialState: AppState = {
  currentMode: 'kid',
  currentChildId: undefined,
  parentSettings: defaultParentSettings,
  kidProfiles: [
    {
      ...defaultKidProfile,
      id: 'child-1'
    }
  ],
  progress: {},
  offlinePacks: seedOfflinePacks,
  assignments: [],
  focusBeforeFun: {
    dailyMinutesCompleted: 0,
    funUnlockedUntil: undefined
  }
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, currentMode: action.payload };
    
    case 'SET_CURRENT_CHILD':
      return { ...state, currentChildId: action.payload };
    
    case 'UPDATE_PARENT_SETTINGS':
      return { 
        ...state, 
        parentSettings: { ...state.parentSettings, ...action.payload }
      };
    
    case 'SET_KID_PROFILES':
      return {
        ...state,
        kidProfiles: action.payload
      };
    
    case 'ADD_KID_PROFILE':
      return {
        ...state,
        kidProfiles: [...state.kidProfiles, action.payload]
      };
    
    case 'UPDATE_KID_PROFILE':
      return {
        ...state,
        kidProfiles: state.kidProfiles.map(kid =>
          kid.id === action.payload.id ? { ...kid, ...action.payload.updates } : kid
        )
      };
    
    case 'UPDATE_KID_PROFILE_SETTINGS':
      return {
        ...state,
        kidProfiles: state.kidProfiles.map(kid =>
          kid.id === action.payload.id ? { ...kid, settings: action.payload.settings } : kid
        )
      };
    
    case 'DELETE_KID_PROFILE':
      return {
        ...state,
        kidProfiles: state.kidProfiles.filter(kid => kid.id !== action.payload)
      };
    
    case 'SET_PROGRESS':
      return {
        ...state,
        progress: action.payload
      };
    
    case 'ADD_LEARNING_MINUTES':
      const currentDate = new Date().toISOString().split('T')[0];
      const currentProgress = state.progress[currentDate] || {
        childId: state.currentChildId!,
        date: currentDate,
        learningMinutes: 0,
        completedItems: [],
        quizScores: {},
        streakCount: 0,
        badgesEarned: []
      };
      
      return {
        ...state,
        progress: {
          ...state.progress,
          [currentDate]: {
            ...currentProgress,
            learningMinutes: currentProgress.learningMinutes + action.payload
          }
        }
      };
    
    case 'COMPLETE_ITEM':
      const today = new Date().toISOString().split('T')[0];
      const todayProgress = state.progress[today] || {
        childId: state.currentChildId!,
        date: today,
        learningMinutes: 0,
        completedItems: [],
        quizScores: {},
        streakCount: 0,
        badgesEarned: []
      };
      
      return {
        ...state,
        progress: {
          ...state.progress,
          [today]: {
            ...todayProgress,
            completedItems: [...todayProgress.completedItems, action.payload.id]
          }
        }
      };
    
    case 'SET_OFFLINE_PACKS':
      return {
        ...state,
        offlinePacks: action.payload
      };
    
    case 'SET_ASSIGNMENTS':
      return {
        ...state,
        assignments: action.payload
      };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  syncWithBackend: () => Promise<void>;
  createKidProfile: (profile: Omit<KidProfile, 'id'>) => Promise<{ success: boolean; error?: string }>;
  updateKidProfile: (id: string, profile: Partial<KidProfile>) => Promise<{ success: boolean; error?: string }>;
  deleteKidProfile: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateParentSettings: (settings: Partial<AppState['parentSettings']>) => Promise<{ success: boolean; error?: string }>;
  submitProgress: (childId: string, minutes: number) => Promise<{ success: boolean; error?: string }>;
  submitQuizResult: (childId: string, quizId: string, score: number) => Promise<{ success: boolean; error?: string }>;
} | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Sync data with backend
  const syncWithBackend = async () => {
    if (!isAuthenticated) return;

    try {
      // Fetch kid profiles
      const kidProfilesResponse = await userAPI.getKidProfiles();
      if (kidProfilesResponse.success && kidProfilesResponse.data) {
        dispatch({ type: 'SET_KID_PROFILES', payload: kidProfilesResponse.data });
      }

      // Fetch parent settings
      const settingsResponse = await userAPI.getParentSettings();
      if (settingsResponse.success && settingsResponse.data) {
        dispatch({ type: 'UPDATE_PARENT_SETTINGS', payload: settingsResponse.data });
      }

      // Fetch offline packs
      const offlinePacksResponse = await contentAPI.getOfflinePacks();
      if (offlinePacksResponse.success && offlinePacksResponse.data) {
        dispatch({ type: 'SET_OFFLINE_PACKS', payload: offlinePacksResponse.data });
      }

      // Fetch assignments
      const assignmentsResponse = await assignmentAPI.getAssignments();
      if (assignmentsResponse.success && assignmentsResponse.data) {
        dispatch({ type: 'SET_ASSIGNMENTS', payload: assignmentsResponse.data });
      }
    } catch (error) {
      console.error('Failed to sync with backend:', error);
    }
  };

  // Create kid profile
  const createKidProfile = async (profile: Omit<KidProfile, 'id'>) => {
    try {
      const response = await userAPI.createKidProfile(profile);
      if (response.success && response.data) {
        dispatch({ type: 'ADD_KID_PROFILE', payload: response.data });
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Failed to create profile' };
      }
    } catch (error) {
      console.error('Create kid profile failed:', error);
      return { success: false, error: 'Failed to create profile' };
    }
  };

  // Update kid profile
  const updateKidProfile = async (id: string, profile: Partial<KidProfile>) => {
    try {
      const response = await userAPI.updateKidProfile(id, profile);
      if (response.success && response.data) {
        dispatch({ type: 'UPDATE_KID_PROFILE', payload: { id, updates: profile } });
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Failed to update profile' };
      }
    } catch (error) {
      console.error('Update kid profile failed:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  };

  // Delete kid profile
  const deleteKidProfile = async (id: string) => {
    try {
      const response = await userAPI.deleteKidProfile(id);
      if (response.success) {
        dispatch({ type: 'DELETE_KID_PROFILE', payload: id });
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Failed to delete profile' };
      }
    } catch (error) {
      console.error('Delete kid profile failed:', error);
      return { success: false, error: 'Failed to delete profile' };
    }
  };

  // Update parent settings
  const updateParentSettings = async (settings: Partial<AppState['parentSettings']>) => {
    try {
      const response = await userAPI.updateParentSettings(settings);
      if (response.success && response.data) {
        dispatch({ type: 'UPDATE_PARENT_SETTINGS', payload: settings });
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Failed to update settings' };
      }
    } catch (error) {
      console.error('Update parent settings failed:', error);
      return { success: false, error: 'Failed to update settings' };
    }
  };

  // Submit progress
  const submitProgress = async (childId: string, minutes: number) => {
    try {
      const response = await progressAPI.updateLearningMinutes(childId, minutes);
      if (response.success) {
        dispatch({ type: 'ADD_LEARNING_MINUTES', payload: minutes });
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Failed to submit progress' };
      }
    } catch (error) {
      console.error('Submit progress failed:', error);
      return { success: false, error: 'Failed to submit progress' };
    }
  };

  // Submit quiz result
  const submitQuizResult = async (childId: string, quizId: string, score: number) => {
    try {
      const response = await progressAPI.submitQuizResult(childId, quizId, score);
      if (response.success) {
        dispatch({ type: 'COMPLETE_ITEM', payload: { id: quizId, type: 'quiz' } });
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Failed to submit quiz result' };
      }
    } catch (error) {
      console.error('Submit quiz result failed:', error);
      return { success: false, error: 'Failed to submit quiz result' };
    }
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('cre8kids-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Dispatch actions to properly update state
        if (parsed.kidProfiles && Array.isArray(parsed.kidProfiles)) {
          dispatch({ type: 'SET_KID_PROFILES', payload: parsed.kidProfiles });
        }
        if (parsed.parentSettings) {
          dispatch({ type: 'UPDATE_PARENT_SETTINGS', payload: parsed.parentSettings });
        }
        if (parsed.progress) {
          dispatch({ type: 'SET_PROGRESS', payload: parsed.progress });
        }
        if (parsed.offlinePacks && Array.isArray(parsed.offlinePacks)) {
          dispatch({ type: 'SET_OFFLINE_PACKS', payload: parsed.offlinePacks });
        }
        if (parsed.assignments && Array.isArray(parsed.assignments)) {
          dispatch({ type: 'SET_ASSIGNMENTS', payload: parsed.assignments });
        }
      } catch (error) {
        console.log('Could not load saved state, using defaults');
      }
    } else {
      console.log('No saved state found, using defaults');
    }
  }, [dispatch]);

  // Sync with backend when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      syncWithBackend();
    }
  }, [isAuthenticated]);

  // Save state to localStorage on changes
  useEffect(() => {
    localStorage.setItem('cre8kids-state', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ 
      state, 
      dispatch, 
      syncWithBackend,
      createKidProfile,
      updateKidProfile,
      deleteKidProfile,
      updateParentSettings,
      submitProgress,
      submitQuizResult
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
