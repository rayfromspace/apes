"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface ProjectMessagesProps {
  id: string
}

const messages = [
  {
    id: 1,
    author: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&q=60",
    },
    content: "Updated the frontend designs, please review when you can",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    author: {
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&q=60",
    },
    content: "Backend API documentation is ready for review",
    timestamp: "4 hours ago",
  },
]

export function ProjectMessages({ id }: ProjectMessagesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-4">
                <Avatar>
                  <AvatarImage src={message.author.avatar} alt={message.author.name} />
                  <AvatarFallback>{message.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{message.author.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {message.timestamp}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input placeholder="Type your message..." />
            <Button size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}