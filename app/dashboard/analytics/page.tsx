"use client"

import React from "react"
import { Overview } from "@/components/analytics/overview"
import { RevenueChart } from "@/components/analytics/revenue-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Users, DollarSign, Activity, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Investors",
    value: "1,284",
    change: "+12.5%",
    icon: Users,
  },
  {
    title: "Investment Raised",
    value: "$845,234",
    change: "+18.2%",
    icon: DollarSign,
  },
  {
    title: "Active Projects",
    value: "12",
    change: "+3",
    icon: Activity,
  },
  {
    title: "Avg. ROI",
    value: "24.6%",
    change: "+5.2%",
    icon: TrendingUp,
  },
]

export default function AnalyticsDashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Investment Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}