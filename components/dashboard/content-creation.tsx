import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, FolderKanban, MessageSquare, Plus } from "lucide-react"
import Link from "next/link"

const contentTypes = [
  {
    title: "New Project",
    description: "Start a new digital business project",
    icon: FolderKanban,
    href: "/dashboard/projects/new",
  },
  {
    title: "Write Article",
    description: "Share your knowledge and insights",
    icon: FileText,
    href: "/dashboard/content/article",
  },
  {
    title: "Create Post",
    description: "Share updates with the community",
    icon: MessageSquare,
    href: "/dashboard/content/post",
  },
]

export function ContentCreation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Content</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {contentTypes.map((type) => (
            <Card key={type.title} className="cursor-pointer hover:bg-accent">
              <CardContent className="p-4">
                <Link href={type.href} className="space-y-3">
                  <div className="flex justify-center">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <type.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-1.5 text-center">
                    <h4 className="font-semibold">{type.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {type.description}
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}