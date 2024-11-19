"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface InvestmentDetailsProps {
  id: string
}

export function InvestmentDetails({ id }: InvestmentDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Investment Date</p>
            <p className="text-sm">Jan 15, 2024</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Investment Type</p>
            <p className="text-sm">Project Equity</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Project Stage</p>
            <p className="text-sm">Development</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Lock Period</p>
            <p className="text-sm">12 months</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}