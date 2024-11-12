"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Image from "next/image"
import { CommentSection } from "./comment-section"
import { PostActions } from "./post-actions"
import { ContentItem } from "@/types/content"

const contentItems: ContentItem[] = [
  {
    id: "1",
    type: "post",
    content: "Just launched our new AI-powered marketing automation tool! After months of development and testing, we're excited to share this with the community. Check out the demo and let me know your thoughts. 🚀",
    author: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&q=60",
      role: "Product Manager",
    },
    likes: 89,
    comments: [
      {
        id: "c1",
        author: {
          name: "Alex Thompson",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&q=60",
        },
        content: "This looks amazing! Can't wait to try it out.",
        timestamp: "2 hours ago"
      }
    ],
    views: 543,
    tags: ["Launch", "AI", "Marketing"],
    publishedAt: "2024-03-14",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
  }
]

export function ContentFeed() {
  const [likedPosts, setLikedPosts] = useState<string[]>([])
  const [savedPosts, setSavedPosts] = useState<string[]>([])
  const [items, setItems] = useState(contentItems)
  const [showComments, setShowComments] = useState<string[]>([])

  const handleLike = (id: string) => {
    setLikedPosts(prev => {
      const isLiked = prev.includes(id)
      const newLikedPosts = isLiked 
        ? prev.filter(postId => postId !== id)
        : [...prev, id]
      
      setItems(items => 
        items.map(item => 
          item.id === id 
            ? { ...item, likes: item.likes + (isLiked ? -1 : 1) }
            : item
        )
      )

      toast.success(isLiked ? "Like removed" : "Post liked")
      return newLikedPosts
    })
  }

  const handleSave = (id: string) => {
    setSavedPosts(prev => {
      const isSaved = prev.includes(id)
      const newSavedPosts = isSaved
        ? prev.filter(postId => postId !== id)
        : [...prev, id]
      
      toast.success(isSaved ? "Removed from saved" : "Added to saved")
      return newSavedPosts
    })
  }

  const handleShare = (id: string) => {
    toast.success("Share dialog opened")
  }

  const toggleComments = (id: string) => {
    setShowComments(prev => 
      prev.includes(id) 
        ? prev.filter(postId => postId !== id)
        : [...prev, id]
    )
  }

  const handleAddComment = (postId: string, comment: string) => {
    setItems(items =>
      items.map(item => {
        if (item.id === postId) {
          const newComment = {
            id: `c${Date.now()}`,
            author: {
              name: "Current User",
              avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&q=60",
            },
            content: comment,
            timestamp: "Just now"
          }
          return {
            ...item,
            comments: [...item.comments, newComment]
          }
        }
        return item
      })
    )
    toast.success("Comment added")
  }

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-start gap-4">
            <Avatar>
              <AvatarImage src={item.author.avatar} alt={item.author.name} />
              <AvatarFallback>{item.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.author.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.author.role} • {new Date(item.publishedAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {item.type}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-4">
              <p className="text-lg">{item.content}</p>
              {item.image && (
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt="Post image"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="hover:bg-primary/10 cursor-pointer">
                  {tag}
                </Badge>
              ))}
            </div>

            <PostActions
              id={item.id}
              likes={item.likes}
              commentsCount={item.comments.length}
              isLiked={likedPosts.includes(item.id)}
              isSaved={savedPosts.includes(item.id)}
              onLike={handleLike}
              onComment={toggleComments}
              onShare={handleShare}
              onSave={handleSave}
            />

            {showComments.includes(item.id) && (
              <CommentSection
                comments={item.comments}
                postId={item.id}
                onAddComment={handleAddComment}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}