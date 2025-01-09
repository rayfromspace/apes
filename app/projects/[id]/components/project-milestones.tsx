'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Diamond } from 'lucide-react'
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { useMilestoneStore } from "@/lib/stores/milestones"
import { CreateMilestoneDialog } from "./milestones/create-milestone-dialog"
import { Skeleton } from "@/components/ui/skeleton"

interface ProjectMilestonesProps {
  projectId: string
}

export function ProjectMilestones({ projectId }: ProjectMilestonesProps) {
  const { milestones, loading, error, fetchMilestones, formatMilestoneDate, setupRealtimeSubscription } = useMilestoneStore()
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    if (projectId) {
      fetchMilestones(projectId)
      // Set up real-time subscription
      const unsubscribe = setupRealtimeSubscription(projectId)
      return () => {
        unsubscribe()
      }
    }
  }, [projectId, fetchMilestones, setupRealtimeSubscription])

  const handleCreateMilestone = () => {
    setShowCreateDialog(true)
  }

  const handleCloseDialog = () => {
    setShowCreateDialog(false)
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-red-500">
            Failed to load milestones. Please try again later.
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading && milestones.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Milestones</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-7 w-7 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Milestones</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative space-y-6 before:absolute before:inset-y-0 before:left-[14px] before:w-[2px] before:bg-muted">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="flex gap-4">
              <div
                className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                  milestone.status === "completed"
                    ? "border-primary bg-primary text-primary-foreground"
                    : milestone.status === "current"
                    ? "border-primary bg-background text-primary"
                    : "border-muted bg-background"
                }`}
              >
                <Diamond className="h-4 w-4" />
              </div>
              <div className="flex-1 pt-0.5">
                <div className="font-medium">{milestone.title}</div>
                <div className="text-sm text-muted-foreground">
                  {formatMilestoneDate(milestone.date)}
                </div>
                {milestone.description && (
                  <div className="mt-1 text-sm text-muted-foreground">
                    {milestone.description}
                  </div>
                )}
              </div>
            </div>
          ))}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full" onClick={handleCreateMilestone}>
                Add milestone
              </Button>
            </DialogTrigger>
            {showCreateDialog && (
              <CreateMilestoneDialog
                projectId={projectId}
                onClose={handleCloseDialog}
              />
            )}
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
