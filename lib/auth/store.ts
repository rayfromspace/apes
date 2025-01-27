"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  bio: string | null;
  location: string | null;
  skills: string[] | null;
  skipped_at: string | null;
  email: string;
}

interface AuthState {
  user: any | null;
  profile: Profile | null;
  isLoading: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, name: string) => Promise<any>;
  logout: () => Promise<void>;
}

const supabase = createClientComponentClient();

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isLoading: false,

      initialize: async () => {
        try {
          // Don't set loading if we already have a user
          if (!get().user) {
            set({ isLoading: true });
          }

          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session) {
            set({ user: null, profile: null, isLoading: false });
            return;
          }

          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          set({ 
            user: session.user,
            profile: profile || null,
            isLoading: false 
          });
        } catch (error) {
          console.error("Error initializing auth:", error);
          set({ user: null, profile: null, isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

          set({ 
            user: data.user,
            profile: profile || null,
            isLoading: false
          });

          return data.user;
        } catch (error: any) {
          set({ isLoading: false });
          console.error("Login error:", error);
          throw error;
        }
      },

      register: async (email: string, password: string, name: string) => {
        try {
          set({ isLoading: true });
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: name,
              },
            },
          });

          if (error) throw error;

          // Create initial profile
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: data.user!.id,
              full_name: name,
              email: email,
            });

          if (profileError) throw profileError;

          set({ 
            user: data.user,
            profile: { id: data.user!.id, full_name: name, email, username: null, bio: null, location: null, skills: null, skipped_at: null },
            isLoading: false
          });

          return data.user;
        } catch (error: any) {
          set({ isLoading: false });
          console.error("Registration error:", error);
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ user: null, profile: null, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          console.error("Logout error:", error);
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
      }),
    }
  )
);
