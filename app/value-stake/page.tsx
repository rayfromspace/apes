"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search, BarChart2, Users2, TrendingUp, MoreVertical, ExternalLink, Loader2 } from 'lucide-react';
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
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/lib/stores/project-store";
import { useInvestmentStore } from "@/lib/stores/investment-store";
import { toast } from "sonner";

export default function ValueStakePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [timeframe, setTimeframe] = useState("1D");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);

  const { projects, isLoading: projectsLoading, fetchProjects } = useProjectStore();
  const { investments, isLoading: investmentsLoading, fetchInvestments } = useInvestmentStore();

  useEffect(() => {
    fetchProjects();
    fetchInvestments();
  }, [fetchProjects, fetchInvestments]);

  if (projectsLoading || investmentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Calculate project metrics
  const projectsWithMetrics = projects.map(project => {
    const projectInvestments = investments.filter(inv => inv.project_id === project.id);
    const totalInvested = projectInvestments.reduce((sum, inv) => sum + inv.invested, 0);
    const currentValue = projectInvestments.reduce((sum, inv) => sum + inv.current_value, 0);
    const change = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : 0;
    
    return {
      ...project,
      price: currentValue,
      change,
      marketCap: totalInvested.toLocaleString(),
      volume: projectInvestments.length.toString(),
      holders: projectInvestments.length,
      color: getProjectColor(project.category)
    };
  });

  // Sort by absolute change to get top movers
  const topMovers = [...projectsWithMetrics]
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    .slice(0, 8);

  // Filter and search projects
  const filteredProjects = projectsWithMetrics
    .filter(project => {
      if (filter === "all") return true;
      return project.category.toLowerCase() === filter.toLowerCase();
    })
    .filter(project => {
      if (!searchQuery) return true;
      return (
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  const handleAddToWatchlist = async (projectId: string) => {
    // TODO: Implement watchlist functionality
    toast.success("Added to watchlist");
  };

  const handleViewProject = (projectId: string) => {
    router.push(`/value-stake/projects/${projectId}`);
  };

  return (
    <div className="container px-8 py-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Explore Projects</h1>
        <Button variant="outline" className="px-6" asChild>
          <Link href="/value-stake/portfolio">
            My Portfolio
          </Link>
        </Button>
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Top movers</h2>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setPage(prev => Math.max(0, prev - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setPage(prev => prev + 1)}
              disabled={(page + 1) * 4 >= topMovers.length}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {topMovers.slice(page * 4, (page + 1) * 4).map((project) => (
            <Card 
              key={project.id} 
              className="group relative hover:shadow-lg transition-all duration-200 card-glass glow-effect shadow-soft"
              onClick={() => handleViewProject(project.id)}
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
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleViewProject(project.id);
                    }}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleAddToWatchlist(project.id);
                    }}>
                      Add to Watchlist
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <CardHeader>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-8 h-8 rounded-lg", project.color)} />
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{project.category}</Badge>
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
                      <p className="text-sm text-muted-foreground">Value</p>
                      <p className="text-lg font-bold">${project.price.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">24h Change</p>
                      <p className={cn(
                        "text-lg font-bold",
                        project.change > 0 ? "text-green-500" : "text-red-500"
                      )}>
                        {project.change > 0 ? "+" : ""}{project.change.toFixed(2)}%
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
                  <SelectItem value="environmental">Environmental</SelectItem>
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
          {filteredProjects.map((project) => (
            <Card 
              key={project.id} 
              className="group relative hover:shadow-lg transition-all duration-200 card-glass glow-effect shadow-soft"
              onClick={() => handleViewProject(project.id)}
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
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleViewProject(project.id);
                    }}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleAddToWatchlist(project.id);
                    }}>
                      Add to Watchlist
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <CardHeader>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-8 h-8 rounded-lg", project.color)} />
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{project.category}</Badge>
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
                      <p className="text-sm text-muted-foreground">Value</p>
                      <p className="text-lg font-bold">${project.price.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">24h Change</p>
                      <p className={cn(
                        "text-lg font-bold",
                        project.change > 0 ? "text-green-500" : "text-red-500"
                      )}>
                        {project.change > 0 ? "+" : ""}{project.change.toFixed(2)}%
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
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function getProjectColor(category: string): string {
  const colors: { [key: string]: string } = {
    'Technology': 'bg-blue-500',
    'Finance': 'bg-green-500',
    'Healthcare': 'bg-red-500',
    'Environmental': 'bg-teal-500',
    'Data Analytics': 'bg-purple-500',
    'Artificial Intelligence': 'bg-indigo-500',
    'Cloud Computing': 'bg-gray-900',
    'Media': 'bg-orange-500'
  };

  return colors[category] || 'bg-slate-500';
}