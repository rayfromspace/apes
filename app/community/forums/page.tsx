"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Users, ArrowUpRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Thread {
  id: string;
  title: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  replies: number;
  views: number;
  lastReply: {
    author: string;
    timestamp: string;
  };
  tags: string[];
  pinned?: boolean;
}

const threads: Thread[] = [
  {
    id: "1",
    title: "Best practices for smart contract development",
    category: "Development",
    author: {
      name: "John Doe",
      avatar: "/avatars/john.jpg",
    },
    replies: 23,
    views: 156,
    lastReply: {
      author: "Jane Smith",
      timestamp: "2023-12-18T19:30:00Z",
    },
    tags: ["Smart Contracts", "Solidity", "Security"],
    pinned: true,
  },
  // Add more threads as needed
];

export default function Forums() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [newThreadCategory, setNewThreadCategory] = useState("");

  const filteredThreads = threads.filter((thread) => {
    const matchesSearch = thread.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || thread.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleCreateThread = () => {
    if (!newThreadTitle.trim() || !newThreadContent.trim() || !newThreadCategory) {
      toast.error("Please fill in all fields");
      return;
    }

    // Add thread creation logic here
    toast.success("Thread created successfully!");
    // Reset form
    setNewThreadTitle("");
    setNewThreadContent("");
    setNewThreadCategory("");
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Discussion Forums</h1>
          <p className="text-muted-foreground">
            Join the conversation with other community members
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create New Thread</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Thread</DialogTitle>
              <DialogDescription>
                Start a new discussion with the community
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input
                  placeholder="Thread Title"
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Select
                  value={newThreadCategory}
                  onValueChange={setNewThreadCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Thread content"
                  value={newThreadContent}
                  onChange={(e) => setNewThreadContent(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
              <Button onClick={handleCreateThread} className="w-full">
                Create Thread
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search threads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:w-1/3"
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Development">Development</SelectItem>
            <SelectItem value="Design">Design</SelectItem>
            <SelectItem value="Business">Business</SelectItem>
            <SelectItem value="General">General</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredThreads.map((thread) => (
          <Card
            key={thread.id}
            className={thread.pinned ? "border-primary" : ""}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {thread.pinned && (
                      <Badge variant="secondary">Pinned</Badge>
                    )}
                    <CardTitle className="text-xl hover:text-primary">
                      <a href={`/community/forums/${thread.id}`} className="flex items-center gap-2">
                        {thread.title}
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </CardTitle>
                  </div>
                  <CardDescription>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={thread.author.avatar} />
                          <AvatarFallback>
                            {thread.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{thread.author.name}</span>
                      </div>
                      <Badge variant="outline">{thread.category}</Badge>
                    </div>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{thread.replies}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{thread.views}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {thread.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Last reply by {thread.lastReply.author} on{" "}
                {formatTimestamp(thread.lastReply.timestamp)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
