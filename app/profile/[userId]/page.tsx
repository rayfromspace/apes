"use client"

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { UserAvatar } from '@/components/shared/user-avatar'
import { 
  Github, 
  Globe, 
  Linkedin, 
  MapPin, 
  Twitter,
  MessageSquare,
  UserPlus,
  Users
} from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  role?: string
  bio?: string
  location?: string
  company?: string
  position?: string
  website?: string
  github?: string
  twitter?: string
  linkedin?: string
  skills?: string[]
  projects?: {
    id: string
    name: string
    status: string
  }[]
  stats?: {
    followers: number
    following: number
    projects: number
  }
}

export default function ProfilePage() {
  const params = useParams()
  const userId = params.userId as string

  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }
      return response.json()
    }
  })

  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (!profile) {
    return <div>User not found</div>
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Profile Header */}
      <Card>
        <CardHeader className="relative pb-24">
          <div className="absolute inset-0 h-32 bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-lg" />
          <div className="relative z-10 flex items-center gap-6 pt-4">
            <UserAvatar 
              user={profile} 
              size="lg"
              showHoverCard={false}
            />
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
              {profile.role && (
                <p className="text-blue-50">{profile.role}</p>
              )}
            </div>
            <div className="ml-auto space-x-2">
              <Button size="sm" variant="secondary">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button size="sm" variant="secondary">
                <UserPlus className="h-4 w-4 mr-2" />
                Follow
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-[-4rem]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - About */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">About</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.bio && (
                    <p className="text-sm text-muted-foreground">{profile.bio}</p>
                  )}
                  
                  {(profile.company || profile.position) && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.position} at {profile.company}</span>
                    </div>
                  )}

                  {profile.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.location}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    {profile.github && (
                      <a
                        href={`https://github.com/${profile.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                    {profile.twitter && (
                      <a
                        href={`https://twitter.com/${profile.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {profile.linkedin && (
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                    {profile.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Globe className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>

              {profile.skills && profile.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Skills</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Tabs Content */}
            <div className="md:col-span-2">
              <Tabs defaultValue="projects">
                <TabsList>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="contributions">Contributions</TabsTrigger>
                </TabsList>
                <TabsContent value="projects" className="space-y-4">
                  {profile.projects?.map((project) => (
                    <Card key={project.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{project.name}</h4>
                          <Badge>{project.status}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
                <TabsContent value="activity">
                  Activity feed coming soon...
                </TabsContent>
                <TabsContent value="contributions">
                  Contributions coming soon...
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="relative pb-24">
          <div className="absolute inset-0 h-32 bg-gradient-to-r from-blue-600/20 to-blue-400/20 rounded-t-lg" />
          <div className="relative z-10 flex items-center gap-6 pt-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-[-4rem]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2">
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
