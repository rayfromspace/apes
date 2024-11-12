import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Rocket, Users, TrendingUp, Brain } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Rocket className="h-6 w-6" />
            <span className="text-xl font-bold">Colab Apes</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="container px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
            Launch Your Digital Business
            <span className="text-primary block">With Colab Apes</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-[600px] mb-8">
            Start, manage, and grow your digital projects in a collaborative environment.
            Connect with investors, team members, and fellow entrepreneurs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/register">Start Your Project</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/explore">Explore Projects</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Users className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Collaborative Workspace</h3>
            <p className="text-muted-foreground">
              Connect with team members, manage tasks, and track progress in real-time.
            </p>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <TrendingUp className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Secure Investment</h3>
            <p className="text-muted-foreground">
              Raise funds securely through Value Stake integration with Solana blockchain.
            </p>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Brain className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Project Growth</h3>
            <p className="text-muted-foreground">
              Access tools and resources to scale your digital business effectively.
            </p>
          </Card>
        </div>
      </main>

      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Rocket className="h-6 w-6" />
              <span className="font-semibold">Colab Apes</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-foreground">About</Link>
              <Link href="/terms" className="hover:text-foreground">Terms</Link>
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link href="/contact" className="hover:text-foreground">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}