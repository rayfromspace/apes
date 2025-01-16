"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface ProjectSettingsProps {
  project: {
    id: string
    title: string
    github_url?: string
    live_url?: string
    visibility: 'private' | 'public' | 'team'
  }
}

export function ProjectSettings({ project }: ProjectSettingsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [formData, setFormData] = React.useState({
    github_url: project.github_url || '',
    live_url: project.live_url || '',
    visibility: project.visibility
  })

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          github_url: formData.github_url.trim() || null,
          live_url: formData.live_url.trim() || null,
          visibility: formData.visibility
        })
        .eq('id', project.id)

      if (error) throw error

      toast({
        title: "Settings saved",
        description: "Your project settings have been updated successfully."
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id)

      if (error) throw error

      toast({
        title: "Project deleted",
        description: "Your project has been deleted successfully."
      })

      router.push('/dashboard/projects')
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Settings</CardTitle>
          <CardDescription>
            Manage your project's visibility and external links
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub Repository</Label>
            <Input
              id="github_url"
              placeholder="https://github.com/username/repo"
              value={formData.github_url}
              onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="live_url">Live URL</Label>
            <Input
              id="live_url"
              placeholder="https://your-project.com"
              value={formData.live_url}
              onChange={(e) => setFormData(prev => ({ ...prev, live_url: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibility">Project Visibility</Label>
            <Select
              value={formData.visibility}
              onValueChange={(value: 'private' | 'public' | 'team') => 
                setFormData(prev => ({ ...prev, visibility: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">
                  Private - Only visible to you
                </SelectItem>
                <SelectItem value="team">
                  Team - Visible to team members
                </SelectItem>
                <SelectItem value="public">
                  Public - Visible to everyone
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isLoading}
            >
              Delete Project
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              "{project.title}" and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
