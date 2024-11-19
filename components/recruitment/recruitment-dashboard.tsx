"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus, Briefcase } from "lucide-react"

export function RecruitmentDashboard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Recruitment</h2>
          <p className="text-muted-foreground">
            Post co-founder and job opportunities for your project
          </p>
        </div>
      </div>

      <Tabs defaultValue="co-founders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="co-founders">Co-Founders</TabsTrigger>
          <TabsTrigger value="jobs">Job Positions</TabsTrigger>
        </TabsList>

        <TabsContent value="co-founders" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Co-Founder Listings</CardTitle>
              <CardDescription>Create and manage co-founder recruitment posts</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Create Co-Founder Listing
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Job Listings</CardTitle>
              <CardDescription>Create and manage job position posts</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Button>
                <Briefcase className="mr-2 h-4 w-4" />
                Create Job Listing
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}