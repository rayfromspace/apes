import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send } from "lucide-react";

interface Message {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  topic: string;
}

const DEMO_MESSAGES: Message[] = [
  {
    id: "1",
    content: "What's everyone's thoughts on the latest market trends?",
    author: {
      name: "John Doe",
      avatar: "/avatars/1.png",
    },
    timestamp: "5 min ago",
    topic: "Market Analysis",
  },
  {
    id: "2",
    content: "I found the portfolio management module really helpful!",
    author: {
      name: "Jane Smith",
      avatar: "/avatars/2.png",
    },
    timestamp: "10 min ago",
    topic: "Portfolio Management",
  },
];

export function DiscussionTab() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {DEMO_MESSAGES.map((msg) => (
            <Card key={msg.id}>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={msg.author.avatar} />
                    <AvatarFallback>
                      {msg.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{msg.author.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {msg.timestamp}
                        </p>
                      </div>
                      <Badge variant="secondary">{msg.topic}</Badge>
                    </div>
                    <p className="mt-2 text-sm">{msg.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-4 flex space-x-2">
        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
