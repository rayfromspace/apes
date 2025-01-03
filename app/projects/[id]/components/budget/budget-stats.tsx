import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface BudgetStatsProps {
  totalBudget: number
  totalExpenses: number
  remainingBudget: number
  treasuryBalance: number
  remainingTreasury: number
  totalSalaries: number
}

export function BudgetStats({ 
  totalBudget, 
  totalExpenses, 
  remainingBudget,
  treasuryBalance,
  remainingTreasury,
  totalSalaries
}: BudgetStatsProps) {
  const percentageUsed = (totalExpenses / totalBudget) * 100
  const percentageTreasuryUsed = ((treasuryBalance - remainingTreasury) / treasuryBalance) * 100

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Total Budget</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Total Expenses</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-2xl font-bold">${remainingBudget.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Remaining Budget</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-2xl font-bold">${remainingTreasury.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Treasury Balance</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-2xl font-bold">${totalSalaries.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Total Salaries (Monthly)</p>
        </CardContent>
      </Card>
      <Card className="md:col-span-3">
        <CardContent className="p-6">
          <div className="flex justify-between mb-2">
            <div className="text-sm font-medium">Budget Usage</div>
            <div className="text-sm text-muted-foreground">{percentageUsed.toFixed(1)}%</div>
          </div>
          <Progress value={percentageUsed} className="h-2" />
          <div className="flex justify-between mb-2 mt-4">
            <div className="text-sm font-medium">Treasury Usage</div>
            <div className="text-sm text-muted-foreground">{percentageTreasuryUsed.toFixed(1)}%</div>
          </div>
          <Progress value={percentageTreasuryUsed} className="h-2" />
        </CardContent>
      </Card>
    </div>
  )
}
