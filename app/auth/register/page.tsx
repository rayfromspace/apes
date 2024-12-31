"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { RegisterForm } from "@/components/auth/register-form";
import { supabase } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // First create the auth user
      const { error: authError, data: authData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        throw authError;
      }

      // Then create the user profile with additional information
      const { error: profileError } = await supabase
        .from("users")
        .insert([
          {
            id: authData.user?.id,
            email: data.email,
            username: data.username,
            full_name: data.full_name,
            location: data.location,
            bio: data.bio,
            linkedin_url: data.linkedin_url,
            twitter_url: data.twitter_url,
            skills: data.skills,
            interests: data.interests,
            weekly_hours: data.weekly_hours,
            work_style: data.work_style,
            team_experience: data.team_experience,
            communication_preference: data.communication_preference,
            purpose: data.purpose,
            participation_type: data.participation_type,
            preferred_projects: data.preferred_projects,
          },
        ]);

      if (profileError) {
        throw profileError;
      }

      toast({
        title: "Success!",
        description: "Please check your email to verify your account.",
      });
      
      router.push("/auth/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred during registration.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex min-h-screen items-center justify-center">
      <Dialog open={true} onOpenChange={() => router.push("/")}>
        <DialogContent className="sm:max-w-[900px] p-0">
          <RegisterForm onSubmit={onSubmit} isLoading={isLoading} />
        </DialogContent>
      </Dialog>
    </div>
  );
}