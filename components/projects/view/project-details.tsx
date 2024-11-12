"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Target, Users } from "lucide-react"

interface ProjectDetailsProps {
  id: string
}

export function ProjectDetails({ id }: ProjectDetailsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">
              A comprehensive digital marketing platform that leverages AI to automate and optimize marketing campaigns across multiple channels.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Category</h3>
            <div className="flex gap-2">
              <Badge>Marketing</Badge>
              <Badge>SaaS</Badge>
              <Badge>AI</Badge>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Stage</h3>
            <Badge variant="outline">Development</Badge>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Project Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Team Size</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Target className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Progress</p>
              <Progress value={65} className="mt-2" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Timeline</p>
              <p className="text-sm text-muted-foreground">Started Mar 2024 • 6 months</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}