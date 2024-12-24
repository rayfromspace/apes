"use client";

import { createContext, useContext, useState } from "react";

// Define test users with simple IDs
const TEST_USERS = {
  "user-1": {
    id: "user-1",
    name: "Test User 1",
    email: "user1@example.com",
  },
  "user-2": {
    id: "user-2",
    name: "Test User 2",
    email: "user2@example.com",
  },
  "user-3": {
    id: "user-3",
    name: "Test User 3",
    email: "user3@example.com",
  },
};

interface TestAuthContextType {
  currentUser: string;
  switchUser: (userId: string) => void;
}

const TestAuthContext = createContext<TestAuthContextType | undefined>(undefined);

export function TestAuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState("user-1");

  const switchUser = (userId: string) => {
    if (TEST_USERS[userId]) {
      setCurrentUser(userId);
    }
  };

  return (
    <TestAuthContext.Provider value={{ currentUser, switchUser }}>
      {children}
    </TestAuthContext.Provider>
  );
}

export function useTestAuth() {
  const context = useContext(TestAuthContext);
  if (context === undefined) {
    throw new Error("useTestAuth must be used within a TestAuthProvider");
  }
  return context;
}
