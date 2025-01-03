"use client"

import { useState } from "react"
import { Link2, X } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface InviteMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const existingMembers = [
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    role: "Project admin",
    initials: "JD",
  },
  {
    name: "Karen Davis",
    email: "karendavis@gmail.com",
    role: "Project admin",
    initials: "KD",
  },
  {
    name: "Alice Lee",
    email: "alicelee@gmail.com",
    role: "Editor",
    initials: "AL",
  },
  {
    name: "Bob Miller",
    email: "bobmiller@gmail.com",
    role: "Viewer",
    initials: "BM",
  },
  {
    name: "Sara Smith",
    email: "sarasmith@gmail.com",
    role: "Viewer",
    initials: "SS",
  },
  {
    name: "Erica Moore",
    email: "ericamoore@gmail.com",
    role: "Viewer",
    initials: "EM",
  },
]

export function InviteMemberDialog({ open, onOpenChange }: InviteMemberDialogProps) {
  const [notifyOnTask, setNotifyOnTask] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle>Share project</DialogTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Link2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-4">
            <h3 className="font-medium">Invite Members</h3>
            <div className="flex gap-2">
              <Input placeholder="Email address" className="flex-1" />
              <Select defaultValue="editor">
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Button>Invite</Button>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notify"
                checked={notifyOnTask}
                onCheckedChange={(checked) => setNotifyOnTask(checked as boolean)}
              />
              <label
                htmlFor="notify"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Notify when tasks are added to the project
              </label>
            </div>
          </div>
          <div className="space-y-4">
            {existingMembers.map((member) => (
              <div
                key={member.email}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {member.email}
                    </div>
                  </div>
                </div>
                <Select defaultValue={member.role.toLowerCase()}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="project admin">Project admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View more
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
