"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Switch } from "@/components/ui/switch"
import { Copy, Check } from "lucide-react"

interface ShareDialogProps {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareDialog({ projectId, open, onOpenChange }: ShareDialogProps) {
  const [loading, setLoading] = useState(false)
  const [visibility, setVisibility] = useState("private")
  const [copied, setCopied] = useState(false)
  const [shareLink, setShareLink] = useState("")
  const [allowComments, setAllowComments] = useState(true)
  const supabase = createClientComponentClient()

  const generateShareLink = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('project_shares')
        .insert([
          {
            project_id: projectId,
            visibility,
            allow_comments: allowComments,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
          }
        ])
        .select('id')
        .single()

      if (error) throw error

      const link = `${window.location.origin}/share/${data.id}`
      setShareLink(link)
    } catch (error) {
      console.error('Error generating share link:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Project</DialogTitle>
          <DialogDescription>
            Configure sharing settings and generate a link.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility</Label>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private Link</SelectItem>
                <SelectItem value="public">Public Link</SelectItem>
                <SelectItem value="team">Team Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="comments">Allow Comments</Label>
              <div className="text-sm text-muted-foreground">
                Let viewers comment on the project
              </div>
            </div>
            <Switch
              id="comments"
              checked={allowComments}
              onCheckedChange={setAllowComments}
            />
          </div>
          {!shareLink && (
            <Button 
              onClick={generateShareLink} 
              disabled={loading}
              className="w-full"
            >
              {loading ? "Generating..." : "Generate Share Link"}
            </Button>
          )}
          {shareLink && (
            <div className="space-y-2">
              <Label htmlFor="link">Share Link</Label>
              <div className="flex space-x-2">
                <Input
                  id="link"
                  value={shareLink}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
