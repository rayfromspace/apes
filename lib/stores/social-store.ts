import { create } from 'zustand';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

export interface Post {
  id: string;
  author_id: string;
  author?: {
    name: string;
    avatar_url: string;
    role?: string;
  };
  content: string;
  image_url?: string;
  topics: string[];
  likes_count: number;
  comments_count: number;
  bookmarks_count: number;
  shares_count: number;
  visibility: 'public' | 'private' | 'followers';
  created_at: string;
  updated_at: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author?: {
    name: string;
    avatar_url: string;
    role?: string;
  };
  parent_id?: string;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  isLiked?: boolean;
  replies?: Comment[];
}

interface SocialStore {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  selectedTopic: string | null;
  fetchPosts: (topic?: string) => Promise<void>;
  createPost: (content: string, image?: File, topics?: string[]) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  bookmarkPost: (postId: string) => Promise<void>;
  unbookmarkPost: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string, parentId?: string) => Promise<void>;
  likeComment: (commentId: string) => Promise<void>;
  unlikeComment: (commentId: string) => Promise<void>;
  setSelectedTopic: (topic: string | null) => void;
}

const supabase = createClientComponentClient<Database>();

export const useSocialStore = create<SocialStore>((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,
  selectedTopic: null,

  setSelectedTopic: (topic) => {
    set({ selectedTopic: topic });
    get().fetchPosts(topic);
  },

  fetchPosts: async (topic?: string) => {
    set({ isLoading: true, error: null });
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          author:author_id(
            id,
            email,
            raw_user_meta_data->name,
            raw_user_meta_data->avatar_url,
            raw_user_meta_data->role
          )
        `)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false });

      if (topic) {
        query = query.contains('topics', [topic]);
      }

      const { data: posts, error } = await query;

      if (error) throw error;

      // Get current user's likes and bookmarks
      const user = (await supabase.auth.getUser()).data.user;
      if (user) {
        const { data: likes } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id);

        const { data: bookmarks } = await supabase
          .from('post_bookmarks')
          .select('post_id')
          .eq('user_id', user.id);

        const likedPostIds = new Set(likes?.map(like => like.post_id));
        const bookmarkedPostIds = new Set(bookmarks?.map(bookmark => bookmark.post_id));

        posts?.forEach(post => {
          post.isLiked = likedPostIds.has(post.id);
          post.isBookmarked = bookmarkedPostIds.has(post.id);
        });
      }

      set({ posts: posts || [], isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createPost: async (content: string, image?: File, topics: string[] = []) => {
    try {
      let image_url = null;
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `post-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('posts')
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('posts')
          .getPublicUrl(filePath);

        image_url = publicUrl;
      }

      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('posts')
        .insert({
          author_id: user.id,
          content,
          image_url,
          topics,
          visibility: 'public'
        });

      if (error) throw error;

      get().fetchPosts(get().selectedTopic);
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  likePost: async (postId: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: user.id });

      if (error) throw error;

      set(state => ({
        posts: state.posts.map(post =>
          post.id === postId
            ? { ...post, likes_count: post.likes_count + 1, isLiked: true }
            : post
        )
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  unlikePost: async (postId: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (error) throw error;

      set(state => ({
        posts: state.posts.map(post =>
          post.id === postId
            ? { ...post, likes_count: post.likes_count - 1, isLiked: false }
            : post
        )
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  bookmarkPost: async (postId: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('post_bookmarks')
        .insert({ post_id: postId, user_id: user.id });

      if (error) throw error;

      set(state => ({
        posts: state.posts.map(post =>
          post.id === postId
            ? { ...post, bookmarks_count: post.bookmarks_count + 1, isBookmarked: true }
            : post
        )
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  unbookmarkPost: async (postId: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('post_bookmarks')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (error) throw error;

      set(state => ({
        posts: state.posts.map(post =>
          post.id === postId
            ? { ...post, bookmarks_count: post.bookmarks_count - 1, isBookmarked: false }
            : post
        )
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  addComment: async (postId: string, content: string, parentId?: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          author_id: user.id,
          parent_id: parentId,
          content
        });

      if (error) throw error;

      set(state => ({
        posts: state.posts.map(post =>
          post.id === postId
            ? { ...post, comments_count: post.comments_count + 1 }
            : post
        )
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  likeComment: async (commentId: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('comment_likes')
        .insert({ comment_id: commentId, user_id: user.id });

      if (error) throw error;

      // Update UI optimistically
      // Note: We would need to add comments to our state to properly update this
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  unlikeComment: async (commentId: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update UI optimistically
      // Note: We would need to add comments to our state to properly update this
    } catch (error) {
      set({ error: (error as Error).message });
    }
  }
}));
