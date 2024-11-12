"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Users, TrendingUp } from "lucide-react"
import { toast } from "sonner"

const pools = [
  {
    id: "1",
    name: "Software Innovation Pool",
    category: "Software",
    totalValue: 500000,
    investors: 45,
    roi: 25,
    progress: 75,
  },
  {
    id: "2",
    name: "Entertainment Projects",
    category: "Entertainment",
    totalValue: 300000,
    investors: 30,
    roi: 18,
    progress: 60,
  },
  {
    id: "3",
    name: "Digital Services Bundle",
    category: "Services",
    totalValue: 250000,
    investors: 28,
    roi: 22,
    progress: 45,
  },
]

export function ValueStakePoolList() {
  const handleInvest = (poolId: string) => {
    toast.success("Investment process initiated")
    // Implement Solana wallet connection and USD Coin transfer
  }

  return (
    <div className="space-y-4">
      {pools.map((pool) => (
        <Card key={pool.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{pool.name}</CardTitle>
              <Badge>{pool.category}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    ${pool.totalValue.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Value</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{pool.investors}</p>
                  <p className="text-xs text-muted-foreground">Investors</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{pool.roi}%</p>
                  <p className="text-xs text-muted-foreground">Avg. ROI</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pool Filled</span>
                <span>{pool.progress}%</span>
              </div>
              <Progress value={pool.progress} className="h-2" />
            </div>

            <Button 
              className="w-full" 
              onClick={() => handleInvest(pool.id)}
            >
              Invest with USD Coin
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}