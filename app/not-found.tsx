import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Page Not Found</AlertTitle>
        <AlertDescription>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </AlertDescription>
      </Alert>
      <div className="mt-4">
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
