"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/lib/auth/store";
import { toast } from "sonner";

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

export function ValueStakePortfolio() {
  const supabase = createClientComponentClient();
  const { user, isAuthenticated } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvestments = async () => {
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('investments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setInvestments(data || []);
      } catch (error) {
        console.error('Error fetching investments:', error);
        toast.error('Failed to load investment portfolio');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestments();
  }, [isAuthenticated, user, supabase]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="py-10">
          <p className="text-center text-muted-foreground">
            Please sign in to view your investment portfolio
          </p>
        </CardContent>
      </Card>
    );
  }

  if (investments.length === 0) {
    return (
      <Card>
        <CardContent className="py-10">
          <p className="text-center text-muted-foreground">
            No investments found. Start investing to build your portfolio!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Investment Portfolio</CardTitle>
        <MoreVertical className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {investments.map((investment) => {
            const isPositive = investment.roi >= 0;
            return (
              <div key={investment.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{investment.project}</h4>
                      <Badge variant="secondary">{investment.type}</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">
                        Invested: ${investment.invested.toLocaleString()}
                      </span>
                      <span>•</span>
                      <span className="text-sm text-muted-foreground">
                        Current: ${investment.current_value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 ${
                    isPositive ? "text-green-500" : "text-red-500"
                  }`}>
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="font-medium">{investment.roi}%</span>
                  </div>
                </div>
                <Progress value={investment.progress} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}