"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Facebook,
  Link2,
  Linkedin,
  Share2,
  Copy,
} from "lucide-react";

// X (formerly Twitter) logo as a component
function XLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface ShareProfileProps {
  userId: string;
  userName: string;
}

export function ShareProfile({ userId, userName }: ShareProfileProps) {
  const { toast } = useToast();
  const profileUrl = `${window.location.origin}/profile/${userId}`;
  const shareMessage = `Check out ${userName}'s profile on coLABapes! Join us in building the future of collaborative development. 🚀\n\n${profileUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Link copied!",
      description: "Profile link has been copied to your clipboard.",
    });
  };

  const shareLinks = {
    x: `https://x.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Share on social media</p>
            <div className="flex gap-2">
              <a
                href={shareLinks.x}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <XLogo />
                </Button>
              </a>
              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </a>
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Facebook className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Or copy link</p>
            <div className="flex gap-2">
              <Input
                readOnly
                value={profileUrl}
                className="flex-1"
              />
              <Button
                variant="secondary"
                size="icon"
                onClick={handleCopyLink}
                className="h-9 w-9"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Share message</p>
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm whitespace-pre-wrap">{shareMessage}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
