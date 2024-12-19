"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Send, Users, ArrowRight, BookOpen, Layout, MessageSquare, Trophy } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface LearningPool {
  id: string;
  title: string;
  description: string;
  members: number;
  topics: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  image: string;
}

const FEATURED_POOLS: LearningPool[] = [
  {
    id: "1",
    title: "Investment Fundamentals",
    description: "Master the basics of investment strategies and portfolio management",
    members: 1240,
    topics: ["Stocks", "Bonds", "Portfolio"],
    difficulty: "Beginner",
    image: "/placeholder.svg?height=300&width=600",
  },
  {
    id: "2",
    title: "Advanced Market Analysis",
    description: "Deep dive into technical and fundamental market analysis",
    members: 856,
    topics: ["Technical Analysis", "Research"],
    difficulty: "Advanced",
    image: "/placeholder.svg?height=300&width=600",
  },
  {
    id: "3",
    title: "Startup Investment",
    description: "Learn how to evaluate and invest in early-stage startups",
    members: 678,
    topics: ["Startups", "Valuation"],
    difficulty: "Intermediate",
    image: "/placeholder.svg?height=300&width=600",
  },
];

const QUICK_TOPICS = [
  { title: "Market Analysis", icon: "📊" },
  { title: "Portfolio Management", icon: "💼" },
  { title: "Risk Assessment", icon: "⚖️" },
  { title: "Investment Strategy", icon: "🎯" },
];

export default function LearningPage() {
  const router = useRouter();
  const [inputMessage, setInputMessage] = useState("");

  const handleJoinPool = (poolId: string) => {
    router.push(`/learning/resources/${poolId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Learning Pool
        </h1>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <Input
            placeholder="Ask about investments, trading, analysis..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="w-full bg-card/50 border-primary/20 text-foreground placeholder:text-muted-foreground rounded-full py-6 pl-6 pr-24 shadow-soft"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-primary">
              <Mic className="h-5 w-5" />
            </Button>
            <Button size="icon" className="bg-primary hover:bg-primary/90">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Verification Message */}
        <p className="text-muted-foreground text-center text-sm mb-8">
          Learning Pool can make mistakes. Verify its outputs.
        </p>

        {/* Quick Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {QUICK_TOPICS.map((topic, index) => (
            <Card
              key={index}
              className="card-glass hover:bg-gray-100 dark:hover:bg-card/60 transition-all duration-300 p-6 cursor-pointer border-primary/20 group"
            >
              <div className="flex flex-col gap-2">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                  {topic.icon}
                </span>
                <h3 className="text-lg font-medium text-foreground">{topic.title}</h3>
              </div>
            </Card>
          ))}
        </div>

        {/* Featured Learning Pools */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_POOLS.map((pool) => (
            <Card
              key={pool.id}
              className="card-glass border-primary/20 overflow-hidden group shadow-soft hover:shadow-soft-lg hover:bg-gray-100 dark:hover:bg-card/60 transition-all duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={pool.image}
                  alt={pool.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
                <div className="absolute top-2 right-2">
                  <Badge
                    variant={
                      pool.difficulty === "Beginner"
                        ? "secondary"
                        : pool.difficulty === "Intermediate"
                        ? "default"
                        : "destructive"
                    }
                    className="shadow-soft"
                  >
                    {pool.difficulty}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6 relative z-10">
                <h3 className="text-xl font-semibold mb-2 text-foreground">{pool.title}</h3>
                <p className="text-muted-foreground mb-4">{pool.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {pool.topics.map((topic) => (
                    <Badge key={topic} variant="outline" className="border-primary/20 shadow-soft">
                      {topic}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{pool.members.toLocaleString()} members</span>
                  </div>
                  <Button
                    onClick={() => handleJoinPool(pool.id)}
                    className="bg-primary hover:bg-primary/90 shadow-soft"
                  >
                    Join Pool
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}