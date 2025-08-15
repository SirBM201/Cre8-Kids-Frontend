export interface KidProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    dyslexiaFriendly: boolean;
  };
  createdAt?: string;
  settings?: {
    learningGoals: {
      dailyMinutes: number;
      weeklyTarget: number;
      focusAreas: string[];
    };
    restrictions: {
      maxScreenTime: number;
      bedtime: string;
      contentFilter: string;
    };
    notifications: {
      progressUpdates: boolean;
      achievementAlerts: boolean;
      weeklyReports: boolean;
    };
  };
}

export interface ParentSettings {
  pin: string;
  language: 'en' | 'yo' | 'ha' | 'ig';
  focusBeforeFun: {
    dailyLearningMinutes: number;
    funUnlockMinutes: number;
  };
  bedtimeLock: {
    startHour: number;
    endHour: number;
  };
  whitelistCategories: string[];
}

export interface ContentItem {
  id: string;
  type: 'story' | 'song' | 'quiz';
  title: string;
  ageBand: '3-5' | '6-8' | '9-12';
  tags: string[];
  safetyRating: 'G';
}

export interface Story extends ContentItem {
  type: 'story';
  pages: StoryPage[];
  estimatedMinutes: number;
}

export interface StoryPage {
  id: string;
  text: string;
  imageUrl?: string;
}

export interface Song extends ContentItem {
  type: 'song';
  audioUrl: string;
  duration: number;
  lyrics?: string;
}

export interface Quiz extends ContentItem {
  type: 'quiz';
  questions: QuizQuestion[];
  estimatedMinutes: number;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
}

export interface Progress {
  childId: string;
  date: string;
  learningMinutes: number;
  completedItems: string[];
  quizScores: Record<string, number>;
  streakCount: number;
  badgesEarned: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface Assignment {
  id: string;
  contentRef: string;
  classCode: string;
  assignedDate: string;
  submittedCount: number;
}

export interface OfflinePack {
  id: string;
  name: string;
  includedItems: string[];
  status: 'available' | 'downloaded' | 'removing';
  size: string;
}

export interface CoPlayCard {
  id: string;
  title: string;
  description: string;
  steps: string[];
  estimatedMinutes: number;
  ageBand: '3-5' | '6-8' | '9-12';
}

export interface CalmCornerItem {
  id: string;
  title: string;
  type: 'audio' | 'story';
  content: string;
  duration: number;
  ageBand: '3-5' | '6-8' | '9-12';
}

export interface AppState {
  currentMode: 'kid' | 'parent' | 'educator';
  currentChildId?: string;
  parentSettings: ParentSettings;
  kidProfiles: KidProfile[];
  progress: Record<string, Progress>;
  offlinePacks: OfflinePack[];
  assignments: Assignment[];
  focusBeforeFun: {
    dailyMinutesCompleted: number;
    funUnlockedUntil?: string;
  };
}
