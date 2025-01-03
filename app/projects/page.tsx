'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Plus, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { NewProjectDialog } from '@/components/dashboard/new-project-dialog'

interface Project {
  id: string
  title: string
  description: string
  type: string
  category: string
  status: string
  visibility: string
  founder_id: string
  image_url?: string
  created_at: string
  team_members: Array<{
    id: string
    role: string
    user_id: string
    users: {
      email: string
    }
  }>
}

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function loadProjects() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push('/login')
          return
        }

        const { data: projects, error } = await supabase
          .from('projects')
          .select(`
            *,
            team_members (
              id,
              role,
              user_id,
              users:user_id (
                email
              )
            )
          `)
          .order('created_at', { ascending: false })

        if (error) {
          throw error
        }

        setProjects(projects || [])
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your projects and collaborations</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="relative">
              {project.image_url ? (
                <div className="absolute inset-0 bg-cover bg-center rounded-t-lg" style={{ backgroundImage: `url(${project.image_url})` }} />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-t-lg" />
              )}
              <div className="relative">
                <CardTitle className="text-xl mb-2">
                  <button 
                    onClick={() => router.push(`/projects/${project.id}`)}
                    className="hover:underline text-left"
                  >
                    {project.title}
                  </button>
                </CardTitle>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium capitalize">{project.type}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="text-sm text-muted-foreground">{project.category}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.team_members.map((member) => (
                  <Avatar key={member.id} className="h-8 w-8">
                    <AvatarFallback>
                      {member.users.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                <span className="capitalize">{project.status}</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <NewProjectDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
