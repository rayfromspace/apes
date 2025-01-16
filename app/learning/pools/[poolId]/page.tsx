"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Play, BookOpen, CheckCircle, Clock, Users, Award, 
  ArrowLeft, MessageSquare, Calendar, Settings, Star,
  FileText, Video, Send, PlusCircle, Share2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock pool data - replace with real data from your database
const mockPoolData = {
  "1": {
    id: "1",
    title: "Full-Stack Development Bootcamp",
    description: "Master modern web development with hands-on projects and peer collaboration",
    image: "/placeholder.svg",
    provider: "Coursera",
    institution: "Meta",
    instructor: "Meta Engineering Team",
    rating: 4.8,
    students: 1240,
    progress: 45,
    category: "Development",
    topics: ["React", "Node.js", "TypeScript", "AWS"],
    difficulty: "Intermediate",
    groupMembers: {
      total: 24,
      online: 5,
      recent: [
        { id: "1", name: "Sarah K.", avatar: "/placeholder.svg", status: "online" },
        { id: "2", name: "John D.", avatar: "/placeholder.svg", status: "offline" },
        { id: "3", name: "Mike R.", avatar: "/placeholder.svg", status: "online" },
      ]
    },
    nextSession: {
      title: "React Advanced Patterns",
      date: "2025-01-16T15:00:00Z",
      attendees: 8
    },
    discussions: [
      {
        id: "1",
        title: "Week 1: React Fundamentals",
        messages: 23,
        unread: 5
      },
      {
        id: "2",
        title: "Project Help: E-commerce App",
        messages: 45,
        unread: 0
      }
    ]
  },
  "2": {
    id: "2",
    title: "AI & Machine Learning Specialization",
    description: "Deep dive into artificial intelligence and machine learning with industry experts",
    image: "/placeholder.svg",
    provider: "Coursera",
    institution: "Stanford University",
    instructor: "Andrew Ng",
    rating: 4.9,
    students: 856,
    progress: 30,
    category: "AI/ML",
    topics: ["Python", "TensorFlow", "Deep Learning", "NLP"],
    difficulty: "Advanced",
    groupMembers: {
      total: 18,
      online: 3,
      recent: [
        { id: "4", name: "Emma L.", avatar: "/placeholder.svg", status: "online" },
        { id: "5", name: "Alex M.", avatar: "/placeholder.svg", status: "online" },
        { id: "6", name: "James W.", avatar: "/placeholder.svg", status: "offline" },
      ]
    },
    nextSession: {
      title: "Neural Networks Deep Dive",
      date: "2025-01-17T18:00:00Z",
      attendees: 12
    },
    discussions: [
      {
        id: "3",
        title: "Week 2: Neural Networks",
        messages: 34,
        unread: 2
      },
      {
        id: "4",
        title: "Project: Image Classification",
        messages: 28,
        unread: 0
      }
    ]
  },
  "3": {
    id: "3",
    title: "Cloud Architecture & DevOps",
    description: "Learn cloud architecture and DevOps practices through real-world scenarios",
    image: "/placeholder.svg",
    provider: "Coursera",
    institution: "Google Cloud",
    instructor: "Google Cloud Team",
    rating: 4.7,
    students: 678,
    progress: 60,
    category: "Cloud",
    topics: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    difficulty: "Advanced",
    groupMembers: {
      total: 15,
      online: 4,
      recent: [
        { id: "7", name: "David K.", avatar: "/placeholder.svg", status: "online" },
        { id: "8", name: "Lisa M.", avatar: "/placeholder.svg", status: "offline" },
        { id: "9", name: "Ryan P.", avatar: "/placeholder.svg", status: "online" },
      ]
    },
    nextSession: {
      title: "Kubernetes in Production",
      date: "2025-01-18T20:00:00Z",
      attendees: 10
    },
    discussions: [
      {
        id: "5",
        title: "Week 3: Container Orchestration",
        messages: 56,
        unread: 8
      },
      {
        id: "6",
        title: "Project: Microservices Architecture",
        messages: 42,
        unread: 0
      }
    ]
  }
};

export default function LearningPoolPage({ params }: { params: { poolId: string } }) {
  const pool = mockPoolData[params.poolId as keyof typeof mockPoolData];

  if (!pool) {
    return <div>Pool not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <Link href="/learning" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Learning
        </Link>

        {/* Course Card */}
        <Card className="group hover:shadow-lg transition-all duration-300">
          <div className="relative h-48">
            <Image
              src={pool.image}
              alt={pool.title}
              fill
              className="object-cover rounded-t-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/0" />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm dark:text-white text-gray-900">
                {pool.category}
              </Badge>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="mb-4">
              <h1 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors dark:text-white text-gray-900">
                {pool.title}
              </h1>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {pool.description}
              </p>

              {/* Course Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {pool.institution}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {pool.instructor}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-muted-foreground">
                      {pool.rating} ({pool.students.toLocaleString()} students)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      8 weeks
                    </span>
                  </div>
                </div>
              </div>

              {/* Group Features */}
              <div className="space-y-6">
                {/* Progress and Group */}
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1 mr-8">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Course Progress</span>
                      <span className="font-medium">{pool.progress}%</span>
                    </div>
                    <Progress value={pool.progress} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {pool.groupMembers.recent.map((member) => (
                        <Avatar key={member.id} className="border-2 border-background">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <Badge variant="secondary">
                      {pool.groupMembers.online} online
                    </Badge>
                  </div>
                </div>

                {/* Next Session */}
                {pool.nextSession && (
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium dark:text-white text-gray-900 mb-1">
                            Next: {pool.nextSession.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(pool.nextSession.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <span>•</span>
                            <span>{pool.nextSession.attendees} attending</span>
                          </div>
                        </div>
                        <Button>Join Session</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recent Discussions */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium dark:text-white text-gray-900">Recent Discussions</h3>
                    <Button variant="outline" size="sm">View All</Button>
                  </div>
                  {pool.discussions.map((discussion) => (
                    <div 
                      key={discussion.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm dark:text-white text-gray-900">{discussion.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{discussion.messages} messages</span>
                        {discussion.unread > 0 && (
                          <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                            {discussion.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1">
                    <Play className="mr-2 h-4 w-4" />
                    Continue Learning
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Join Discussion
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
