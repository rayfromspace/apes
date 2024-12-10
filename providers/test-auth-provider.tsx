"use client";

import { createContext, useContext, useState } from "react";
import { TEST_USER_IDS } from "@/data/test-projects";

// Define test users
const TEST_USERS = {
  [TEST_USER_IDS.AI_PLATFORM_FOUNDER]: {
    id: TEST_USER_IDS.AI_PLATFORM_FOUNDER,
    name: "AI Platform Founder",
    email: "ai.founder@example.com",
  },
  [TEST_USER_IDS.DIGITAL_ASSET_FOUNDER]: {
    id: TEST_USER_IDS.DIGITAL_ASSET_FOUNDER,
    name: "Digital Asset Founder",
    email: "digital.founder@example.com",
  },
  [TEST_USER_IDS.VIRTUAL_EVENT_FOUNDER]: {
    id: TEST_USER_IDS.VIRTUAL_EVENT_FOUNDER,
    name: "Virtual Event Founder",
    email: "virtual.founder@example.com",
  },
};

interface TestAuthContextType {
  currentUser: string;
  switchUser: (userId: string) => void;
}

const TestAuthContext = createContext<TestAuthContextType | undefined>(undefined);

export function TestAuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState(TEST_USER_IDS.AI_PLATFORM_FOUNDER);

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
