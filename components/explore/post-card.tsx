"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  MoreVertical,
  Send,
  Image as ImageIcon,
  Link as LinkIcon,
  Flag,
} from "lucide-react";
import Image from "next/image";
import { Post } from "@/lib/stores/social-store";
import { cn } from "@/lib/utils";
import { TOPICS } from "./feed";

interface PostCardProps {
  post: Post;
  onComment: (content: string, parentId?: string) => void;
  onLike: () => void;
  onBookmark: () => void;
  onShare: () => void;
}

export function PostCard({
  post,
  onComment,
  onLike,
  onBookmark,
  onShare,
}: PostCardProps) {
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onComment(commentText.trim());
      setCommentText("");
      setIsCommenting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks}w ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths}mo ago`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears}y ago`;
  };

  const topicDetails = post.topics?.map(topicId => 
    TOPICS.find(t => t.id === topicId)
  ).filter(Boolean);

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={post.author?.avatar_url} />
              <AvatarFallback>{post.author?.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{post.author?.name}</div>
              <div className="text-sm text-muted-foreground">{post.author?.role}</div>
              <div className="text-xs text-muted-foreground">{formatDate(post.created_at)}</div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <LinkIcon className="mr-2 h-4 w-4" /> Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Flag className="mr-2 h-4 w-4" /> Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <p className="text-sm">{post.content}</p>
          {post.image_url && (
            <div className="mt-4 relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={post.image_url}
                alt="Post image"
                fill
                className="object-cover"
              />
            </div>
          )}
          {topicDetails && topicDetails.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {topicDetails.map((topic, index) => topic && (
                <Badge key={index} variant="secondary">
                  {topic.icon} {topic.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-muted-foreground">
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex items-center space-x-2",
                post.isLiked && "text-red-500"
              )}
              onClick={onLike}
            >
              <Heart className={cn("h-4 w-4", post.isLiked && "fill-current")} />
              <span>{post.likes_count}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
              onClick={() => setIsCommenting(!isCommenting)}
            >
              <MessageSquare className="h-4 w-4" />
              <span>{post.comments_count}</span>
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex items-center space-x-2",
                post.isBookmarked && "text-primary"
              )}
              onClick={onBookmark}
            >
              <Bookmark className={cn("h-4 w-4", post.isBookmarked && "fill-current")} />
              <span>{post.bookmarks_count}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4" />
              <span>{post.shares_count}</span>
            </Button>
          </div>
        </div>
      </CardContent>
      {isCommenting && (
        <CardFooter className="block space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={post.author?.avatar_url} />
              <AvatarFallback>{post.author?.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex justify-between items-center">
                <Button variant="ghost" size="sm">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}