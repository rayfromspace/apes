import { useTestAuth } from "@/providers/test-auth-provider";

export function useAuth() {
  const { currentUser } = useTestAuth();
  
  return {
    user: {
      id: currentUser,
      name: `Test User ${currentUser.split('-')[1]}`,
      email: `user${currentUser.split('-')[1]}@example.com`,
    },
    isLoading: false,
    error: null,
  };
}
