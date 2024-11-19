import { Button } from "@/components/ui/button"
import { FileText, FolderKanban, MessageSquare, Plus } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ContentCreation() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/dashboard/projects/new" className="flex items-center">
            <FolderKanban className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/content/article" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Write Article
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/content/post" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Create Post
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}