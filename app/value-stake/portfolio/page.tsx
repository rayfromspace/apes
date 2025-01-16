"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useInvestmentStore } from "@/lib/stores/investment-store";
import { useProjectStore } from "@/lib/stores/project-store";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ValueStakePortfolioPage() {
  const { investments, metrics, isLoading: investmentsLoading, fetchInvestments } = useInvestmentStore();
  const { projects, isLoading: projectsLoading, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchInvestments();
    fetchProjects();
  }, [fetchInvestments, fetchProjects]);

  if (investmentsLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Investment Portfolio</h1>
        <Button variant="outline" asChild>
          <Link href="/value-stake">
            Explore Projects
          </Link>
        </Button>
      </div>

      {/* Portfolio Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalInvested)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Value</CardTitle>
            {metrics.monthlyChange > 0 ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.monthlyChange > 0 ? "+" : ""}{formatPercentage(metrics.monthlyChange)} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total ROI</CardTitle>
            {metrics.totalROI > 0 ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(metrics.totalROI)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {investments.filter(inv => inv.status === 'active').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investment List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your Investments</h2>
        <div className="grid gap-4">
          {investments.map((investment) => {
            const project = projects.find(p => p.id === investment.project_id);
            if (!project) return null;

            return (
              <Card key={investment.id} className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                    <Badge variant={investment.status === 'active' ? 'default' : 'secondary'}>
                      {investment.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Invested</p>
                      <p className="text-lg font-bold">{formatCurrency(investment.invested)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Value</p>
                      <p className="text-lg font-bold">{formatCurrency(investment.current_value)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ROI</p>
                      <p className={`text-lg font-bold ${
                        investment.roi > 0 ? 'text-green-500' : investment.roi < 0 ? 'text-red-500' : ''
                      }`}>
                        {formatPercentage(investment.roi)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <p className="text-lg font-bold">{investment.progress}%</p>
                    </div>
                  </div>

                  <Progress value={investment.progress} className="h-2" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
