"use client";

import { Card } from "@/components/ui/card";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UserCardProps {
  user: {
    id: string;
    name?: string | null;
    avatar?: string | null;
    role?: string | null;
    bio?: string;
  };
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  }[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: {
    card: "p-3",
    name: "text-sm",
    bio: "text-xs",
    avatar: "sm"
  },
  md: {
    card: "p-4",
    name: "text-base",
    bio: "text-sm",
    avatar: "md"
  },
  lg: {
    card: "p-6",
    name: "text-lg",
    bio: "text-base",
    avatar: "lg"
  }
};

export function UserCard({
  user,
  actions,
  className,
  size = 'md'
}: UserCardProps) {
  const styles = sizeStyles[size];

  return (
    <Card className={cn(styles.card, className)}>
      <div className="flex items-center space-x-4">
        <UserAvatar
          user={user}
          size={styles.avatar as 'sm' | 'md' | 'lg'}
          showHoverCard={false}
        />
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold truncate",
            styles.name
          )}>
            {user.name || 'Anonymous'}
          </h3>
          {user.role && (
            <p className="text-sm text-muted-foreground">
              {user.role}
            </p>
          )}
          {user.bio && (
            <p className={cn(
              "text-muted-foreground mt-1 line-clamp-2",
              styles.bio
            )}>
              {user.bio}
            </p>
          )}
        </div>
      </div>
      
      {actions && actions.length > 0 && (
        <div className="flex gap-2 mt-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'default'}
              size="sm"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
}
