"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export function ArticleEditor() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isPublishing, setIsPublishing] = useState(false)

  const handlePublish = async () => {
    if (!title || !content) {
      toast.error("Please fill in all fields")
      return
    }

    setIsPublishing(true)
    try {
      // TODO: Implement article publishing
      toast.success("Article published successfully")
    } catch (error) {
      toast.error("Failed to publish article")
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Article Editor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter article title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Write your article content..."
            className="min-h-[300px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handlePublish} 
          disabled={isPublishing}
          className="ml-auto"
        >
          {isPublishing ? "Publishing..." : "Publish Article"}
        </Button>
      </CardFooter>
    </Card>
  )
}