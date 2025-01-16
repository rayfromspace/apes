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
import { useToast } from "@/components/ui/use-toast";
import { Loader2, MapPin } from "lucide-react";
import { useAuth } from "@/lib/auth/store";

const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  bio: z.string().optional(),
  skills: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function CompleteProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const { initialize } = useAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
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
          router.replace("/auth/login");
          return;
        }

        const { data: profile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          // If profile exists and has name and location, or if it's skipped and within delay, go to dashboard
          const isComplete = profile.full_name && profile.location;
          const isSkipped = profile.skipped_at;
          const skipDelay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
          const skipExpired = isSkipped && (new Date().getTime() - new Date(profile.skipped_at).getTime() > skipDelay);

          if (isComplete || (isSkipped && !skipExpired)) {
            router.replace("/dashboard");
            return;
          }
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
        variant: "destructive",
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
        variant: "destructive",
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

      const { error } = await supabase
        .from("user_profiles")
        .upsert({
          id: session.user.id,
          skipped_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Update auth store with new profile data
      await initialize();
      router.replace("/dashboard");
    } catch (error: any) {
      console.error("Error skipping profile:", error);
      toast({
        variant: "destructive",
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

      const { error } = await supabase
        .from("user_profiles")
        .upsert({
          id: session.user.id,
          full_name: data.full_name,
          bio: data.bio || null,
          skills: data.skills ? data.skills.split(",").map(s => s.trim()) : [],
          location: data.location,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          skipped_at: null, // Clear any previous skip
        });

      if (error) throw error;

      // Update auth store with new profile data
      await initialize();

      toast({
        title: "Profile completed!",
        description: "Your profile has been successfully created.",
      });

      router.replace("/dashboard");
    } catch (error: any) {
      console.error("Error creating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container flex min-h-screen items-center justify-center">
      <Dialog open={isOpen} onOpenChange={() => handleSkip()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Complete Your Profile</DialogTitle>
            <DialogDescription>
              Tell us a bit about yourself to get started. Only name and location are required.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
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
                    <FormLabel>Location *</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="Enter your location" {...field} />
                      </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself..."
                        className="resize-none h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Share your background and interests
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="React, TypeScript, Node.js"
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

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                  disabled={isLoading}
                >
                  Skip for Now
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Complete Profile
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
