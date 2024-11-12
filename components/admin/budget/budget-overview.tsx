import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  Users,
  TrendingUp,
  Building2,
  Share2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function BudgetOverview() {
  const handleShare = (platform: string) => {
    toast.success(`Shared budget overview to ${platform}`)
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$150,000</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
            <Progress value={65} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Expenses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$85,000</div>
            <p className="text-xs text-muted-foreground">12 team members</p>
            <Progress value={75} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marketing</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$35,000</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
            <Progress value={45} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tools & Services</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$30,000</div>
            <p className="text-xs text-muted-foreground">15 subscriptions</p>
            <Progress value={35} className="mt-3 h-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Budget Distribution</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleShare("explore")}>
                Share to Explore Page
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("linkedin")}>
                Share to LinkedIn
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("twitter")}>
                Share to Twitter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { category: "Development Team", amount: 50000, percentage: 33.3 },
              { category: "Design Team", amount: 35000, percentage: 23.3 },
              { category: "Marketing", amount: 35000, percentage: 23.3 },
              { category: "Tools & Services", amount: 30000, percentage: 20 },
            ].map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{item.category}</span>
                  <span>${item.amount.toLocaleString()}</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
                <p className="text-xs text-muted-foreground text-right">
                  {item.percentage}%
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}