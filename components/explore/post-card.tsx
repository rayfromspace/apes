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
import { Comment, Post } from "@/types/explore";
import { cn } from "@/lib/utils";

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
  const [showComments, setShowComments] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [bookmarkCount, setBookmarkCount] = useState(post.bookmarks);
  const [shareCount, setShareCount] = useState(post.shares);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike();
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    setBookmarkCount(prev => isBookmarked ? prev - 1 : prev + 1);
    onBookmark();
  };

  const handleShare = () => {
    setShowShareDialog(true);
    setShareCount(prev => prev + 1);
    onShare();
  };

  const handleSubmitComment = () => {
    if (!comment.trim()) return;
    onComment(comment, replyTo || undefined);
    setComment("");
    setReplyTo(null);
  };

  const renderComment = (comment: Comment, depth = 0) => (
    <div
      key={comment.id}
      className={cn(
        "flex gap-3",
        depth > 0 && "ml-12 mt-2"
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.author.avatar} />
        <AvatarFallback>
          {comment.author.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="bg-muted p-3 rounded-lg">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="font-semibold">{comment.author.name}</span>
              <span className="text-sm text-muted-foreground ml-2">
                {comment.author.role}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {comment.timestamp}
            </span>
          </div>
          <p className="mt-1">{comment.content}</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <button
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setReplyTo(comment.id)}
          >
            Reply
          </button>
          <button
            className={cn(
              "flex items-center gap-1",
              comment.likes > 0 && "text-primary"
            )}
          >
            <Heart className="h-4 w-4" />
            {comment.likes}
          </button>
        </div>
        {comment.replies?.map(reply =>
          renderComment(reply, depth + 1)
        )}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <Avatar>
          <AvatarImage src={post.author.avatar} />
          <AvatarFallback>
            {post.author.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{post.author.name}</div>
              <div className="text-sm text-muted-foreground">
                {post.author.role} · {post.timestamp}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Copy Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {post.topics.map(topic => (
              <Badge key={topic} variant="secondary">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{post.content}</p>
        {post.image && (
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={post.image}
              alt="Post image"
              fill
              className="object-cover"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "transition-all duration-200 hover:scale-110",
                isLiked ? "text-red-500 hover:text-red-600" : "hover:text-red-500"
              )}
              onClick={handleLike}
            >
              <Heart className={cn("h-4 w-4 mr-2", isLiked && "fill-current")} />
              {likeCount}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="transition-all duration-200 hover:scale-110 hover:text-blue-500"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {post.comments.length}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "transition-all duration-200 hover:scale-110",
                isBookmarked ? "text-yellow-500 hover:text-yellow-600" : "hover:text-yellow-500"
              )}
              onClick={handleBookmark}
            >
              <Bookmark className={cn("h-4 w-4 mr-2", isBookmarked && "fill-current")} />
              {bookmarkCount}
            </Button>
          </div>
          <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="transition-all duration-200 hover:scale-110 hover:text-green-500"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                {shareCount}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Post</DialogTitle>
                <DialogDescription>
                  Share this post with your network
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setShowShareDialog(false);
                  }}
                >
                  <LinkIcon className="h-4 w-4" />
                  Copy Link
                </Button>
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => {
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.content)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
                    setShowShareDialog(false);
                  }}
                >
                  <Share2 className="h-4 w-4" />
                  Share on Twitter
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {showComments && (
          <div className="w-full space-y-4">
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/user.jpg" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder={
                    replyTo
                      ? "Write a reply..."
                      : "Write a comment..."
                  }
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    {replyTo && (
                      <Button
                        variant="ghost"
                        onClick={() => setReplyTo(null)}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button onClick={handleSubmitComment}>
                      <Send className="h-4 w-4 mr-2" />
                      {replyTo ? "Reply" : "Comment"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {post.comments.map(comment =>
                renderComment(comment)
              )}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}