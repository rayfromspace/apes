import { useState } from 'react';
import Image from 'next/image';
import { UserProfile } from '@/lib/api/user-api';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { ProfileSkeleton } from '@/components/skeleton/ProfileSkeleton';
import { useProfile } from '@/lib/hooks/useProfile';

interface UserProfileCardProps {
  userId?: string;
  className?: string;
}

function UserProfileContent({ userId }: { userId?: string }) {
  const {
    profile,
    isLoading,
    error,
    updateProfile,
    isUpdating,
  } = useProfile(userId);

  const [following, setFollowing] = useState(false);

  const handleFollowToggle = async () => {
    setFollowing(!following);
    // Add follow/unfollow logic here
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    throw error || new Error('Profile not found');
  }

  const isCurrentUser = !userId;

  return (
    <Card className={cn('w-full max-w-2xl')}>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name} />
          <AvatarFallback>
            {profile.full_name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{profile.full_name}</h2>
            {!isCurrentUser && (
              <Button
                variant={following ? 'outline' : 'default'}
                size="sm"
                onClick={handleFollowToggle}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : following ? (
                  'Unfollow'
                ) : (
                  'Follow'
                )}
              </Button>
            )}
          </div>
          <p className="text-muted-foreground">{profile.role}</p>
          {profile.company && (
            <p className="text-sm text-muted-foreground">
              {profile.position} at {profile.company}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile.bio && (
          <p className="text-sm text-muted-foreground">{profile.bio}</p>
        )}
        
        {profile.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icons.mapPin className="h-4 w-4" />
            <span>{profile.location}</span>
          </div>
        )}

        {profile.skills?.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {profile.interests?.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <Badge key={interest} variant="outline">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 pt-4">
          {profile.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <Icons.linkedin className="h-5 w-5" />
            </a>
          )}
          {profile.twitter_url && (
            <a
              href={profile.twitter_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <Icons.twitter className="h-5 w-5" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function UserProfileCard({ userId, className }: UserProfileCardProps) {
  return (
    <ErrorBoundary>
      <div className={className}>
        <UserProfileContent userId={userId} />
      </div>
    </ErrorBoundary>
  );
}
