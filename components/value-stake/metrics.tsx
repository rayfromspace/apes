"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, PieChart, Activity, Loader2 } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/lib/auth/store";
import { toast } from "sonner";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  isLoading?: boolean;
}

interface Investment {
  id: string;
  user_id: string;
  project: string;
  type: string;
  invested: number;
  current_value: number;
  roi: number;
  progress: number;
  created_at: string;
  updated_at: string;
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
  const supabase = createClientComponentClient();
  const { user, isAuthenticated } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<{
    currentValue: number;
    previousValue: number;
  }>({ currentValue: 0, previousValue: 0 });

  useEffect(() => {
    const fetchInvestments = async () => {
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch current investments
        const { data: currentData, error: currentError } = await supabase
          .from('investments')
          .select('*')
          .eq('user_id', user.id);

        if (currentError) throw currentError;

        // Fetch monthly data (investments from last month)
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const { data: monthlyData, error: monthlyError } = await supabase
          .from('investments')
          .select('current_value')
          .eq('user_id', user.id)
          .lt('created_at', lastMonth.toISOString());

        if (monthlyError) throw monthlyError;

        setInvestments(currentData || []);
        
        const currentTotal = (currentData || []).reduce((sum, inv) => sum + inv.current_value, 0);
        const previousTotal = (monthlyData || []).reduce((sum, inv) => sum + inv.current_value, 0);
        
        setMonthlyData({
          currentValue: currentTotal,
          previousValue: previousTotal
        });

      } catch (error) {
        console.error('Error fetching investment data:', error);
        toast.error('Failed to load investment metrics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestments();
  }, [isAuthenticated, user, supabase]);

  // Calculate metrics
  const totalValue = investments.reduce((sum, inv) => sum + inv.current_value, 0);
  const totalInvested = investments.reduce((sum, inv) => sum + inv.invested, 0);
  const portfolioChange = totalInvested > 0 
    ? ((totalValue - totalInvested) / totalInvested * 100).toFixed(1)
    : "0.0";
  
  const activeInvestments = investments.length;
  
  // Calculate portfolio diversity (percentage of different investment types)
  const types = new Set(investments.map(inv => inv.type));
  const diversity = (types.size / Math.max(activeInvestments, 1) * 100).toFixed(0);
  
  // Calculate monthly returns
  const monthlyReturns = monthlyData.currentValue - monthlyData.previousValue;
  const monthlyReturnsPercentage = monthlyData.previousValue > 0
    ? ((monthlyReturns / monthlyData.previousValue) * 100).toFixed(1)
    : "0.0";

  if (!isAuthenticated) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground text-center">
                Sign in to view metrics
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Portfolio Value"
        value={`$${totalValue.toLocaleString()}`}
        change={`${portfolioChange}%`}
        isPositive={Number(portfolioChange) >= 0}
        icon={<Wallet className="h-5 w-5 text-primary" />}
        isLoading={isLoading}
      />
      <MetricCard
        title="Active Investments"
        value={activeInvestments.toString()}
        icon={<TrendingUp className="h-5 w-5 text-primary" />}
        isLoading={isLoading}
      />
      <MetricCard
        title="Portfolio Diversity"
        value={`${diversity}%`}
        icon={<PieChart className="h-5 w-5 text-primary" />}
        isLoading={isLoading}
      />
      <MetricCard
        title="Monthly Returns"
        value={`$${Math.abs(monthlyReturns).toLocaleString()}`}
        change={`${monthlyReturnsPercentage}%`}
        isPositive={monthlyReturns >= 0}
        icon={<Activity className="h-5 w-5 text-primary" />}
        isLoading={isLoading}
      />
    </div>
  );
}