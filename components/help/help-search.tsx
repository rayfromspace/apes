"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function HelpSearch() {
  return (
    <div className="relative w-full max-w-2xl">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search help articles..."
        className="pl-10"
      />
    </div>
  )
}