"use client";

import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { useState } from 'react';

const topMovers = [
  { name: "TechStart", symbol: "TECH", price: "0.68", change: -34.12, color: "bg-yellow-500" },
  { name: "DataFlow", symbol: "DATA", price: "5.33", change: 14.81, color: "bg-yellow-400" },
  { name: "AICore", symbol: "AIC", price: "0.30", change: -13.57, color: "bg-blue-600" },
  { name: "CloudNet", symbol: "NET", price: "1.75", change: 13.11, color: "bg-gray-900" },
  { name: "BioTech", symbol: "BIO", price: "2.45", change: -5.23, color: "bg-green-600" },
  { name: "FinServe", symbol: "FIN", price: "8.92", change: 7.64, color: "bg-purple-600" },
  { name: "EcoSmart", symbol: "ECO", price: "1.20", change: 3.45, color: "bg-teal-500" },
  { name: "MediaMax", symbol: "MED", price: "4.56", change: -2.31, color: "bg-red-500" },
];

const projects = [
  {
    name: "TechVenture",
    symbol: "TECH",
    price: 96274.27,
    change: -1.76,
    marketCap: "1.9T",
    icon: "/placeholder.svg?height=32&width=32",
  },
  {
    name: "DataStream",
    symbol: "DATA",
    price: 3601.89,
    change: -4.03,
    marketCap: "431.7B",
    icon: "/placeholder.svg?height=32&width=32",
  },
];

export default function ValueStakePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [timeframe, setTimeframe] = useState("1D");
  const [filter, setFilter] = useState("all");

  return (
    <div className="container py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Explore Projects</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/value-stake/portfolio">
              My Portfolio
            </Link>
          </Button>
          <Button variant="outline">
            Create Project
          </Button>
        </div>
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Top movers</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {topMovers.map((startup) => (
            <Link key={startup.symbol} href={`/dashboard/value-stake/projects/${startup.symbol}`}>
              <Card className="bg-card p-3 rounded-lg hover:bg-accent transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full ${startup.color}`} />
                    <div className="text-sm font-medium">{startup.name}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{startup.symbol}</div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-lg font-bold">${startup.price}</div>
                  <div className={`text-sm ${startup.change > 0 ? "text-green-500" : "text-red-500"}`}>
                    {startup.change > 0 ? "↑" : "↓"} {Math.abs(startup.change)}%
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">All Projects</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-9" 
              placeholder="Search projects" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1H">1H</SelectItem>
                <SelectItem value="1D">1D</SelectItem>
                <SelectItem value="1W">1W</SelectItem>
                <SelectItem value="1M">1M</SelectItem>
                <SelectItem value="1Y">1Y</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All projects</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="new">New listings</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-4 px-4 py-2 text-muted-foreground text-sm">
            <div>Name</div>
            <div className="text-right">Price</div>
            <div className="text-right">Change</div>
            <div className="text-right">Market cap</div>
          </div>
          {projects.map((project) => (
            <div
              key={project.symbol}
              className="grid grid-cols-4 gap-4 px-4 py-3 rounded-lg hover:bg-accent items-center"
            >
              <div className="flex items-center gap-3">
                <img
                  src={project.icon}
                  alt={project.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="font-medium">{project.name}</div>
                  <div className="text-muted-foreground text-sm">{project.symbol}</div>
                </div>
              </div>
              <div className="text-right">${project.price.toLocaleString()}</div>
              <div
                className={`text-right ${
                  project.change > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {project.change > 0 ? "+" : ""}
                {project.change}%
              </div>
              <div className="text-right flex items-center justify-end gap-4">
                <span>${project.marketCap}</span>
                <Button variant="link" className="text-primary">
                  Invest
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}