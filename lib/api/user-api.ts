import { apiClient, ApiResponse } from './api-client';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'investor' | 'founder' | 'both';
  bio?: string;
  company?: string;
  position?: string;
  location?: string;
  skills: string[];
  interests: string[];
  linkedin_url?: string;
  twitter_url?: string;
}

export interface UpdateUserProfileData extends Partial<Omit<UserProfile, 'id' | 'email'>> {}

export class UserApi {
  private static readonly BASE_PATH = '/users';

  // Get current user's profile
  static async getCurrentProfile(): Promise<ApiResponse<UserProfile>> {
    return apiClient.get<UserProfile>(`${this.BASE_PATH}/me`);
  }

  // Get user profile by ID
  static async getUserProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    return apiClient.get<UserProfile>(`${this.BASE_PATH}/${userId}`);
  }

  // Update user profile
  static async updateProfile(data: UpdateUserProfileData): Promise<ApiResponse<UserProfile>> {
    return apiClient.patch<UserProfile>(`${this.BASE_PATH}/me`, data);
  }

  // Update avatar
  static async updateAvatar(file: File): Promise<ApiResponse<{ avatar_url: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);

    return apiClient.post<{ avatar_url: string }>(`${this.BASE_PATH}/me/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Delete user profile
  static async deleteProfile(): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.BASE_PATH}/me`);
  }

  // Search users
  static async searchUsers(query: string, filters?: {
    role?: 'investor' | 'founder' | 'both';
    skills?: string[];
    location?: string;
  }): Promise<ApiResponse<UserProfile[]>> {
    return apiClient.get<UserProfile[]>(`${this.BASE_PATH}/search`, {
      params: {
        q: query,
        ...filters,
      },
    });
  }
}
