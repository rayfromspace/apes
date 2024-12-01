import { useAuth as useAuthStore } from './store';

export function useAuth() {
  const auth = useAuthStore();
  
  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    login: auth.login,
    register: auth.register,
    logout: auth.logout,
  };
}