"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus, Save } from "lucide-react"
import { toast } from "sonner"

export function PostEditor() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const handleSave = () => {
    // Here you would typically save the post to your backend
    toast.success("Post saved successfully")
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-lg font-semibold"
      />
      
      <div className="border rounded-md p-2">
        <Button variant="outline" size="sm" className="mb-2">
          <ImagePlus className="h-4 w-4 mr-2" />
          Add Image
        </Button>
        
        <Textarea
          placeholder="Write your post content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[300px] resize-none"
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Post
        </Button>
      </div>
    </div>
  )
}