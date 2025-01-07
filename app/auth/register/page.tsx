"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { RegisterForm } from "@/components/auth/register-form";
import { useAuth } from "@/lib/auth/store";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Register the user using the auth store
      await register(
        `${data.first_name} ${data.last_name}`,
        data.email,
        data.password
      );

      toast({
        title: "Registration successful!",
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