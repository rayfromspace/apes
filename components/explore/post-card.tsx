"use client"

import Image from 'next/image'
import { Card } from "@/components/ui/card"
import { UserAvatar } from '@/components/shared/user-avatar'
import { Heart, MessageCircle, Share2 } from 'lucide-react'

interface PostCardProps {
  post: {
    author: {
      id: string
      name: string
      avatar: string
      role: string
    }
    content: string
    image?: string
    timestamp: string
    likes: number
    comments: number
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="mb-6">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <UserAvatar user={post.author} />
          <div>
            <div className="font-semibold">{post.author.name}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>{post.author.role}</span>
              <span>•</span>
              <span>{post.timestamp}</span>
            </div>
          </div>
        </div>

        <p className="mb-4">{post.content}</p>

        {post.image && (
          <div className="relative h-[300px] rounded-lg overflow-hidden mb-4">
            <Image
              src={post.image}
              alt="Post image"
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <Heart className="h-4 w-4" />
            {post.likes}
          </button>
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <MessageCircle className="h-4 w-4" />
            {post.comments}
          </button>
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>
    </Card>
  )
}