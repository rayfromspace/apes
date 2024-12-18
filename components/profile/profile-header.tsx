"use client";

import { useEffect } from "react";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfileStore } from "@/lib/stores/profile-store";
import {
  Github,
  Globe,
  Linkedin,
  MapPin,
  Twitter,
  Upload,
} from "lucide-react";
import Link from "next/link";

export function ProfileHeader() {
  const { profile, isLoading, fetchProfile } = useProfileStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2 text-center">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
          <UserAvatar 
            user={{
              id: profile.id,
              name: profile.name,
              avatar: profile.avatar,
              role: profile.role
            }}
            showHoverCard={false}
            size="lg"
          />
          <Button
            size="icon"
            variant="outline"
            className="absolute bottom-0 right-0 rounded-full"
            onClick={() => {
              // TODO: Implement avatar upload
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  // Handle file upload
                }
              };
              input.click();
            }}
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-muted-foreground">{profile.role}</p>
        </div>

        {profile.bio && (
          <p className="max-w-lg text-center text-muted-foreground">
            {profile.bio}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2">
          {profile.location && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {profile.location}
            </Badge>
          )}
          {profile.website && (
            <Link
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Badge
                variant="secondary"
                className="flex items-center gap-1 hover:bg-secondary/80"
              >
                <Globe className="h-3 w-3" />
                Website
              </Badge>
            </Link>
          )}
          {profile.github && (
            <Link
              href={`https://github.com/${profile.github}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Badge
                variant="secondary"
                className="flex items-center gap-1 hover:bg-secondary/80"
              >
                <Github className="h-3 w-3" />
                GitHub
              </Badge>
            </Link>
          )}
          {profile.twitter && (
            <Link
              href={`https://twitter.com/${profile.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Badge
                variant="secondary"
                className="flex items-center gap-1 hover:bg-secondary/80"
              >
                <Twitter className="h-3 w-3" />
                Twitter
              </Badge>
            </Link>
          )}
          {profile.linkedin && (
            <Link
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Badge
                variant="secondary"
                className="flex items-center gap-1 hover:bg-secondary/80"
              >
                <Linkedin className="h-3 w-3" />
                LinkedIn
              </Badge>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-8 text-center">
          <div>
            <p className="text-2xl font-bold">{profile.projectCount}</p>
            <p className="text-sm text-muted-foreground">Projects</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{profile.investmentCount}</p>
            <p className="text-sm text-muted-foreground">Investments</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              ${profile.totalInvested.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Invested</p>
          </div>
        </div>
      </div>
    </div>
  );
}
