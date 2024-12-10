"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      console.log("Attempting to sign in with email:", data.email);
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      console.log("Sign in result:", result);

      if (!result?.error) {
        toast({
          title: "Success!",
          description: "You have been logged in.",
        });
        router.push(callbackUrl);
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error === "CredentialsSignin" 
            ? "Invalid email or password" 
            : result.error,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to sign in to your account
          </p>
        </div>
        <AuthForm
          type="login"
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}