import { useState, useEffect } from 'react';
import { fetchApi, uploadFile, type ApiError } from '../utils/api';
import { useAuth } from '../auth/store';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  role: 'investor' | 'founder' | 'both';
  linkedin?: string;
  twitter?: string;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await fetchApi<{ user: Profile }>(
      `/users/${user?.id}`
    );

    if (error) {
      setError(error.error);
    } else if (data) {
      setProfile(data.user);
    }
    setLoading(false);
  };

  const updateProfile = async (
    updates: Partial<Profile>,
    avatar?: File
  ) => {
    if (!user?.id) return;

    const formData = new FormData();
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    if (avatar) {
      formData.append('avatar', avatar);
    }

    const { data, error } = await uploadFile(
      `/users/${user.id}`,
      formData,
      { method: 'PATCH' }
    );

    if (error) {
      setError(error.error);
      return null;
    }

    setProfile(data.user);
    return data.user;
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile,
  };
}
