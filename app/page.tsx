import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Shield, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Auth Buttons */}
      <div className="absolute top-4 right-4 flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/auth/login">Sign In</Link>
        </Button>
        <Button asChild>
          <Link href="/auth/register">Register</Link>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Welcome to <span className="text-primary">coLABapes</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Connect, collaborate, and create with a global community of innovators.
            Build your projects, find investors, and grow your skills.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/projects">
                Explore Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" asChild>
              <Link href="/auth/register">Register</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose coLABapes?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Users}
              title="Dynamic Collaboration"
              description="Connect with creators, investors, and collaborators in a single ecosystem."
            />
            <FeatureCard
              icon={Shield}
              title="Secure & Transparent"
              description="Built-in tools for project management, funding, and transparent collaboration."
            />
            <FeatureCard
              icon={Rocket}
              title="Learn & Grow"
              description="Access educational resources and grow your skills while building real projects."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card">
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}