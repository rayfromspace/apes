'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format } from 'date-fns'
import { useMilestoneStore } from '@/lib/stores/milestones'

interface CreateMilestoneDialogProps {
  projectId: string
  onClose: () => void
}

export function CreateMilestoneDialog({ projectId, onClose }: CreateMilestoneDialogProps) {
  const { createMilestone } = useMilestoneStore()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    status: 'upcoming' as const
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    await createMilestone({
      title: formData.title,
      description: formData.description,
      date: new Date(formData.date).toISOString(),
      status: formData.status,
      projectId
    })

    onClose()
  }

  return (
    <DialogContent>
      <form onSubmit={handleSubmit}>
      <DialogHeader>
  <DialogTitle>Create New Milestone</DialogTitle>
  <DialogDescription>
    Add a new milestone to track important project dates and achievements.
  </DialogDescription>
</DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter milestone title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add milestone description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Target Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create Milestone</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
