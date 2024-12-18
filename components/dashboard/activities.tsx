import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/shared/user-avatar";

const activities = [
  {
    user: {
      id: 1,
      name: "Sarah Chen",
      avatar: "https://avatar.vercel.sh/sarah",
    },
    action: "commented on",
    target: "AI Content Creator",
    time: "2h ago",
  },
  {
    user: {
      id: 2,
      name: "Alex Thompson",
      avatar: "https://avatar.vercel.sh/alex",
    },
    action: "updated milestone in",
    target: "DeFi Trading Platform",
    time: "5h ago",
  },
  {
    user: {
      id: 3,
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
              <UserAvatar 
                user={{
                  id: activity.user.id,
                  name: activity.user.name,
                  avatar: activity.user.avatar,
                }}
                showHoverCard={true}
                size="sm"
              />
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