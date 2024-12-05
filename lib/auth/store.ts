"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from './types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

const initialState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false,
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,
      login: async (email: string, password: string) => {
        try {
          console.log('Attempting login...');
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            console.error('Login error:', error);
            throw new Error(error.message);
          }

          if (!data?.user) {
            console.error('No user data returned');
            throw new Error('Login failed: No user data returned');
          }

          const user: User = {
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata.name || '',
            role: data.user.user_metadata.role || 'team_member',
            avatar: data.user.user_metadata.avatar,
          };

          console.log('Login successful:', user);
          set({
            user,
            isAuthenticated: true,
            isInitialized: true,
          });
          return user;
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },
      register: async (name: string, email: string, password: string) => {
        try {
          console.log('Attempting registration...');
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
                role: 'team_member',
              },
            },
          });

          if (error) {
            console.error('Registration error:', error);
            throw new Error(error.message);
          }

          if (!data?.user) {
            console.error('No user data returned');
            throw new Error('Registration failed: No user data returned');
          }

          const user: User = {
            id: data.user.id,
            email: data.user.email!,
            name: name,
            role: 'team_member',
            avatar: data.user?.user_metadata.avatar,
          };

          console.log('Registration successful:', user);
          set({
            user,
            isAuthenticated: true,
            isInitialized: true,
          });
          return user;
        } catch (error) {
          console.error('Registration failed:', error);
          throw error;
        }
      },
      logout: async () => {
        try {
          console.log('Attempting logout...');
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.error('Logout error:', error);
            throw new Error(error.message);
          }
          
          console.log('Logout successful');
          set({
            ...initialState,
            isInitialized: true,
          });
        } catch (error) {
          console.error('Logout failed:', error);
          throw error;
        }
      },
      initialize: async () => {
        try {
          console.log('Initializing auth state...');
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Error getting session:', error);
            set({ ...initialState, isInitialized: true });
            return;
          }

          if (session?.user) {
            console.log('Found existing session');
            const user: User = {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata.name || '',
              role: session.user.user_metadata.role || 'team_member',
              avatar: session.user.user_metadata.avatar,
            };

            set({
              user,
              isAuthenticated: true,
              isInitialized: true,
            });
          } else {
            console.log('No existing session found');
            set({ ...initialState, isInitialized: true });
          }

          // Listen for auth changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              console.log('Auth state changed:', event);
              if (session?.user) {
                const user: User = {
                  id: session.user.id,
                  email: session.user.email!,
                  name: session.user.user_metadata.name || '',
                  role: session.user.user_metadata.role || 'team_member',
                  avatar: session.user.user_metadata.avatar,
                };

                set({
                  user,
                  isAuthenticated: true,
                  isInitialized: true,
                });
              } else {
                set({
                  ...initialState,
                  isInitialized: true,
                });
              }
            }
          );

          return () => {
            subscription.unsubscribe();
          };
        } catch (error) {
          console.error('Error in initialize:', error);
          set({ ...initialState, isInitialized: true });
        }
      },
      requestPasswordReset: async (email: string) => {
        try {
          console.log('Requesting password reset...');
          const { error } = await supabase.auth.resetPasswordForEmail(email);
          if (error) {
            console.error('Password reset request error:', error);
            throw new Error(error.message);
          }
          console.log('Password reset request sent');
        } catch (error) {
          console.error('Password reset request failed:', error);
          throw error;
        }
      },
      resetPassword: async (token: string, newPassword: string) => {
        try {
          console.log('Resetting password...');
          const { error } = await supabase.auth.updateUser({ password: newPassword });
          if (error) {
            console.error('Password reset error:', error);
            throw new Error(error.message);
          }
          console.log('Password reset successful');
        } catch (error) {
          console.error('Password reset failed:', error);
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isInitialized: state.isInitialized,
      }),
    }
  )
);