"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/lib/auth/store";
import { format, subDays } from "date-fns";
import { Activity, Calendar, GitCommit, MapPin, Wallet } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContributionGraph } from "../contribution-graph";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface LoginActivity {
  timestamp: string;
  ip_address: string;
}

interface ProjectContribution {
  project_name: string;
  contribution_count: number;
  last_contribution: string;
}

interface ContributionDay {
  date: Date;
  count: number;
}

interface PaymentRecord {
  project_name: string;
  amount: number;
  currency: string;
  payment_date: string;
  status: 'pending' | 'completed';
  role: string;
}

export function UserAnalyticsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const supabase = createClientComponentClient();
  const { user } = useAuth();
  const [loginHistory, setLoginHistory] = React.useState<LoginActivity[]>([]);
  const [contributions, setContributions] = React.useState<ProjectContribution[]>([]);
  const [dailyContributions, setDailyContributions] = React.useState<ContributionDay[]>([]);
  const [payments, setPayments] = React.useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [totalEarnings, setTotalEarnings] = React.useState(0);

  React.useEffect(() => {
    if (open && user) {
      fetchAnalytics();
    }
  }, [open, user]);

  const fetchAnalytics = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // Fetch login history
      const { data: authData, error: authError } = await supabase
        .from('auth_logs')
        .select('timestamp, ip_address')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(10);

      if (authError) throw authError;

      // Fetch project contributions
      const { data: projectData, error: projectError } = await supabase
        .from('team_members')
        .select(`
          projects (
            name,
            id
          ),
          (
            SELECT count(*)
            FROM activities
            WHERE user_id = team_members.user_id
            AND project_id = team_members.project_id
          ) as contribution_count,
          (
            SELECT max(created_at)
            FROM activities
            WHERE user_id = team_members.user_id
            AND project_id = team_members.project_id
          ) as last_contribution
        `)
        .eq('user_id', user.id);

      if (projectError) throw projectError;

      // Fetch daily contributions for the last year
      const startDate = subDays(new Date(), 364);
      const { data: activityData, error: activityError } = await supabase
        .from('activities')
        .select('created_at, action_type')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (activityError) throw activityError;

      // Fetch payment records
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .select(`
          amount,
          currency,
          payment_date,
          status,
          projects (name),
          team_members (role)
        `)
        .eq('user_id', user.id)
        .order('payment_date', { ascending: false });

      if (paymentError) throw paymentError;

      // Process daily contributions
      const dailyCount = new Map<string, number>();
      activityData?.forEach((activity) => {
        const date = format(new Date(activity.created_at), 'yyyy-MM-dd');
        dailyCount.set(date, (dailyCount.get(date) || 0) + 1);
      });

      const contributionDays: ContributionDay[] = Array.from(dailyCount.entries()).map(
        ([date, count]) => ({
          date: new Date(date),
          count,
        })
      );

      const processedPayments = paymentData?.map(payment => ({
        project_name: payment.projects?.name || 'Unknown Project',
        amount: payment.amount,
        currency: payment.currency,
        payment_date: payment.payment_date,
        status: payment.status,
        role: payment.team_members?.role || 'Member'
      })) || [];

      const total = processedPayments.reduce((sum, payment) => 
        payment.status === 'completed' ? sum + payment.amount : sum, 0
      );

      setLoginHistory(authData || []);
      setContributions(
        (projectData || []).map((item) => ({
          project_name: item.projects?.name || 'Unknown Project',
          contribution_count: parseInt(item.contribution_count) || 0,
          last_contribution: item.last_contribution || '-'
        }))
      );
      setDailyContributions(contributionDays);
      setPayments(processedPayments);
      setTotalEarnings(total);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Your Activity Analytics
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Activity Details</TabsTrigger>
            <TabsTrigger value="payments">Pay Tracker</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 pt-4">
            {/* Contribution Graph */}
            <Card className="p-6">
              {isLoading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <ContributionGraph data={dailyContributions} />
              )}
            </Card>

            {/* Project Summary */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <GitCommit className="h-5 w-5" />
                Project Summary
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {contributions.map((project, index) => (
                  <Card key={index} className="p-4 bg-muted/50">
                    <div className="space-y-2">
                      <div className="font-medium">{project.project_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {project.contribution_count} contributions
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Last active: {
                          project.last_contribution !== '-'
                            ? format(new Date(project.last_contribution), "MMM d, yyyy")
                            : 'No activity yet'
                        }
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6 pt-4">
            {/* Recent Logins */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5" />
                Recent Logins
              </h3>
              <div className="space-y-2">
                {loginHistory.map((login, index) => (
                  <Card key={index} className="p-4 bg-muted/50">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {format(new Date(login.timestamp), "MMM d, yyyy h:mm a")}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {login.ip_address}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6 pt-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Wallet className="h-5 w-5" />
                Payment Summary
              </h3>
              <div className="mb-6">
                <div className="text-2xl font-bold">
                  Total Earnings: ${totalEarnings.toLocaleString()}
                </div>
              </div>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {payments.map((payment, index) => (
                    <Card key={index} className="p-4 bg-muted/50">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="font-medium">{payment.project_name}</div>
                          <div className="text-sm text-muted-foreground">Role: {payment.role}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(payment.payment_date), "MMM d, yyyy")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {payment.currency} {payment.amount.toLocaleString()}
                          </div>
                          <Badge 
                            variant={payment.status === 'completed' ? 'default' : 'secondary'}
                            className="mt-1"
                          >
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
