"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Heart, MessageSquare, Share2, Bookmark } from "lucide-react"
import { cn } from "@/lib/utils"

interface PostActionsProps {
  id: string
  likes: number
  commentsCount: number
  isLiked: boolean
  isSaved: boolean
  onLike: (id: string) => void
  onComment: (id: string) => void
  onShare: (id: string) => void
  onSave: (id: string) => void
}

export function PostActions({
  id,
  likes,
  commentsCount,
  isLiked,
  isSaved,
  onLike,
  onComment,
  onShare,
  onSave,
}: PostActionsProps) {
  return (
    <div className="flex items-center justify-between pt-4 border-t">
      <div className="flex gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onLike(id)}
          className={cn(
            "group transition-colors",
            isLiked && "text-red-500"
          )}
        >
          <Heart className={cn(
            "mr-2 h-4 w-4 transition-colors",
            isLiked ? "fill-current" : "group-hover:fill-red-500/20"
          )} />
          {likes}
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onComment(id)}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          {commentsCount}
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onShare(id)}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onSave(id)}
        className={cn(
          "group transition-colors",
          isSaved && "text-primary"
        )}
      >
        <Bookmark className={cn(
          "mr-2 h-4 w-4 transition-colors",
          isSaved && "fill-current"
        )} />
        {isSaved ? "Saved" : "Save"}
      </Button>
    </div>
  )
}