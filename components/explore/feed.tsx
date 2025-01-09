"use client";

import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatePost } from "@/components/explore/create-post";
import { PostCard } from "@/components/explore/post-card";
import { ProjectCard } from "@/components/projects/list/project-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useSocialStore } from "@/lib/stores/social-store";

export const TOPICS = [
  { id: "tech", name: "Technology", icon: "💻" },
  { id: "defi", name: "DeFi", icon: "💰" },
  { id: "ai", name: "Artificial Intelligence", icon: "🤖" },
  { id: "web3", name: "Web3", icon: "🌐" },
  { id: "dev", name: "Development", icon: "⚡" },
  { id: "research", name: "Research", icon: "🔬" },
];

export function ExploreFeed() {
  const { posts, isLoading, error, fetchPosts, selectedTopic, setSelectedTopic } = useSocialStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic === 'all' ? null : topic);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Select value={selectedTopic || 'all'} onValueChange={handleTopicChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>
            {TOPICS.map((topic) => (
              <SelectItem key={topic.id} value={topic.id}>
                {topic.icon} {topic.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="feed" className="space-y-4">
        <TabsList>
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          <CreatePost />
          
          {isLoading ? (
            <div className="text-center py-4">Loading posts...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-4">No posts found</div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onComment={(content, parentId) => useSocialStore.getState().addComment(post.id, content, parentId)}
                  onLike={() => post.isLiked ? useSocialStore.getState().unlikePost(post.id) : useSocialStore.getState().likePost(post.id)}
                  onBookmark={() => post.isBookmarked ? useSocialStore.getState().unbookmarkPost(post.id) : useSocialStore.getState().bookmarkPost(post.id)}
                  onShare={() => {}} // TODO: Implement share functionality
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Projects</h2>
          </div>
          <div className="grid gap-6">
            {/* Project cards will be populated here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}