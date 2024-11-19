import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface ProjectDiscussionProps {
  id: string
}

const comments = [
  {
    id: 1,
    user: {
      name: "John Doe",
      avatar: "/avatars/01.png",
      initials: "JD",
    },
    content: "Great progress on the MVP! The core features are looking solid.",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    user: {
      name: "Sarah Smith",
      avatar: "/avatars/02.png",
      initials: "SS",
    },
    content: "We should focus on optimizing the checkout process next.",
    timestamp: "5 hours ago",
  },
  {
    id: 3,
    user: {
      name: "Mike Johnson",
      avatar: "/avatars/03.png",
      initials: "MJ",
    },
    content: "I've pushed the latest backend changes. Ready for review.",
    timestamp: "1 day ago",
  },
]

export function ProjectDiscussion({ id }: ProjectDiscussionProps) {
  const [newComment, setNewComment] = useState("")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discussion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar>
                <AvatarImage src={comment.user.avatar} />
                <AvatarFallback>{comment.user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{comment.user.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {comment.timestamp}
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button className="w-full">Post Comment</Button>
        </div>
      </CardContent>
    </Card>
  )
}