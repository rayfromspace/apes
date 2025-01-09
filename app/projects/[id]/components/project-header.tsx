'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal } from 'lucide-react'
import { useTeamStore } from "@/lib/stores/team-store"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProjectHeaderProps {
  name: string;
  type: 'product' | 'service';
  category: string;
  status: 'active' | 'archived' | 'deleted';
  visibility?: 'private' | 'public' | 'team';
}

export function ProjectHeader({ 
  name, 
  type,
  category,
  status, 
  visibility = 'private' 
}: ProjectHeaderProps) {
  const params = useParams()
  const projectId = params.id as string
  const { members, fetchMembers } = useTeamStore()
  const [showShareDialog, setShowShareDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (projectId) {
      fetchMembers(projectId)
    }
  }, [projectId, fetchMembers])

  // Get founder and active members
  const founder = members.find(m => m.role === 'founder')
  const activeMembers = members
    .filter(m => m.role !== 'founder' && m.status === 'active')
    .slice(0, 3)

  const handleShare = async (type: 'team' | 'investor') => {
    try {
      const baseUrl = window.location.origin
      const shareUrl = `${baseUrl}/projects/${projectId}/${type === 'team' ? 'join' : 'invest'}`
      await navigator.clipboard.writeText(shareUrl)
      
      const networks = {
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Join our project ${name} as ${type === 'team' ? 'a team member' : 'an investor'}!`)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      }

      window.open(networks.twitter, '_blank')
      
      toast({
        title: "Link copied!",
        description: `Share this link to invite ${type === 'team' ? 'team members' : 'investors'}.`,
      })
    } catch (err) {
      console.error('Failed to share:', err)
    }
  }

  return (
    <div className="border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">{name}</h2>
          <Badge variant={status === 'active' ? 'default' : 'secondary'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          <Badge variant="outline">{type}</Badge>
          <Badge variant="outline">{category}</Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {founder && (
              <Avatar className="border-2 border-background">
                <AvatarFallback>{founder.name[0]}</AvatarFallback>
              </Avatar>
            )}
            {activeMembers.map((member) => (
              <Avatar key={member.id} className="border-2 border-background">
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowShareDialog(true)}
          >
            Share
          </Button>
          
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Project</DialogTitle>
            <DialogDescription>
              Choose how you want to share your project
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="team" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="team">Team Members</TabsTrigger>
              <TabsTrigger value="investor">Investors</TabsTrigger>
            </TabsList>
            <TabsContent value="team" className="space-y-4">
              <div className="text-sm">
                Share this project to recruit new team members. They'll be able to apply to join your project.
              </div>
              <Button onClick={() => handleShare('team')} className="w-full">
                Share for Team Members
              </Button>
            </TabsContent>
            <TabsContent value="investor" className="space-y-4">
              <div className="text-sm">
                Share this project to attract investors. They'll be able to view your project details and contact you.
              </div>
              <Button onClick={() => handleShare('investor')} className="w-full">
                Share for Investors
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
