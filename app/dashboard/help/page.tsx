"use client"

import { HelpCategories } from "@/components/help/help-categories"
import { HelpSearch } from "@/components/help/help-search"
import { HelpArticles } from "@/components/help/help-articles"

export default function HelpPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-3xl font-bold">Help Center</h1>
        <p className="text-muted-foreground">Find answers and support for Colab Apes</p>
        <HelpSearch />
      </div>
      <HelpCategories />
      <HelpArticles />
    </div>
  )
}