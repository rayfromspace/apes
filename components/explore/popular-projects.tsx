"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, DollarSign } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const projects = [
  {
    id: "1",
    name: "Digital Marketing Platform",
    category: "SaaS",
    investors: 128,
    raised: 125000,
    goal: 150000,
    growth: "+12.5%",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "2",
    name: "AI Content Generator",
    category: "Artificial Intelligence",
    investors: 256,
    raised: 450000,
    goal: 500000,
    growth: "+28.3%",
    image: "https://images.unsplash.com/photo-1488229297570-58520851e868?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "3",
    name: "NFT Marketplace",
    category: "Web3",
    investors: 89,
    raised: 89000,
    goal: 100000,
    growth: "+8.7%",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=60",
  },
]

export function PopularProjects() {
  return (
    <div className="grid gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="relative h-48 md:h-auto md:w-1/3">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{project.name}</h3>
                  <Badge className="mt-1">{project.category}</Badge>
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/projects/${project.id}`}>
                    View Details
                  </Link>
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Funding Progress</span>
                    <span>${project.raised.toLocaleString()} / ${project.goal.toLocaleString()}</span>
                  </div>
                  <Progress value={(project.raised / project.goal) * 100} />
                </div>

                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{project.investors} Investors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">{project.growth}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )
}