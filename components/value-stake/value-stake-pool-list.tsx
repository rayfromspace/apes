"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Users, TrendingUp } from "lucide-react"
import { NewInvestmentDialog } from "./new-investment-dialog"

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
    name: "Gaming Ventures",
    category: "Gaming",
    totalValue: 750000,
    investors: 62,
    roi: 32,
    progress: 85,
  },
  {
    id: "3",
    name: "Entertainment Projects",
    category: "Entertainment",
    totalValue: 300000,
    investors: 30,
    roi: 18,
    progress: 60,
  },
  {
    id: "4",
    name: "Digital Services Bundle",
    category: "Services",
    totalValue: 250000,
    investors: 28,
    roi: 22,
    progress: 45,
  },
  {
    id: "5",
    name: "EdTech Innovations",
    category: "Education",
    totalValue: 400000,
    investors: 35,
    roi: 20,
    progress: 65,
  },
  {
    id: "6",
    name: "DeFi Solutions",
    category: "Finance",
    totalValue: 1000000,
    investors: 85,
    roi: 40,
    progress: 90,
  },
  {
    id: "7",
    name: "Web3 Infrastructure",
    category: "Blockchain",
    totalValue: 800000,
    investors: 70,
    roi: 35,
    progress: 80,
  },
  {
    id: "8",
    name: "AI/ML Projects",
    category: "Artificial Intelligence",
    totalValue: 600000,
    investors: 50,
    roi: 28,
    progress: 70,
  },
]

export function ValueStakePoolList() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <NewInvestmentDialog />
      </div>
      
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
          </CardContent>
        </Card>
      ))}
    </div>
  )</content></file>

<boltAction type="start">
<command>npm run dev</command>