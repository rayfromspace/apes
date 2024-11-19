"use client"

import React from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const data = [
  { name: "Jan", total: 12000 },
  { name: "Feb", total: 9000 },
  { name: "Mar", total: 16000 },
  { name: "Apr", total: 18000 },
  { name: "May", total: 21000 },
  { name: "Jun", total: 19000 },
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

export function RevenueChart() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <CustomXAxis dataKey="name" />
          <CustomYAxis />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload?.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Revenue
                        </span>
                        <span className="font-bold text-muted-foreground">
                          ${payload[0].value.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar
            dataKey="total"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}