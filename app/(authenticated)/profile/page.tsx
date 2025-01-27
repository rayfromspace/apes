"use client";

import { useState } from "react";
import { 
  Loader2, User, Camera, Calendar, MapPin, 
  Mail, Link as LinkIcon, Briefcase, 
  Cake, Heart, MessageCircle, Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/explore/post-card";
import { ProjectCard } from "@/components/projects/list";
import { ProfileForm } from "@/components/profile/profile-form";
import { ConnectionList } from "@/components/profile/connection-list";
import { ShareProfile } from "@/components/profile/share-profile";
import { getLocationDisplay } from "@/lib/utils/location";
import { ProfileCompletionCard } from "@/components/profile/profile-completion-card";

// Mock data for testing
const mockProjects = [
  {
    id: "1",
    title: "Project Alpha",
    description: "A revolutionary blockchain project",
    category: "Blockchain",
    visibility: "Public",
    current_funding: 50000,
    funding_goal: 100000,
    progress: 65,
  },
  {
    id: "2",
    title: "Project Beta",
    description: "AI-powered analytics platform",
    category: "AI",
    visibility: "Public",
    current_funding: 75000,
    funding_goal: 150000,
    progress: 80,
  },
];

const mockPosts = [
  {
    id: "1",
    author: {
      id: "1",
      name: "John Doe",
      role: "Founder",
      avatar: "https://avatar.vercel.sh/1",
    },
    content: "Just launched our new feature! Check it out!",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 5,
    image: null,
  },
  {
    id: "2",
    author: {
      id: "1",
      name: "John Doe",
      role: "Founder",
      avatar: "https://avatar.vercel.sh/1",
    },
    content: "Working on something exciting! Stay tuned!",
    timestamp: "1 day ago",
    likes: 42,
    comments: 8,
    image: "https://picsum.photos/seed/picsum/800/400",
  },
];

export default function ProfilePage() {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-8">
        <ProfileCompletionCard />
        <div className="mb-8 flex items-start gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={previewUrl || user?.avatar_url || `https://avatar.vercel.sh/${user?.email}`} />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <Label 
              htmlFor="avatar"
              className="absolute bottom-0 right-0 rounded-full bg-primary p-2 cursor-pointer hover:bg-primary/90 transition-colors"
            >
              <Camera className="h-4 w-4 text-primary-foreground" />
            </Label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{user?.full_name || user?.email?.split('@')[0]}</h1>
            <p className="text-muted-foreground">@{user?.email?.split('@')[0]}</p>
            <div className="mt-4 flex flex-wrap gap-4">
              {user?.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(user?.created_at || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-4">
              <ConnectionList />
              <ShareProfile 
                userId={user?.id || ""} 
                userName={user?.full_name || user?.email?.split('@')[0] || ""} 
              />
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Passionate about building innovative solutions that make a difference. 
                    Experienced in full-stack development and blockchain technology.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact & Social</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.email}</span>
                  </div>
                  {user?.website_url && (
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <a href={user.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {user.website_url.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  {user?.github_username && (
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <a href={`https://github.com/${user.github_username}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {user.github_username}
                      </a>
                    </div>
                  )}
                  {user?.linkedin_url && (
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      <a href={user.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        LinkedIn
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge>React</Badge>
                    <Badge>TypeScript</Badge>
                    <Badge>Node.js</Badge>
                    <Badge>Blockchain</Badge>
                    <Badge>Smart Contracts</Badge>
                    <Badge>Web3</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Blockchain Technology</Badge>
                    <Badge variant="outline">AI/ML</Badge>
                    <Badge variant="outline">DeFi</Badge>
                    <Badge variant="outline">Web3</Badge>
                    <Badge variant="outline">Startups</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <div className="grid gap-6 md:grid-cols-2">
              {mockProjects.map((project) => (
                <ProjectCard key={project.id} project={project} showAnalytics />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="posts">
            <div className="space-y-6">
              {mockPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Update your profile information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm 
                  initialData={{
                    username: user?.email?.split('@')[0] || "",
                    fullName: user?.full_name || "",
                    bio: user?.bio || "",
                    location: user?.location || "",
                    website: user?.website_url || "",
                    github: user?.github_username || "",
                    linkedin: user?.linkedin_url || "",
                  }} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
