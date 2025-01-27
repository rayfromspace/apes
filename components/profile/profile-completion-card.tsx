"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export function ProfileCompletionCard() {
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const { user, profile, initialize } = useAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || "",
      full_name: profile?.full_name || user?.user_metadata?.full_name || "",
      bio: profile?.bio || "",
      skills: Array.isArray(profile?.skills) ? profile.skills.join(", ") : "",
      location: profile?.location || "",
    },
  });

  const getLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      const locationString = `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`;
      form.setValue("location", locationString);
    } catch (error) {
      console.error("Error getting location:", error);
      toast.error("Could not get your location. Please enter it manually.");
    } finally {
      setIsLocating(false);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;

    try {
      setIsLoading(true);
      const username = data.username || `user_${user.id.slice(0, 8)}`;

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          username,
          full_name: data.full_name,
          bio: data.bio || null,
          skills: data.skills ? data.skills.split(",").map(s => s.trim()) : [],
          location: data.location || null,
          updated_at: new Date().toISOString(),
          email: user.email,
        });

      if (error) {
        if (error.code === "23505" && error.message.includes("username")) {
          throw new Error("Username is already taken. Please choose another one.");
        }
        throw error;
      }

      await initialize();
      toast.success("Profile completed successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || (profile?.full_name && profile?.username)) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>
          Tell us a bit about yourself to get the most out of the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
