import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  User, 
  CreditCard, 
  FileText, 
  Shield,
  ChevronRight 
} from "lucide-react"
import Link from "next/link"

export function AccountOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Profile Completion</span>
            <span className="text-sm text-muted-foreground">85%</span>
          </div>
          <Progress value={85} className="h-2" />
        </div>

        <div className="space-y-2">
          {[
            {
              icon: User,
              title: "Personal Information",
              description: "Update your profile and preferences",
              href: "/dashboard/settings/profile",
            },
            {
              icon: CreditCard,
              title: "Financial Accounts",
              description: "Manage your payment methods",
              href: "/dashboard/settings/financial",
            },
            {
              icon: FileText,
              title: "Tax Documents",
              description: "View and download tax forms",
              href: "/dashboard/settings/documents",
            },
            {
              icon: Shield,
              title: "Verification Status",
              description: "Complete identity verification",
              href: "/dashboard/settings/verification",
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>

        <Button variant="outline" className="w-full" asChild>
          <Link href="/dashboard/settings">
            Manage Account Settings
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}