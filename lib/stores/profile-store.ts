import { create } from "zustand";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: string;
  location?: string;
  website?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  skills: string[];
  joinedAt: string;
  projectCount: number;
  investmentCount: number;
  totalInvested: number;
}

interface ProfileStore {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      // TODO: Replace with actual API call
      const response = await fetch('/api/profile');
      const data = await response.json();
      set({ profile: data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch profile', isLoading: false });
    }
  },

  updateProfile: async (data) => {
    try {
      set({ isLoading: true, error: null });
      // TODO: Replace with actual API call
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const updatedProfile = await response.json();
      set({ profile: updatedProfile, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to update profile', isLoading: false });
    }
  },

  updateAvatar: async (file) => {
    try {
      set({ isLoading: true, error: null });
      const formData = new FormData();
      formData.append('avatar', file);
      // TODO: Replace with actual API call
      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      });
      const { avatarUrl } = await response.json();
      set((state) => ({
        profile: state.profile ? { ...state.profile, avatar: avatarUrl } : null,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update avatar', isLoading: false });
    }
  },
}));
