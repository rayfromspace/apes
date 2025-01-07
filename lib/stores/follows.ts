import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';

interface FollowStats {
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
}

interface FollowStore {
  stats: Record<string, FollowStats>;
  isLoading: boolean;
  error: string | null;
  fetchFollowStats: (userId: string, currentUserId?: string) => Promise<void>;
  followUser: (userId: string) => Promise<boolean>;
  unfollowUser: (userId: string) => Promise<boolean>;
}

export const useFollowStore = create<FollowStore>((set, get) => ({
  stats: {},
  isLoading: false,
  error: null,

  fetchFollowStats: async (userId: string, currentUserId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const [
        { data: followerCount },
        { data: followingCount },
        { data: isFollowing }
      ] = await Promise.all([
        supabase.rpc('get_follower_count', { user_id: userId }),
        supabase.rpc('get_following_count', { user_id: userId }),
        currentUserId
          ? supabase.rpc('is_following', {
              follower: currentUserId,
              following: userId
            })
          : Promise.resolve({ data: false })
      ]);

      set((state) => ({
        stats: {
          ...state.stats,
          [userId]: {
            followerCount: followerCount || 0,
            followingCount: followingCount || 0,
            isFollowing: isFollowing || false
          }
        },
        isLoading: false
      }));
    } catch (error) {
      console.error('Error fetching follow stats:', error);
      set({ error: 'Failed to fetch follow stats', isLoading: false });
    }
  },

  followUser: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('follows')
        .insert({
          following_id: userId
        });

      if (error) throw error;

      // Update stats
      const currentStats = get().stats[userId];
      if (currentStats) {
        set((state) => ({
          stats: {
            ...state.stats,
            [userId]: {
              ...currentStats,
              followerCount: currentStats.followerCount + 1,
              isFollowing: true
            }
          }
        }));
      }

      set({ isLoading: false });
      return true;
    } catch (error) {
      console.error('Error following user:', error);
      set({ error: 'Failed to follow user', isLoading: false });
      return false;
    }
  },

  unfollowUser: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('follows')
        .delete()
        .match({
          following_id: userId
        });

      if (error) throw error;

      // Update stats
      const currentStats = get().stats[userId];
      if (currentStats) {
        set((state) => ({
          stats: {
            ...state.stats,
            [userId]: {
              ...currentStats,
              followerCount: currentStats.followerCount - 1,
              isFollowing: false
            }
          }
        }));
      }

      set({ isLoading: false });
      return true;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      set({ error: 'Failed to unfollow user', isLoading: false });
      return false;
    }
  }
}));
