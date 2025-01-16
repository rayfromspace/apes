"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, PieChart, Activity, Loader2 } from "lucide-react";
import { useInvestmentStore } from "@/lib/stores/investment-store";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  isLoading?: boolean;
}

function MetricCard({ title, value, change, isPositive, icon, isLoading }: MetricCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[72px]">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{value}</p>
              {change && (
                <span className={`flex items-center text-sm ${
                  isPositive ? "text-green-500" : "text-red-500"
                }`}>
                  {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {change}
                </span>
              )}
            </div>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ValueStakeMetrics() {
  const { investments, metrics, isLoading, fetchInvestments } = useInvestmentStore();

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Invested"
        value={formatCurrency(metrics.totalInvested)}
        icon={<Wallet className="h-4 w-4 text-primary" />}
        isLoading={isLoading}
      />

      <MetricCard
        title="Current Value"
        value={formatCurrency(metrics.totalValue)}
        change={formatPercentage(metrics.monthlyChange)}
        isPositive={metrics.monthlyChange > 0}
        icon={<TrendingUp className="h-4 w-4 text-primary" />}
        isLoading={isLoading}
      />

      <MetricCard
        title="Average ROI"
        value={formatPercentage(metrics.totalROI)}
        isPositive={metrics.totalROI > 0}
        icon={<PieChart className="h-4 w-4 text-primary" />}
        isLoading={isLoading}
      />

      <MetricCard
        title="Active Investments"
        value={investments.filter(inv => inv.status === 'active').length.toString()}
        icon={<Activity className="h-4 w-4 text-primary" />}
        isLoading={isLoading}
      />
    </div>
  );
}