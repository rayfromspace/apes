'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Plus, Loader2, RefreshCw, Briefcase } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { NewProjectDialog } from '@/components/dashboard/dialogs/new-project-dialog'
import { ProjectList } from '@/components/projects/list/project-list'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

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
    user: {
      email: string
    }
  }>
}

const POLLING_INTERVAL = 60000; // 1 minute in milliseconds

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const supabase = createClientComponentClient()

  const loadProjects = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      console.log('Loading projects for user:', session.user.id);
      
      // Get projects where user is founder
      const { data: founderProjects, error: founderError } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          description,
          type,
          category,
          status,
          visibility,
          founder_id,
          image_url,
          created_at,
          team_members (
            id,
            role,
            user_id,
            user:user_id (
              email
            )
          )
        `)
        .eq('founder_id', session.user.id)
        .order('created_at', { ascending: false });

      if (founderError) {
        throw founderError;
      }

      // Get projects where user is team member
      const { data: teamProjects, error: teamError } = await supabase
        .from('team_members')
        .select('project_id')
        .eq('user_id', session.user.id);

      if (teamError) {
        throw teamError;
      }

      // Get the full project details for team projects
      let teamProjectsDetails = [];
      if (teamProjects && teamProjects.length > 0) {
        const projectIds = teamProjects.map(tm => tm.project_id);
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .in('id', projectIds)
          .order('created_at', { ascending: false });

        if (projectsError) {
          throw projectsError;
        } else {
          teamProjectsDetails = projects || [];
        }
      }

      // Combine and deduplicate projects
      const allProjects = [...(founderProjects || []), ...teamProjectsDetails];
      const uniqueProjects = Array.from(new Map(allProjects.map(project => [project.id, project])).values());
      
      console.log('Loaded projects:', uniqueProjects);
      setProjects(uniqueProjects);
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false);
      if (isManualRefresh) {
        setRefreshing(false);
      }
    }
  }

  useEffect(() => {
    loadProjects();
    // Set up polling interval
    const interval = setInterval(() => {
      loadProjects();
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
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
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => loadProjects(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow group">
            <CardHeader className="relative p-0">
              <div className="aspect-video w-full relative overflow-hidden rounded-t-lg">
                {project.image_url ? (
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <Briefcase className="h-12 w-12 text-primary/40" />
                  </div>
                )}
              </div>
              <div className="p-6">
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
                  <Badge variant="outline" className="capitalize">
                    {project.type}
                  </Badge>
                  <Badge variant="secondary">
                    {project.category}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.team_members?.map((member) => (
                  <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                    <AvatarFallback>
                      {member.user?.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                <span className="capitalize">{project.status || 'Active'}</span>
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
