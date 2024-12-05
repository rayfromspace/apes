import { useAuth as useAuthStore } from './store';

export function useAuth() {
  const auth = useAuthStore();
  
  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isInitialized: auth.isInitialized,
    login: auth.login,
    register: auth.register,
    logout: auth.logout,
    initialize: auth.initialize,
  };
}