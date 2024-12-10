"use client";

import { Button } from "@/components/ui/button";
import { useTestAuth } from "@/providers/test-auth-provider";
import { TEST_USER_IDS } from "@/data/test-projects";

const USERS = [
  {
    id: TEST_USER_IDS.AI_PLATFORM_FOUNDER,
    name: "AI Platform Dashboard",
  },
  {
    id: TEST_USER_IDS.DIGITAL_ASSET_FOUNDER,
    name: "Digital Asset Dashboard",
  },
  {
    id: TEST_USER_IDS.VIRTUAL_EVENT_FOUNDER,
    name: "Virtual Event Dashboard",
  },
];

export function UserSwitcher() {
  const { currentUser, switchUser } = useTestAuth();

  return (
    <div className="flex flex-col gap-2 p-4 bg-muted rounded-lg">
      <h3 className="font-semibold">Switch Dashboard</h3>
      <div className="flex flex-col gap-2">
        {USERS.map((user) => (
          <Button
            key={user.id}
            variant={currentUser === user.id ? "default" : "outline"}
            onClick={() => switchUser(user.id)}
            className="justify-start"
          >
            {user.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
