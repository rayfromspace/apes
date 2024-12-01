"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Something went wrong!</h1>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <div className="space-x-4">
          <button
            onClick={() => reset()}
            className="text-primary hover:underline"
          >
            Try again
          </button>
          <button 
            onClick={() => router.back()}
            className="text-primary hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}