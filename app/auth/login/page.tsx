"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { AuthForm } from "@/components/auth/auth-form";
import { useAuth } from "@/lib/auth/store";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const user = await login(data.email, data.password);

      if (user) {
        toast({
          title: "Success!",
          description: "You have been logged in.",
        });
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>

        <AuthForm
          type="login"
          onSubmit={onSubmit}
          isLoading={isLoading}
        />

        <p className="px-8 text-center text-sm text-muted-foreground">
          <a
            href="/auth/register"
            className="hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account? Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
