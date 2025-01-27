"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Users, ArrowRight, BookOpen, Layout, MessageSquare, Trophy, Clock, Compass, Star, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import dynamic from "next/dynamic";

const CourseBuilderChat = dynamic(() => import("@/components/learning/course-builder-chat"), { ssr: false });

interface LearningPool {
  id: string;
  title: string;
  description: string;
  members: number;
  topics: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  image: string;
  provider: string;
  institution: string;
  instructor: string;
  rating: number;
  students: number;
  progress: number;
  category: string;
  groupMembers: {
    total: number;
    online: number;
    recent: {
      id: string;
      name: string;
      avatar: string;
      status: string;
    }[];
  };
}

const FEATURED_POOLS: LearningPool[] = [
  {
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
    }
  },
  {
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
    }
  },
  {
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
    }
  }
];

const RECENT_COURSES = [
  {
    id: "python-fundamentals",
    title: "Python Programming Fundamentals",
    description: "Learn Python programming from scratch. Master core concepts, data structures, and build real projects.",
    image: "/placeholder.svg",
    progress: 35,
    provider: "ColabApes Learning",
    category: "Programming",
    instructor: "Dr. Sarah Johnson",
    rating: 4.8,
    students: 1234,
    tags: ["Python", "Programming", "Data Structures"]
  },
  {
    id: "web-development",
    title: "Modern Web Development",
    description: "Master modern web development with React, Next.js, and TypeScript.",
    image: "/placeholder.svg",
    progress: 15,
    provider: "ColabApes Learning",
    category: "Web Development",
    instructor: "Alex Chen",
    rating: 4.9,
    students: 2345,
    tags: ["React", "Next.js", "TypeScript"]
  },
  // Add more courses as needed
];

const DISCOVER_COURSES = [
  {
    title: "Unity Game Development",
    icon: "🎮",
    instructor: "Sarah Chen",
    rating: 4.8,
    students: 2345,
    tags: ["Game Dev", "Unity", "C#"],
    image: "/placeholder.svg?height=200&width=400",
    category: "Game Development"
  },
  {
    title: "Ethical Hacking Masterclass",
    icon: "🔒",
    instructor: "Michael Roberts",
    rating: 4.9,
    students: 1890,
    tags: ["Security", "Pentesting", "Network"],
    image: "/placeholder.svg?height=200&width=400",
    category: "Cybersecurity"
  },
  {
    title: "3D Modeling with Blender",
    icon: "🎨",
    instructor: "David Kumar",
    rating: 4.7,
    students: 1567,
    tags: ["3D Art", "Modeling", "Animation"],
    image: "/placeholder.svg?height=200&width=400",
    category: "Digital Art"
  },
  {
    title: "Full-Stack Web Development",
    icon: "💻",
    instructor: "Emily Zhang",
    rating: 4.9,
    students: 2123,
    tags: ["Web Dev", "JavaScript", "React"],
    image: "/placeholder.svg?height=200&width=400",
    category: "Programming"
  },
  {
    title: "Digital Marketing Strategy",
    icon: "📱",
    instructor: "Alex Thompson",
    rating: 4.8,
    students: 1845,
    tags: ["Marketing", "Social Media", "Analytics"],
    image: "/placeholder.svg?height=200&width=400",
    category: "Digital Marketing"
  },
  {
    title: "Data Science with Python",
    icon: "📊",
    instructor: "Maria Garcia",
    rating: 4.9,
    students: 2567,
    tags: ["Data Science", "Python", "ML"],
    image: "/placeholder.svg?height=200&width=400",
    category: "Data Science"
  },
  {
    title: "UI/UX Design Principles",
    icon: "🎯",
    instructor: "James Wilson",
    rating: 4.8,
    students: 1932,
    tags: ["Design", "UI", "User Experience"],
    image: "/placeholder.svg?height=200&width=400",
    category: "Design"
  },
  {
    title: "Cloud Architecture AWS",
    icon: "☁️",
    instructor: "Priya Patel",
    rating: 4.7,
    students: 1678,
    tags: ["Cloud", "AWS", "DevOps"],
    image: "/placeholder.svg?height=200&width=400",
    category: "Cloud Computing"
  }
];

export default function LearningPage() {
  const router = useRouter();
  const [inputMessage, setInputMessage] = useState("");

  const handleJoinPool = (poolId: string) => {
    router.push(`/learning/pools/${poolId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Learning Pool
        </h1>

        {/* AI Course Builder */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2">AI Course Builder</h2>
            <p className="text-muted-foreground">
              Chat with our AI to create a personalized learning path tailored to your goals and interests.
            </p>
          </div>
          <CourseBuilderChat />
        </div>

        {/* Verification Message */}
        <p className="text-muted-foreground text-center text-sm mb-8">
          Learning Pool can make mistakes. Verify its outputs.
        </p>

        {/* Recent/Active Courses Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RECENT_COURSES.map((course) => (
              <Link key={course.id} href={`/learning/${course.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                  <div className="relative h-48">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/0" />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm dark:text-white text-gray-900">
                        {course.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors dark:text-white text-gray-900">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 text-sm font-medium">{course.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({course.students.toLocaleString()} students)
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {course.instructor}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {course.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-muted hover:bg-muted/80 dark:text-white text-gray-900"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="pt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Course Discovery Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Discover New Courses</h2>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px] border-primary/20">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="gamedev">Game Development</SelectItem>
                  <SelectItem value="security">Cybersecurity</SelectItem>
                  <SelectItem value="art">Digital Art</SelectItem>
                  <SelectItem value="programming">Programming</SelectItem>
                  <SelectItem value="marketing">Digital Marketing</SelectItem>
                  <SelectItem value="data">Data Science</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="cloud">Cloud Computing</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-primary/20">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DISCOVER_COURSES.map((course, index) => (
              <Card
                key={index}
                className="card-glass overflow-hidden group hover:shadow-lg transition-all duration-300 border-primary/20 bg-card"
              >
                <div className="relative h-32">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
                  <div className="absolute top-2 left-2">
                    <span className="text-2xl">{course.icon}</span>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-1 text-foreground">{course.title}</h3>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <span>{course.instructor}</span>
                    <span>•</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1">{course.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {course.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="text-xs bg-muted hover:bg-muted/80 dark:text-white text-gray-900"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students.toLocaleString()}
                    </div>
                    <Button 
                      variant="ghost" 
                      className="h-8 hover:bg-muted text-foreground hover:text-primary"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Learning Pools */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Learning Pools</h2>
            </div>
            <Button variant="outline" className="border-primary/20">
              Create Pool
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_POOLS.map((pool) => (
              <Card
                key={pool.id}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-primary/20"
                onClick={() => handleJoinPool(pool.id)}
              >
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
                      {pool.difficulty}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6 flex flex-col h-[calc(100%-12rem)]">
                  <div className="flex-1">
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors dark:text-white text-gray-900">
                        {pool.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {pool.description}
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {pool.students.toLocaleString()} students
                          </span>
                        </div>
                        <div className="flex -space-x-2">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-full bg-primary/20 border-2 border-background"
                            />
                          ))}
                          {pool.students > 3 && (
                            <div className="w-6 h-6 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center">
                              <span className="text-xs text-primary">+{pool.students - 3}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {pool.topics.map((topic) => (
                          <Badge
                            key={topic}
                            variant="secondary"
                            className="bg-muted hover:bg-muted/80 dark:text-white text-gray-900"
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        {pool.groupMembers.total.toLocaleString()} members
                      </div>
                      <Badge variant="secondary">
                        {pool.groupMembers.online} online
                      </Badge>
                    </div>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      Join Pool
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}