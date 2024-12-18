"use client"

import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"

interface UserAvatarProps {
  user: {
    id: string
    name?: string | null
    avatar?: string | null
    role?: string | null
  }
  showHoverCard?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-20 w-20'
}

export function UserAvatar({ user, showHoverCard = true, size = 'md' }: UserAvatarProps) {
  const avatarComponent = (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={user.avatar || ''} alt={user.name || 'User'} />
      <AvatarFallback>
        {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
      </AvatarFallback>
    </Avatar>
  )

  if (!showHoverCard) {
    return (
      <Link href={`/profile/${user.id}`} className="hover:opacity-80 transition-opacity">
        {avatarComponent}
      </Link>
    )
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link href={`/profile/${user.id}`} className="hover:opacity-80 transition-opacity">
          {avatarComponent}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar || ''} />
            <AvatarFallback>
              {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{user.name}</h4>
            {user.role && (
              <p className="text-sm text-muted-foreground">
                {user.role}
              </p>
            )}
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link href={`/profile/${user.id}`}>
                View Profile
              </Link>
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
