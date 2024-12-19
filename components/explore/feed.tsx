"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatePost } from "@/components/explore/create-post";
import { PostCard } from "@/components/explore/post-card";
import { ProjectCard } from "@/components/projects/project-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const TOPICS = [
  { id: "tech", name: "Technology", icon: "💻" },
  { id: "defi", name: "DeFi", icon: "💰" },
  { id: "ai", name: "Artificial Intelligence", icon: "🤖" },
  { id: "web3", name: "Web3", icon: "🌐" },
  { id: "dev", name: "Development", icon: "⚡" },
  { id: "research", name: "Research", icon: "🔬" },
];

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  topics: string[];
  comments: Comment[];
  bookmarks: number;
  shares: number;
}

const DEMO_POSTS: Post[] = [
  {
    id: "1",
    author: {
      name: "Sarah Chen",
      avatar: "https://avatar.vercel.sh/sarah",
      role: "AI Engineer",
    },
    content: "Just deployed our new AI model for content generation. The results are impressive! Who's interested in beta testing?",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2832&auto=format&fit=crop",
    timestamp: "2h ago",
    likes: 42,
    topics: ["ai", "tech", "dev"],
    comments: [
      {
        id: "c1",
        author: {
          name: "Mike Wilson",
          avatar: "https://avatar.vercel.sh/mike",
          role: "ML Engineer",
        },
        content: "This looks promising! What's the tech stack?",
        timestamp: "1h ago",
        likes: 8,
        replies: [
          {
            id: "r1",
            author: {
              name: "Sarah Chen",
              avatar: "https://avatar.vercel.sh/sarah",
              role: "AI Engineer",
            },
            content: "We're using PyTorch with custom transformers!",
            timestamp: "30m ago",
            likes: 4,
          },
        ],
      },
    ],
    bookmarks: 15,
    shares: 8,
  },
  {
    id: "2",
    author: {
      name: "Alex Thompson",
      avatar: "https://avatar.vercel.sh/alex",
      role: "Blockchain Developer",
    },
    content: "Looking for React developers to join our DeFi project. Great opportunity to work with cutting-edge tech!",
    timestamp: "5h ago",
    likes: 28,
    topics: ["defi", "web3", "dev"],
    comments: [],
    bookmarks: 10,
    shares: 5,
  },
];

const DEMO_PROJECTS = [
  {
    id: "1",
    title: "DeFi Trading Platform",
    description: "A decentralized exchange platform with advanced trading features.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop",
    category: "DeFi",
    visibility: "Public",
    funding_goal: 50000,
    current_funding: 32500,
    founder: "Alex Thompson",
    skills: ["Solidity", "React", "Web3"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: "In Progress",
    team_members: [],
    owner_id: "1"
  },
];

export function ExploreFeed() {
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"recent" | "trending" | "discussed">("recent");
  const [posts, setPosts] = useState(DEMO_POSTS);

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const filteredPosts = posts
    .filter(post =>
      selectedTopics.length === 0 ||
      post.topics.some(topic => selectedTopics.includes(topic))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "trending":
          return b.likes - a.likes;
        case "discussed":
          return b.comments.length - a.comments.length;
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });

  return (
    <div>
      <Tabs defaultValue="posts" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">Updates & Discussions</TabsTrigger>
          <TabsTrigger value="projects">Featured Projects</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <div className="space-y-6">
            {/* Topic Selection */}
            <div className="bg-card rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => handleTopicToggle(topic.id)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                      selectedTopics.includes(topic.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <span className="mr-1">{topic.icon}</span>
                    {topic.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex justify-between items-center mb-6">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="discussed">Most Discussed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Create Post */}
            <CreatePost />

            {/* Posts Feed */}
            <div className="space-y-6">
              {filteredPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onComment={(content) => {
                    // Handle new comment
                  }}
                  onLike={() => {
                    // Handle like
                  }}
                  onBookmark={() => {
                    // Handle bookmark
                  }}
                  onShare={() => {
                    // Handle share
                  }}
                />
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="projects">
          <div className="grid gap-6">
            {DEMO_PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}