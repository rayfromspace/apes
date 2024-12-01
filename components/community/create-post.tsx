"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function CreatePost() {
  const [content, setContent] = useState("");
  const { user } = useAuth();

  const handleSubmit = () => {
    // Handle post creation
    setContent("");
  };

  return (
    <Card className="p-4 mb-6">
      <div className="flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mb-4"
          />
          <div className="flex justify-between items-center">
            <Button variant="outline" size="icon">
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button onClick={handleSubmit} disabled={!content.trim()}>
              Post
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}