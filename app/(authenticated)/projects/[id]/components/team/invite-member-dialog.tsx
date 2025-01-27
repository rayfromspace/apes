"use client"

import { useState } from "react"
import { Link2, X } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
import { useTeamStore, TeamPermission } from "@/lib/stores/team-store"

interface InviteMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
}

export function InviteMemberDialog({ open, onOpenChange, projectId }: InviteMemberDialogProps) {
  const [email, setEmail] = useState("")
  const [permission, setPermission] = useState<TeamPermission>("Editor")
  const { inviteMember, loading, error } = useTeamStore()

  const handleInvite = async () => {
    if (!email) return
    
    try {
      await inviteMember(projectId, email, permission)
      setEmail("")
      onOpenChange(false)
    } catch (err) {
      console.error("Failed to invite member:", err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite team member</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Select
              value={permission}
              onValueChange={(value) => setPermission(value as TeamPermission)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select permission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Project Admin">Project Admin</SelectItem>
                <SelectItem value="Editor">Editor</SelectItem>
                <SelectItem value="Viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button 
            className="w-full" 
            onClick={handleInvite}
            disabled={loading || !email}
          >
            {loading ? "Inviting..." : "Send invite"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
