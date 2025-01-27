"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent } from "@/components/ui/card"

interface ProjectInfoDialogProps {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ProjectInfo {
  title: string
  description: string
  category: string
  type: string
  visibility: "public" | "private"
}

export function ProjectInfoDialog({ projectId, open, onOpenChange }: ProjectInfoDialogProps) {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (open) {
      fetchProjectInfo()
    }
  }, [open])

  const fetchProjectInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('title, description, category, type, visibility')
        .eq('id', projectId)
        .single()

      if (error) throw error

      if (data) {
        setProjectInfo(data)
      }
    } catch (error) {
      console.error('Error fetching project info:', error)
    }
  }

  if (!projectInfo) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Project Information</DialogTitle>
          <DialogDescription>
            View project details
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-1.5">
            <h3 className="text-sm font-semibold">Title</h3>
            <p className="text-sm text-muted-foreground">
              {projectInfo.title}
            </p>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-semibold">Description</h3>
            <p className="text-sm text-muted-foreground">
              {projectInfo.description}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold">Category</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {projectInfo.category}
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold">Type</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {projectInfo.type}
              </p>
            </div>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-semibold">Visibility</h3>
            <p className="text-sm text-muted-foreground capitalize">
              {projectInfo.visibility}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
