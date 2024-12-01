import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, PieChart, Activity } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
}

function MetricCard({ title, value, change, isPositive, icon }: MetricCardProps) {
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
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Portfolio Value"
        value="$124,500"
        change="12.5%"
        isPositive={true}
        icon={<Wallet className="h-5 w-5 text-primary" />}
      />
      <MetricCard
        title="Active Investments"
        value="8"
        change="2"
        isPositive={true}
        icon={<TrendingUp className="h-5 w-5 text-primary" />}
      />
      <MetricCard
        title="Portfolio Diversity"
        value="85%"
        icon={<PieChart className="h-5 w-5 text-primary" />}
      />
      <MetricCard
        title="Monthly Returns"
        value="$2,450"
        change="5.2%"
        isPositive={false}
        icon={<Activity className="h-5 w-5 text-primary" />}
      />
    </div>
  );
}