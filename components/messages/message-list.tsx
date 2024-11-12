"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"

const conversations = [
  {
    id: "1",
    name: "Alex Thompson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&q=60",
    lastMessage: "Hey, how's the project going?",
    time: "2m ago",
    unread: true,
  },
  {
    id: "2",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&q=60",
    lastMessage: "The designs look great!",
    time: "1h ago",
    unread: false,
  },
  {
    id: "3",
    name: "Michael Park",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&q=60",
    lastMessage: "Meeting at 3pm?",
    time: "2h ago",
    unread: false,
  },
]

export function MessageList() {
  const [search, setSearch] = useState("")

  return (
    <Card className="w-80 flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Messages</CardTitle>
          <Button size="icon" variant="ghost">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-4">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="flex items-center space-x-4 rounded-lg p-2 hover:bg-accent cursor-pointer"
            >
              <Avatar>
                <AvatarImage src={conversation.avatar} alt={conversation.name} />
                <AvatarFallback>{conversation.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">
                    {conversation.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {conversation.time}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {conversation.lastMessage}
                </p>
              </div>
              {conversation.unread && (
                <div className="h-2 w-2 rounded-full bg-blue-600" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}