const API_BASE_URL = 'http://localhost:5000/api';

// Types for API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: 'parent' | 'educator';
  };
}

interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    role: 'parent' | 'educator';
  };
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Authentication API
export const authAPI = {
  async register(email: string, password: string, role: 'parent' | 'educator'): Promise<ApiResponse<RegisterResponse>> {
    return apiRequest<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  },

  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const response = await apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
    }

    return response;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('authToken');
    await apiRequest('/auth/logout', { method: 'POST' });
  },

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await apiRequest<{ token: string }>('/auth/refresh', {
      method: 'POST',
    });

    if (response.success && response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
    }

    return response;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  async resendVerification(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },
};

// User Management API
export const userAPI = {
  async getProfile(): Promise<ApiResponse<any>> {
    return apiRequest('/users/profile');
  },

  async createKidProfile(profile: Omit<any, 'id'>): Promise<ApiResponse<any>> {
    return apiRequest('/users/kid-profiles', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  },

  async updateKidProfile(id: string, profile: Partial<any>): Promise<ApiResponse<any>> {
    return apiRequest(`/users/kid-profiles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  },

  async deleteKidProfile(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiRequest(`/users/kid-profiles/${id}`, {
      method: 'DELETE',
    });
  },

  async getKidProfiles(): Promise<ApiResponse<any[]>> {
    return apiRequest('/users/kid-profiles');
  },

  async updateParentSettings(settings: Partial<any>): Promise<ApiResponse<any>> {
    return apiRequest('/users/parent-settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  async getParentSettings(): Promise<ApiResponse<any>> {
    return apiRequest('/users/parent-settings');
  },
};

// Content API
export const contentAPI = {
  async getStories(): Promise<ApiResponse<any[]>> {
    return apiRequest('/content/stories');
  },

  async getQuizzes(): Promise<ApiResponse<any[]>> {
    return apiRequest('/content/quizzes');
  },

  async getSongs(): Promise<ApiResponse<any[]>> {
    return apiRequest('/content/songs');
  },

  async getCalmCorner(): Promise<ApiResponse<any[]>> {
    return apiRequest('/content/calm-corner');
  },

  async getCoPlayCards(): Promise<ApiResponse<any[]>> {
    return apiRequest('/content/co-play');
  },

  async getOfflinePacks(): Promise<ApiResponse<any[]>> {
    return apiRequest('/content/offline-packs');
  },

  async getBadges(): Promise<ApiResponse<any[]>> {
    return apiRequest('/content/badges');
  },
};

// Progress API
export const progressAPI = {
  async getDailyProgress(childId: string, date: string): Promise<ApiResponse<any>> {
    return apiRequest(`/progress/daily/${childId}/${date}`);
  },

  async updateLearningMinutes(childId: string, minutes: number): Promise<ApiResponse<any>> {
    return apiRequest('/progress/learning-minutes', {
      method: 'POST',
      body: JSON.stringify({ childId, minutes }),
    });
  },

  async submitQuizResult(childId: string, quizId: string, score: number): Promise<ApiResponse<any>> {
    return apiRequest('/progress/quiz-result', {
      method: 'POST',
      body: JSON.stringify({ childId, quizId, score }),
    });
  },

  async getStreaks(childId: string): Promise<ApiResponse<any>> {
    return apiRequest(`/progress/streaks/${childId}`);
  },

  async getEarnedBadges(childId: string): Promise<ApiResponse<any[]>> {
    return apiRequest(`/progress/badges/${childId}`);
  },
};

// Assignment API
export const assignmentAPI = {
  async getAssignments(): Promise<ApiResponse<any[]>> {
    return apiRequest('/assignments');
  },

  async createAssignment(assignment: Omit<any, 'id'>): Promise<ApiResponse<any>> {
    return apiRequest('/assignments', {
      method: 'POST',
      body: JSON.stringify(assignment),
    });
  },

  async submitAssignment(assignmentId: string): Promise<ApiResponse<any>> {
    return apiRequest(`/assignments/${assignmentId}/submit`, {
      method: 'POST',
    });
  },
};

// Upload API
export const uploadAPI = {
  async uploadFile(file: File, type: 'story' | 'song' | 'quiz' | 'avatar'): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('Upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  },
};

// Utility function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('authToken');
};

// Utility function to get auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Utility function to clear auth data
export const clearAuthData = (): void => {
  localStorage.removeItem('authToken');
};
