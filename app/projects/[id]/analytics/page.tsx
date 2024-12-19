"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Users,
  GitCommit,
  MessageSquare,
  Star,
  TrendingUp,
  Clock,
  Calendar,
} from "lucide-react";

// Demo data
const activityData = [
  { date: "2023-12-01", commits: 15, comments: 8, reviews: 4 },
  { date: "2023-12-02", commits: 12, comments: 10, reviews: 6 },
  // Add more data points
];

const contributionData = [
  { name: "John Doe", value: 30 },
  { name: "Sarah Chen", value: 25 },
  { name: "Mike Wilson", value: 20 },
  { name: "Emma Brown", value: 15 },
  { name: "Others", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

interface Metric {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
}

export default function ProjectAnalytics({ params }: { params: { id: string } }) {
  const [timeRange, setTimeRange] = useState("7d");

  const metrics: Metric[] = [
    {
      label: "Total Commits",
      value: "342",
      change: 12.5,
      icon: <GitCommit className="h-4 w-4" />,
    },
    {
      label: "Active Contributors",
      value: "8",
      change: -2.3,
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: "Comments",
      value: "156",
      change: 8.1,
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      label: "Project Score",
      value: "4.8",
      change: 1.2,
      icon: <Star className="h-4 w-4" />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Project Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Track your project's performance and team activity
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.label}
                </CardTitle>
                {metric.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={
                      metric.change > 0
                        ? "text-green-500"
                        : "text-destructive"
                    }
                  >
                    {metric.change > 0 ? "+" : ""}
                    {metric.change}%
                  </span>{" "}
                  from last period
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
            <CardDescription>
              Track commits, comments, and reviews over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="commits"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line type="monotone" dataKey="comments" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="reviews" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Contribution Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Contribution Distribution</CardTitle>
              <CardDescription>
                Team member contributions by percentage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={contributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {contributionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest actions and updates in your project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex items-center">
                  <span className="relative flex h-3 w-3 mr-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">New commit by Sarah Chen</p>
                    <p className="text-xs text-muted-foreground">
                      "Update user authentication flow"
                    </p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                {/* Add more activity items */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
