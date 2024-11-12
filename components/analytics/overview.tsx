"use client"

import React from "react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const data = [
  { month: "Jan", investments: 240000, investors: 120 },
  { month: "Feb", investments: 139800, investors: 156 },
  { month: "Mar", investments: 980000, investors: 280 },
  { month: "Apr", investments: 390800, investors: 320 },
  { month: "May", investments: 480000, investors: 400 },
  { month: "Jun", investments: 380000, investors: 450 },
]

const CustomXAxis = ({ ...props }) => (
  <XAxis
    {...props}
    stroke="hsl(var(--foreground))"
    fontSize={12}
    tickLine={false}
    axisLine={false}
  />
)

const CustomYAxis = ({ ...props }) => (
  <YAxis
    {...props}
    stroke="hsl(var(--foreground))"
    fontSize={12}
    tickLine={false}
    axisLine={false}
    tickFormatter={(value) => `$${value/1000}k`}
  />
)

export function Overview() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorInvestments" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <CustomXAxis dataKey="month" />
          <CustomYAxis />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload?.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Investments
                        </span>
                        <span className="font-bold text-muted-foreground">
                          ${payload[0].value.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Investors
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {payload[1].value}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="investments"
            stroke="hsl(var(--primary))"
            fillOpacity={1}
            fill="url(#colorInvestments)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="investors"
            stroke="hsl(var(--secondary))"
            fillOpacity={0.2}
            fill="hsl(var(--secondary))"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}