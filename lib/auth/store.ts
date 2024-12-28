"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, User } from "./types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { signIn } from "next-auth/react";

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
          console.log("Attempting login...");

          // Step 1: Authenticate with Supabase
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            console.error("Login error with Supabase:", error);
            throw new Error(error.message || "Failed to log in with Supabase");
          }

          if (!data?.user) {
            console.error("No user data returned from Supabase");
            throw new Error(
              "Login failed: No user data returned from Supabase"
            );
          }

          // Step 2: Authenticate with NextAuth
          const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
          });

          if (result?.error) {
            console.error("NextAuth login error:", result.error);
            throw new Error(result.error || "Failed to log in with NextAuth");
          }

          // Step 3: Construct the User object
          const user: User = {
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata.name || "",
            role: data.user.user_metadata.role || "team_member",
            avatar: data.user.user_metadata.avatar || null,
          };

          // Step 4: Update Zustand state
          set({
            user,
            isAuthenticated: true,
            isInitialized: true,
          });

          console.log("Login successful. Updated state:", {
            user,
            isAuthenticated: true,
            isInitialized: true,
          });

          return user;
        } catch (error) {
          console.error("Login failed:", error);
          throw error;
        }
      },
      register: async (name: string, email: string, password: string) => {
        try {
          console.log("Attempting registration...");
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
                role: "team_member",
              },
            },
          });

          if (error) {
            console.error("Registration error:", error);
            throw new Error(error.message);
          }

          if (!data?.user) {
            console.error("No user data returned");
            throw new Error("Registration failed: No user data returned");
          }

          const user: User = {
            id: data.user.id,
            email: data.user.email!,
            name: name,
            role: "team_member",
            avatar: data.user?.user_metadata.avatar,
          };

          console.log("Registration successful:", user);
          set({
            user,
            isAuthenticated: true,
            isInitialized: true,
          });
          return user;
        } catch (error) {
          console.error("Registration failed:", error);
          throw error;
        }
      },
      logout: async (router: any) => {
        try {
          console.log("Attempting logout...");

          // Step 1: Sign out from Supabase
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.error("Logout error with Supabase:", error);
            throw new Error(error.message);
          }

          // Call the API route to handle logout
          const response = await fetch("/api/auth/logout", {
            method: "POST",
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Logout API error:", errorData.error);
            throw new Error(errorData.error || "Failed to log out");
          }

          console.log("Logout successful");

          // Clear local application state
          set({
            ...initialState,
            isInitialized: true,
          });

          // Step 4: Redirect to the login page
          if (router) {
            router.push("/auth/login");
          }
        } catch (error) {
          console.error("Logout failed:", error);
          throw error;
        }
      },
      initialize: async () => {
        try {
          console.log("Initializing auth state...");
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          if (error || !session?.user) {
            console.log(
              "No existing session found or error occurred. Logging out..."
            );
            // await get().logout(); // Call the logout method to reset the state
            return;
          }

          console.log("Found existing session");
          const user: User = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata.name || "",
            role: session.user.user_metadata.role || "team_member",
            avatar: session.user.user_metadata.avatar,
          };

          set({
            user,
            isAuthenticated: true,
            isInitialized: true,
          });

          // Listen for auth changes
          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth state changed:", event);
            if (session?.user) {
              const user: User = {
                id: session.user.id,
                email: session.user.email!,
                name: session.user.user_metadata.name || "",
                role: session.user.user_metadata.role || "team_member",
                avatar: session.user.user_metadata.avatar,
              };

              set({
                user,
                isAuthenticated: true,
                isInitialized: true,
              });
            } else {
              console.log(
                "Auth state changed: No user session. Logging out..."
              );
              // await get().logout();
            }
          });

          return () => {
            subscription.unsubscribe();
          };
        } catch (error) {
          console.error("Error in initialize:", error);
          // await get().logout(); // Ensure logout is called on failure
        }
      },
      requestPasswordReset: async (email: string) => {
        try {
          console.log("Requesting password reset...");
          const { error } = await supabase.auth.resetPasswordForEmail(email);
          if (error) {
            console.error("Password reset request error:", error);
            throw new Error(error.message);
          }
          console.log("Password reset request sent");
        } catch (error) {
          console.error("Password reset request failed:", error);
          throw error;
        }
      },
      resetPassword: async (token: string, newPassword: string) => {
        try {
          console.log("Resetting password...");
          const { error } = await supabase.auth.updateUser({
            password: newPassword,
          });
          if (error) {
            console.error("Password reset error:", error);
            throw new Error(error.message);
          }
          console.log("Password reset successful");
        } catch (error) {
          console.error("Password reset failed:", error);
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
        isInitialized: state.isInitialized,
      }),
    }
  )
);
