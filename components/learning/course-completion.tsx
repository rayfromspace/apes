"use client"

import React from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const data = [
  { course: "Web Dev", completed: 85 },
  { course: "Mobile Dev", completed: 65 },
  { course: "UI/UX", completed: 90 },
  { course: "DevOps", completed: 45 },
  { course: "AI/ML", completed: 30 },
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

export function CourseCompletion() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <CustomXAxis type="number" />
          <CustomYAxis type="category" dataKey="course" width={100} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload?.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Completion
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
          <Bar
            dataKey="completed"
            fill="hsl(var(--primary))"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}