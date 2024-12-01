import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ACTIVITIES = [
  {
    user: {
      name: "Sarah Chen",
      avatar: "https://avatar.vercel.sh/sarah",
    },
    action: "invested in",
    target: "AI Content Creator",
    amount: "$5,000",
    time: "2h ago",
  },
  {
    user: {
      name: "Alex Thompson",
      avatar: "https://avatar.vercel.sh/alex",
    },
    action: "received returns from",
    target: "DeFi Trading Platform",
    amount: "$2,500",
    time: "5h ago",
  },
  {
    user: {
      name: "Michael Roberts",
      avatar: "https://avatar.vercel.sh/michael",
    },
    action: "updated stake in",
    target: "Supply Chain Solution",
    amount: "$10,000",
    time: "1d ago",
  },
];

export function ValueStakeActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {ACTIVITIES.map((activity, i) => (
            <div key={i} className="flex items-start gap-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.user.avatar} />
                <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-sm font-medium text-primary">
                  {activity.amount}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}