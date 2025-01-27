"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, MapPin } from "lucide-react";
import { useAuth } from "@/lib/auth/store";

const profileSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters").optional(),
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  location: z.string().optional(),
  bio: z.string().optional(),
  skills: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function CompleteProfilePage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [showDialog, setShowDialog] = useState(true);
  const { initialize } = useAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      full_name: "",
      bio: "",
      skills: "",
      location: "",
    },
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/auth/login");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          // If profile exists and has required fields, go to dashboard
          const isComplete = profile.full_name;
          const isSkipped = profile.skipped_at;
          const skipDelay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
          const skipExpired = isSkipped && (new Date().getTime() - new Date(profile.skipped_at).getTime() > skipDelay);

          if (isComplete || (isSkipped && !skipExpired)) {
            router.push("/dashboard");
            return;
          }

          // Pre-fill form with existing data
          form.reset({
            username: profile.username || "",
            full_name: profile.full_name || "",
            bio: profile.bio || "",
            location: profile.location || "",
            skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : "",
          });
        }

        // Initialize form with user's name if available
        if (session.user.user_metadata?.full_name) {
          form.setValue("full_name", session.user.user_metadata.full_name);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error checking session:", error);
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router, supabase, form]);

  const getLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
      });
      return;
    }

    setIsLocating(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      // Format coordinates as a simple location string
      const { latitude, longitude } = position.coords;
      const locationString = `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`;
      form.setValue("location", locationString);
    } catch (error) {
      console.error("Error getting location:", error);
      toast({
        title: "Location Error",
        description: "Could not get your location. Please enter it manually.",
      });
    } finally {
      setIsLocating(false);
    }
  };

  const handleSkip = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No authenticated session");
      }

      // Generate a default username if none exists
      const defaultUsername = `user_${session.user.id.slice(0, 8)}`;
      const defaultName = session.user.user_metadata?.full_name || "Anonymous User";

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: session.user.id,
          username: defaultUsername,
          full_name: defaultName,
          skipped_at: new Date().toISOString(),
          email: session.user.email,
        });

      if (error) throw error;

      // Update auth store with new profile data
      await initialize();
      
      // Close dialog and redirect
      setShowDialog(false);
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    } catch (error: any) {
      console.error("Error skipping profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to skip profile completion",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No authenticated session");
      }

      // Generate username if not provided
      const username = data.username || `user_${session.user.id.slice(0, 8)}`;

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: session.user.id,
          username,
          full_name: data.full_name,
          bio: data.bio || null,
          skills: data.skills ? data.skills.split(",").map(s => s.trim()) : [],
          location: data.location || null,
          updated_at: new Date().toISOString(),
          skipped_at: null, // Clear any previous skip
          email: session.user.email,
        });

      if (error) {
        // Handle unique constraint violation
        if (error.code === "23505" && error.message.includes("username")) {
          throw new Error("Username is already taken. Please choose another one.");
        }
        throw error;
      }

      // Update auth store with new profile data
      await initialize();

      toast({
        title: "Profile completed!",
        description: "Your profile has been successfully created.",
      });

      // Close dialog and redirect
      setShowDialog(false);
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <Dialog open={showDialog} onOpenChange={(open) => {
      if (!open) handleSkip();
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Tell us a bit about yourself. You can always update this information later.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your unique username for the platform.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (optional)</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input placeholder="San Francisco, CA" {...field} />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={getLocation}
                        disabled={isLocating}
                      >
                        {isLocating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MapPin className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="JavaScript, React, Node.js"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Separate skills with commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-between sm:justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={handleSkip}
                disabled={isLoading}
              >
                Skip for Now
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Complete Profile"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
