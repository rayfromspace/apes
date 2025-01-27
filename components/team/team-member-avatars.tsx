"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState, useCallback } from "react"

interface TeamMember {
  id: string
  user: {
    id: string
    email: string
    raw_user_meta_data?: {
      full_name?: string
      avatar_url?: string
    }
  }
}

interface TeamMemberAvatarsProps {
  projectId: string
  maxDisplay?: number
}

export function TeamMemberAvatars({ projectId, maxDisplay = 3 }: TeamMemberAvatarsProps) {
  const [members, setMembers] = useState<TeamMember[]>([])
  const supabase = createClientComponentClient()

  const fetchTeamMembers = useCallback(async () => {
    try {
      const { data: members, error } = await supabase
        .from('team_members')
        .select(`
          id,
          user:user_id (
            id,
            email,
            raw_user_meta_data
          )
        `)
        .eq('project_id', projectId)
        .limit(maxDisplay + 1)

      if (error) {
        console.error('Error fetching team members:', error)
        return
      }

      setMembers(members || [])
    } catch (error) {
      console.error('Error in fetchTeamMembers:', error)
    }
  }, [projectId, maxDisplay, supabase])

  useEffect(() => {
    fetchTeamMembers()

    // Set up realtime subscription
    const channel = supabase
      .channel(`team_members_${projectId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'team_members',
        filter: `project_id=eq.${projectId}`
      }, () => {
        fetchTeamMembers()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId, fetchTeamMembers])

  const displayMembers = members.slice(0, maxDisplay)
  const remainingCount = Math.max(0, members.length - maxDisplay)

  return (
    <div className="flex -space-x-2">
      {displayMembers.map((member) => (
        <HoverCard key={member.id}>
          <HoverCardTrigger>
            <Avatar className="h-8 w-8 border-2 border-background">
              <AvatarImage 
                src={member.user.raw_user_meta_data?.avatar_url} 
                alt={member.user.raw_user_meta_data?.full_name || member.user.email} 
              />
              <AvatarFallback>
                {(member.user.raw_user_meta_data?.full_name?.[0] || member.user.email[0]).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex justify-between space-x-4">
              <Avatar>
                <AvatarImage src={member.user.raw_user_meta_data?.avatar_url} />
                <AvatarFallback>
                  {(member.user.raw_user_meta_data?.full_name?.[0] || member.user.email[0]).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">
                  {member.user.raw_user_meta_data?.full_name || 'Team Member'}
                </h4>
                <p className="text-sm text-muted-foreground">{member.user.email}</p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
      {remainingCount > 0 && (
        <Avatar className="h-8 w-8 border-2 border-background">
          <AvatarFallback>+{remainingCount}</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
