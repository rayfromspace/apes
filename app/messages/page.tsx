"use client";

import { Messages } from "@/components/dashboard/messages";

export default function MessagesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <Messages />
      </div>
    </div>
  );
}
