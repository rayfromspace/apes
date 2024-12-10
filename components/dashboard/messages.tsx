"use client";

import { useState } from "react";
import { ChatList } from "./messages/chat-list";
import { ChatView } from "./messages/chat-view";

export function Messages() {
  const [selectedChat, setSelectedChat] = useState<string | undefined>();

  return (
    <div className="grid gap-6 md:grid-cols-[350px_1fr]">
      <ChatList
        selectedChat={selectedChat}
        onChatSelect={setSelectedChat}
      />
      {selectedChat ? (
        <ChatView chatId={selectedChat} />
      ) : (
        <div className="flex items-center justify-center h-[600px] bg-muted rounded-lg">
          <p className="text-muted-foreground">
            Select a chat to start messaging
          </p>
        </div>
      )}
    </div>
  );
}
