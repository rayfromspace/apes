"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatePost } from "@/components/community/create-post";
import { PostCard } from "@/components/community/post-card";
import { ProjectCard } from "@/components/projects/project-card";

const DEMO_POSTS = [
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
    comments: 12,
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
    comments: 8,
  },
];

const DEMO_PROJECTS = [
  {
    id: "1",
    title: "DeFi Trading Platform",
    description: "A decentralized exchange platform with advanced trading features.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop",
    category: "DeFi",
    progress: 65,
    fundingGoal: 50000,
    currentFunding: 32500,
    founder: "Alex Thompson",
    skills: ["Solidity", "React", "Web3"],
  },
];

export function CommunityFeed() {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div>
      <Tabs defaultValue="posts" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">Posts & Articles</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <CreatePost />
          {DEMO_POSTS.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
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