import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  ArrowUpRight,
} from "lucide-react"

interface ProjectFundingProps {
  id: string
}

export function ProjectFunding({ id }: ProjectFundingProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Funding Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>$37,500 raised</span>
              <span>$50,000 goal</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Investors</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Equity Offered</p>
              <p className="text-2xl font-bold">15%</p>
            </div>
          </div>

          <Button className="w-full">
            Invest Now
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Investment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Minimum Investment</p>
                <p className="text-xl font-bold">$1,000</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Maximum Investors</p>
                <p className="text-xl font-bold">20</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Expected ROI</p>
                <p className="text-xl font-bold">25% / Year</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Investment Period</p>
                <p className="text-xl font-bold">36 Months</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Recent Investments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Anonymous Investor</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="font-bold">$5,000</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}