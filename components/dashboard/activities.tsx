import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const activities = [
  {
    user: {
      name: "Sarah Chen",
      avatar: "https://avatar.vercel.sh/sarah",
    },
    action: "commented on",
    target: "AI Content Creator",
    time: "2h ago",
  },
  {
    user: {
      name: "Alex Thompson",
      avatar: "https://avatar.vercel.sh/alex",
    },
    action: "updated milestone in",
    target: "DeFi Trading Platform",
    time: "5h ago",
  },
  {
    user: {
      name: "Michael Roberts",
      avatar: "https://avatar.vercel.sh/michael",
    },
    action: "joined",
    target: "AI Content Creator",
    time: "1d ago",
  },
];

export function DashboardActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity, i) => (
            <div key={i} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.user.avatar} />
                <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.user.name}{" "}
                  <span className="text-muted-foreground">
                    {activity.action}
                  </span>{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-sm text-muted-foreground">
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