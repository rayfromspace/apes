"use client"

import React, { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { Comment } from "@/types/content"

interface CommentSectionProps {
  comments: Comment[]
  postId: string
  onAddComment: (postId: string, comment: string) => void
}

export function CommentSection({ comments, postId, onAddComment }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    onAddComment(postId, newComment)
    setNewComment("")
  }

  return (
    <div className="space-y-4 pt-4 border-t">
      {comments?.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
            <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="bg-muted p-3 rounded-lg">
              <p className="font-medium text-sm">{comment.author.name}</p>
              <p className="text-sm">{comment.content}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{comment.timestamp}</p>
          </div>
        </div>
      ))}
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}