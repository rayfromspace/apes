"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, User } from "./types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

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
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;
          if (!data?.user) throw new Error("No user data returned");

          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          // Don't throw error if profile doesn't exist
          const user = {
            id: data.user.id,
            email: data.user.email!,
            ...(profileData || {}),
          };

          set({ user, isAuthenticated: true });
          return user;
        } catch (error: any) {
          console.error("Login error:", error);
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: name,
              },
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (error) throw error;
          if (!data?.user) throw new Error("No user data returned");

          // Don't try to fetch profile immediately after registration
          const user = {
            id: data.user.id,
            email: data.user.email!,
            full_name: name,
          };

          set({ user, isAuthenticated: true });
          return user;
        } catch (error: any) {
          console.error("Registration error:", error);
          throw error;
        }
      },

      logout: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ ...initialState, isInitialized: true });
        } catch (error: any) {
          console.error("Logout error:", error);
          throw error;
        }
      },

      initialize: async () => {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (!session) {
            set({ ...initialState, isInitialized: true });
            return;
          }

          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const user = {
            id: session.user.id,
            email: session.user.email!,
            ...(profileData || {}),
          };

          set({ user, isAuthenticated: true, isInitialized: true });
        } catch (error) {
          console.error("Initialize error:", error);
          set({ ...initialState, isInitialized: true });
        }
      },

      requestPasswordReset: async (email: string) => {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email);
          if (error) throw error;
        } catch (error: any) {
          console.error("Password reset request error:", error);
          throw error;
        }
      },

      resetPassword: async (newPassword: string) => {
        try {
          const { error } = await supabase.auth.updateUser({
            password: newPassword,
          });
          if (error) throw error;
        } catch (error: any) {
          console.error("Password reset error:", error);
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
