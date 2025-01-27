'use client';

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  visibility: 'public' | 'private';
  status: 'active' | 'completed' | 'archived';
  founder_id: string;
  created_at: string;
  updated_at: string;
}

interface ProjectMessagesProps {
  project: Project;
}

interface Message {
  id: string;
  content: string;
  sender: {
    name: string;
    avatar?: string;
  };
  timestamp: Date;
}

export function ProjectMessages({ project }: ProjectMessagesProps) {
  const [newMessage, setNewMessage] = useState('');

  // Demo messages
  const messages: Message[] = [
    {
      id: '1',
      content: "Hey team! I just pushed the latest updates to the repository.",
      sender: {
        name: 'Alice',
      },
      timestamp: new Date(new Date().setHours(new Date().getHours() - 2)),
    },
    {
      id: '2',
      content: "Great work! I will review the changes shortly.",
      sender: {
        name: 'Bob',
      },
      timestamp: new Date(new Date().setHours(new Date().getHours() - 1)),
    },
    {
      id: '3',
      content: "Don't forget we have a team meeting tomorrow at 10 AM.",
      sender: {
        name: 'Charlie',
      },
      timestamp: new Date(),
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Here you would typically send the message to your backend
    console.log('Sending message:', newMessage);
    
    setNewMessage('');
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-12rem)]">
      <CardContent className="flex flex-col flex-1 p-6">
        {/* Messages Container */}
        <div className="flex-1 space-y-4 overflow-y-auto mb-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={message.sender.avatar} />
                <AvatarFallback>
                  {message.sender.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {message.sender.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm mt-1">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
