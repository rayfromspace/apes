import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, TrendingUp, TrendingDown } from "lucide-react";

const INVESTMENTS = [
  {
    id: "1",
    project: "DeFi Trading Platform",
    type: "Blockchain",
    invested: 25000,
    currentValue: 32500,
    roi: 30,
    isPositive: true,
    progress: 65,
  },
  {
    id: "2",
    project: "AI Content Creator",
    type: "AI/ML",
    invested: 15000,
    currentValue: 18750,
    roi: 25,
    isPositive: true,
    progress: 40,
  },
  {
    id: "3",
    project: "Supply Chain Solution",
    type: "Enterprise",
    invested: 30000,
    currentValue: 27000,
    roi: -10,
    isPositive: false,
    progress: 85,
  },
];

export function ValueStakePortfolio() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Investment Portfolio</CardTitle>
        <MoreVertical className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {INVESTMENTS.map((investment) => (
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
                      Current: ${investment.currentValue.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className={`flex items-center gap-1 ${
                  investment.isPositive ? "text-green-500" : "text-red-500"
                }`}>
                  {investment.isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="font-medium">{investment.roi}%</span>
                </div>
              </div>
              <Progress value={investment.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}