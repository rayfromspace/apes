"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, Users, Target, Clock } from "lucide-react"

interface ProjectDetailsProps {
  id: string
}

export function ProjectDetails({ id }: ProjectDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Funding Progress</span>
            <span>$85,000 / $100,000</span>
          </div>
          <Progress value={85} />
        </div>

        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Stage</p>
              <p className="text-sm text-muted-foreground">Development</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Started</p>
              <p className="text-sm text-muted-foreground">January 15, 2024</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Estimated Completion</p>
              <p className="text-sm text-muted-foreground">June 30, 2024</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Team Size</p>
              <p className="text-sm text-muted-foreground">8 members</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Minimum Investment</p>
              <p className="text-sm text-muted-foreground">$1,000</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Tags</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">AI</Badge>
            <Badge variant="secondary">Marketing</Badge>
            <Badge variant="secondary">SaaS</Badge>
            <Badge variant="secondary">B2B</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}