import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const performanceData = [
  { month: "Jan", roi: 15 },
  { month: "Feb", roi: 18 },
  { month: "Mar", roi: 22 },
  { month: "Apr", roi: 20 },
  { month: "May", roi: 25 },
  { month: "Jun", roi: 28 },
]

const categoryAllocation = [
  { category: "Software", percentage: 40 },
  { category: "Entertainment", percentage: 30 },
  { category: "Services", percentage: 20 },
  { category: "DeFi", percentage: 10 },
]

export function ValueStakeMetrics() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="roi" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryAllocation.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{item.category}</span>
                  <span>{item.percentage}%</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Value Locked</p>
              <p className="text-2xl font-bold">$2.5M</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Investors</p>
              <p className="text-2xl font-bold">450+</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. ROI (Annual)</p>
              <p className="text-2xl font-bold">22%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Projects Funded</p>
              <p className="text-2xl font-bold">85</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}