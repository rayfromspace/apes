"use client";

import { ChevronLeft, ChevronRight, Search, BarChart2, Users2, TrendingUp, MoreVertical, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import Link from 'next/link';
import { useState } from 'react';
import { cn } from "@/lib/utils";

const topMovers = [
  { 
    name: "TechStart", 
    symbol: "TECH", 
    price: "0.68", 
    change: -34.12, 
    category: "Technology",
    marketCap: "2.1M",
    volume: "450K",
    holders: 128,
    description: "Next-generation tech startup focusing on AI and blockchain solutions.",
    color: "bg-yellow-500" 
  },
  { 
    name: "DataFlow", 
    symbol: "DATA", 
    price: "5.33", 
    change: 14.81, 
    category: "Data Analytics",
    marketCap: "8.5M",
    volume: "1.2M",
    holders: 342,
    description: "Enterprise data analytics and visualization platform.",
    color: "bg-yellow-400" 
  },
  { 
    name: "AICore", 
    symbol: "AIC", 
    price: "0.30", 
    change: -13.57, 
    category: "Artificial Intelligence",
    marketCap: "900K",
    volume: "150K",
    holders: 89,
    description: "AI-powered core infrastructure for modern applications.",
    color: "bg-blue-600" 
  },
  { 
    name: "CloudNet", 
    symbol: "NET", 
    price: "1.75", 
    change: 13.11, 
    category: "Cloud Computing",
    marketCap: "4.2M",
    volume: "820K",
    holders: 256,
    description: "Decentralized cloud computing network for web3.",
    color: "bg-gray-900" 
  },
  { 
    name: "BioTech", 
    symbol: "BIO", 
    price: "2.45", 
    change: -5.23, 
    category: "Biotechnology",
    marketCap: "1.5M",
    volume: "300K",
    holders: 123,
    description: "Biotech company focused on developing innovative medical solutions.",
    color: "bg-green-600" 
  },
  { 
    name: "FinServe", 
    symbol: "FIN", 
    price: "8.92", 
    change: 7.64, 
    category: "Financial Services",
    marketCap: "6.5M",
    volume: "1.5M",
    holders: 421,
    description: "Financial services company providing payment solutions.",
    color: "bg-purple-600" 
  },
  { 
    name: "EcoSmart", 
    symbol: "ECO", 
    price: "1.20", 
    change: 3.45, 
    category: "Environmental Technology",
    marketCap: "2.5M",
    volume: "500K",
    holders: 187,
    description: "Eco-friendly technology company focused on sustainable solutions.",
    color: "bg-teal-500" 
  },
  { 
    name: "MediaMax", 
    symbol: "MED", 
    price: "4.56", 
    change: -2.31, 
    category: "Media and Entertainment",
    marketCap: "3.2M",
    volume: "700K",
    holders: 291,
    description: "Media and entertainment company producing innovative content.",
    color: "bg-red-500" 
  },
];

const projects = [
  {
    name: "TechVenture",
    symbol: "TECH",
    price: 96274.27,
    change: -1.76,
    marketCap: "1.9T",
    volume: "450M",
    holders: 15243,
    category: "Technology",
    description: "Leading technology venture focusing on next-gen innovations.",
    color: "bg-blue-500",
    icon: "/placeholder.svg?height=32&width=32",
  },
  {
    name: "DataStream",
    symbol: "DATA",
    price: 3601.89,
    change: -4.03,
    marketCap: "431.7B",
    volume: "89M",
    holders: 8432,
    category: "Data Analytics",
    description: "Enterprise-grade data analytics and streaming platform.",
    color: "bg-purple-500",
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
        <Button variant="outline" asChild>
          <Link href="/dashboard/value-stake/portfolio">
            My Portfolio
          </Link>
        </Button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {topMovers.map((project) => (
            <Card 
              key={project.symbol} 
              className="group relative hover:shadow-lg transition-all duration-200 card-glass glow-effect shadow-soft"
            >
              <div className="absolute right-4 top-4 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      Add to Watchlist
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Link href={`/dashboard/value-stake/projects/${project.symbol}`}>
                <CardHeader>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-8 h-8 rounded-lg", project.color)} />
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{project.category}</Badge>
                      <Badge variant="secondary">{project.symbol}</Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="text-lg font-bold">${project.price}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">24h Change</p>
                        <p className={cn(
                          "text-lg font-bold",
                          project.change > 0 ? "text-green-500" : "text-red-500"
                        )}>
                          {project.change > 0 ? "+" : ""}{project.change}%
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
                        <BarChart2 className="h-4 w-4 mb-1 text-muted-foreground" />
                        <p className="text-xs font-medium">{project.marketCap}</p>
                        <p className="text-xs text-muted-foreground">Cap</p>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
                        <TrendingUp className="h-4 w-4 mb-1 text-muted-foreground" />
                        <p className="text-xs font-medium">{project.volume}</p>
                        <p className="text-xs text-muted-foreground">Vol</p>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
                        <Users2 className="h-4 w-4 mb-1 text-muted-foreground" />
                        <p className="text-xs font-medium">{project.holders}</p>
                        <p className="text-xs text-muted-foreground">Holders</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">All Projects</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1D">1D</SelectItem>
                <SelectItem value="1W">1W</SelectItem>
                <SelectItem value="1M">1M</SelectItem>
                <SelectItem value="1Y">1Y</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map((project) => (
            <Card 
              key={project.symbol} 
              className="group relative hover:shadow-lg transition-all duration-200 card-glass glow-effect shadow-soft"
            >
              <div className="absolute right-4 top-4 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      Add to Watchlist
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Link href={`/dashboard/value-stake/projects/${project.symbol}`}>
                <CardHeader>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-8 h-8 rounded-lg", project.color)} />
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{project.category}</Badge>
                      <Badge variant="secondary">{project.symbol}</Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="text-lg font-bold">${project.price.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">24h Change</p>
                        <p className={cn(
                          "text-lg font-bold",
                          project.change > 0 ? "text-green-500" : "text-red-500"
                        )}>
                          {project.change > 0 ? "+" : ""}{project.change}%
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
                        <BarChart2 className="h-4 w-4 mb-1 text-muted-foreground" />
                        <p className="text-xs font-medium">{project.marketCap}</p>
                        <p className="text-xs text-muted-foreground">Cap</p>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
                        <TrendingUp className="h-4 w-4 mb-1 text-muted-foreground" />
                        <p className="text-xs font-medium">{project.volume}</p>
                        <p className="text-xs text-muted-foreground">Vol</p>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
                        <Users2 className="h-4 w-4 mb-1 text-muted-foreground" />
                        <p className="text-xs font-medium">{project.holders}</p>
                        <p className="text-xs text-muted-foreground">Holders</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}