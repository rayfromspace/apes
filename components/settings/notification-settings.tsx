"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function NotificationSettings() {
  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="project-updates">Project Updates</Label>
            <Switch id="project-updates" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="team-messages">Team Messages</Label>
            <Switch id="team-messages" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="investment-alerts">Investment Alerts</Label>
            <Switch id="investment-alerts" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="task-reminders">Task Reminders</Label>
            <Switch id="task-reminders" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="marketing-emails">Marketing Emails</Label>
            <Switch id="marketing-emails" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}