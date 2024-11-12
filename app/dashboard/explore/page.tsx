"use client"

import { ExploreHeader } from "@/components/explore/explore-header"
import { ProjectShowcase } from "@/components/explore/project-showcase"
import { PopularProjects } from "@/components/explore/popular-projects"
import { UserProfiles } from "@/components/explore/user-profiles"
import { ContentFeed } from "@/components/explore/content-feed"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ExplorePage() {
  return (
    <div className="container py-6 space-y-8">
      <ExploreHeader />
      
      <Tabs defaultValue="content" className="space-y-6">
        <TabsList>
          <TabsTrigger value="content">Posts & Articles</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-6">
          <ContentFeed />
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <ProjectShowcase />
        </TabsContent>
        
        <TabsContent value="popular" className="space-y-6">
          <PopularProjects />
        </TabsContent>
        
        <TabsContent value="users" className="space-y-6">
          <UserProfiles />
        </TabsContent>
      </Tabs>
    </div>
  )
}