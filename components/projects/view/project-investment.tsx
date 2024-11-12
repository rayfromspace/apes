"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp } from "lucide-react"
import { useState } from "react"
import { NewInvestmentDialog } from "@/components/value-stake/new-investment-dialog"

interface ProjectInvestmentProps {
  id: string
}

export function ProjectInvestment({ id }: ProjectInvestmentProps) {
  const [showInvestDialog, setShowInvestDialog] = useState(false)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Investment Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Raised</span>
              <span className="text-sm font-medium">$75,000 / $100,000</span>
            </div>
            <Progress value={75} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Investors</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Min. Investment</p>
              <p className="text-2xl font-bold">$1,000</p>
            </div>
          </div>
          <Button className="w-full" onClick={() => setShowInvestDialog(true)}>
            <DollarSign className="mr-2 h-4 w-4" />
            Invest Now
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Investment Returns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">18.5%</p>
              <p className="text-sm text-muted-foreground">Projected Annual Return</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Investment Terms</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 24-month minimum holding period</li>
              <li>• Quarterly dividend payments</li>
              <li>• Pro-rata rights for future rounds</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <NewInvestmentDialog 
        open={showInvestDialog} 
        onOpenChange={setShowInvestDialog}
      />
    </div>
  )
}