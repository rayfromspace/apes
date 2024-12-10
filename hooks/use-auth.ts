import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTestAuth } from "@/providers/test-auth-provider";
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

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { currentUser } = useTestAuth();

  // For testing: use test user if no session
  const isAuthenticated = status === "authenticated" || !!currentUser;
  const isLoading = status === "loading";
  const user = session?.user || TEST_USERS[currentUser];

  const signOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      router.push("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    signOut,
  };
}
