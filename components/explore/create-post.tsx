"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useSocialStore } from "@/lib/stores/social-store";
import { TOPICS } from "./feed";
import { useUser } from "@/lib/hooks/use-user";

export function CreatePost({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createPost } = useSocialStore();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    try {
      await createPost(content, image || undefined, selectedTopics);
      setContent("");
      setSelectedTopics([]);
      setImage(null);
      setImagePreview(null);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>{user?.user_metadata?.name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <Textarea
              placeholder="Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px]"
            />
            
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

            {imagePreview && (
              <div className="relative">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={imagePreview}
                    alt="Selected image"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="flex justify-between items-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageSelect}
              />
              <Button
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Add Image
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!content.trim()}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}