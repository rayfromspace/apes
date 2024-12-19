"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, MoreVertical, Image, Link } from "lucide-react";
import { toast } from "sonner";

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  liked: boolean;
  tags: string[];
}

const posts: Post[] = [
  {
    id: "1",
    author: {
      id: "user1",
      name: "John Doe",
      avatar: "/avatars/john.jpg",
      role: "Developer",
    },
    content: "Just launched my first DApp on the testnet! Check it out and let me know what you think. #Web3 #Blockchain",
    images: ["/posts/dapp-launch.jpg"],
    likes: 42,
    comments: 12,
    shares: 5,
    timestamp: "2023-12-18T20:30:00Z",
    liked: false,
    tags: ["Web3", "Blockchain", "Development"],
  },
  // Add more posts as needed
];

export default function CommunityFeed() {
  const [newPost, setNewPost] = useState("");
  const [localPosts, setLocalPosts] = useState(posts);

  const handlePost = () => {
    if (!newPost.trim()) {
      toast.error("Please write something to post");
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      author: {
        id: "currentUser",
        name: "Current User",
        avatar: "/avatars/default.jpg",
        role: "Member",
      },
      content: newPost,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: new Date().toISOString(),
      liked: false,
      tags: [],
    };

    setLocalPosts([post, ...localPosts]);
    setNewPost("");
    toast.success("Post created successfully!");
  };

  const handleLike = (postId: string) => {
    setLocalPosts(
      localPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
              liked: !post.liked,
            }
          : post
      )
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Community Feed</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src="/avatars/default.jpg" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <Textarea
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Image className="h-4 w-4 mr-2" />
                    Add Image
                  </Button>
                  <Button variant="outline" size="sm">
                    <Link className="h-4 w-4 mr-2" />
                    Add Link
                  </Button>
                </div>
                <Button onClick={handlePost}>Post</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {localPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>
                    {post.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{post.author.name}</span>
                    <Badge variant="secondary">{post.author.role}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatTimestamp(post.timestamp)}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Report</DropdownMenuItem>
                  <DropdownMenuItem>Hide</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{post.content}</p>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
              {post.images && post.images.length > 0 && (
                <div className="mt-4 grid gap-4 grid-cols-1">
                  {post.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Post image ${index + 1}`}
                      className="rounded-lg max-h-96 w-full object-cover"
                    />
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="flex gap-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id)}
                  className={post.liked ? "text-red-500" : ""}
                >
                  <Heart
                    className={`h-4 w-4 mr-2 ${
                      post.liked ? "fill-current" : ""
                    }`}
                  />
                  {post.likes}
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {post.comments}
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  {post.shares}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
