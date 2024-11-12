"use client"

import React from "react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const data = [
  { week: "Week 1", progress: 25 },
  { week: "Week 2", progress: 45 },
  { week: "Week 3", progress: 60 },
  { week: "Week 4", progress: 75 },
  { week: "Week 5", progress: 85 },
  { week: "Week 6", progress: 100 },
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
    tickFormatter={(value) => `${value}%`}
  />
)

export function LearningProgress() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <CustomXAxis dataKey="week" />
          <CustomYAxis />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload?.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Progress
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {payload[0].value}%
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="progress"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{
              stroke: "hsl(var(--primary))",
              fill: "hsl(var(--background))",
              strokeWidth: 2,
            }}
            activeDot={{
              stroke: "hsl(var(--primary))",
              fill: "hsl(var(--background))",
              strokeWidth: 2,
              r: 6,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}