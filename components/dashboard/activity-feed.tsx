"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from '@/components/shared/user-avatar';
import { MessageCircle, DollarSign, Star, Flag } from "lucide-react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from "@/lib/auth/store";
import { Activity, ActivityType } from "@/types/activity";
import { formatDistanceToNow } from 'date-fns';

const activityIcons = {
  comment: MessageCircle,
  investment: DollarSign,
  milestone: Flag,
  team_update: Star,
} as const;

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();
  const { user } = useAuth();

  const fetchActivities = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          user:user_id (
            id,
            email,
            full_name,
            avatar_url
          ),
          project:project_id (
            id,
            title
          )
        `)
        .or(`project_id.in.(select id from projects where founder_id.eq.${user.id}),project_id.in.(select project_id from team_members where user_id.eq.${user.id})`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();

    // Set up real-time subscription
    const channel = supabase
      .channel('activities_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activities',
        },
        () => {
          fetchActivities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-start space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4 pr-4">
        {activities.map((activity) => {
          const Icon = activityIcons[activity.type as ActivityType];
          return (
            <div key={activity.id} className="flex items-start space-x-4">
              <UserAvatar
                user={{
                  name: activity.user?.full_name || 'Unknown',
                  image: activity.user?.avatar_url,
                }}
                className="h-10 w-10"
              />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  <span className="font-semibold">{activity.user?.full_name}</span>
                  {' '}
                  <span className="text-muted-foreground">
                    {activity.content}
                  </span>
                </p>
                <div className="flex items-center space-x-2">
                  {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
