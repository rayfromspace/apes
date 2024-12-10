import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserApi, type UserProfile, type UpdateUserProfileData } from '@/lib/api/user-api';

export function useProfile(userId?: string) {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: userId ? ['profile', userId] : ['profile', 'me'],
    queryFn: () => 
      userId ? UserApi.getUserProfile(userId) : UserApi.getCurrentProfile(),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateUserProfileData) => UserApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });

  const updateAvatarMutation = useMutation({
    mutationFn: (file: File) => UserApi.updateAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });

  return {
    profile: profileQuery.data?.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    updateAvatar: updateAvatarMutation.mutate,
    isUpdatingAvatar: updateAvatarMutation.isPending,
  };
}
