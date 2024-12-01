import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from './types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isInitialized: false,
      login: async (email: string, password: string) => {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }

        const { user } = await response.json();
        set({
          user,
          isAuthenticated: true,
          isInitialized: true,
        });
        return user;
      },
      register: async (name: string, email: string, password: string) => {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }

        const { user } = await response.json();
        set({
          user,
          isAuthenticated: true,
          isInitialized: true,
        });
        return user;
      },
      requestPasswordReset: async (email: string) => {
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }
      },
      resetPassword: async (token: string, newPassword: string) => {
        const response = await fetch('/api/auth/reset-password', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, newPassword }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }
      },
      logout: async () => {
        await fetch('/api/auth', { method: 'DELETE' });
        set({ user: null, isAuthenticated: false, isInitialized: false });
      },
      initialize: async () => {
        const supabase = createClientComponentClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          set({
            user: session.user,
            isAuthenticated: true,
            isInitialized: true,
          });
        } else {
          set({
            isInitialized: true,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => {
          if (typeof window !== 'undefined') {
            const str = localStorage.getItem(name);
            if (!str) return null;
            try {
              return JSON.parse(str);
            } catch {
              return null;
            }
          }
          return null;
        },
        setItem: (name, value) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(name);
          }
        },
      },
    }
  )
);