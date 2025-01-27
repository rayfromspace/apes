'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const requests = [
  {
    team: "Marketing",
    time: "2 days ago",
    amount: "$20,000.00",
  },
  {
    team: "Development",
    time: "3 days ago",
    amount: "$15,000.00",
  },
  {
    team: "Design",
    time: "4 days ago",
    amount: "$10,000.00",
  },
]

export function RecentRequests() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="bg-primary">
                  <AvatarFallback className="text-primary-foreground">
                    {request.team[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{request.team}</div>
                  <div className="text-sm text-muted-foreground">
                    {request.time}
                  </div>
                </div>
              </div>
              <div className="font-medium">{request.amount}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
