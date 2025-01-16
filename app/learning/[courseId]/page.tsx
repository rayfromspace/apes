"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Play, BookOpen, CheckCircle, Clock, Users, Award, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock course data - this will be replaced with real data from your database
const mockCourseData = {
  "python-fundamentals": {
    id: "python-fundamentals",
    title: "Python Programming Fundamentals",
    description: "Learn Python programming from scratch. Master core concepts, data structures, and build real projects.",
    thumbnail: "/placeholder.svg",
    provider: {
      name: "ColabApes Learning",
      logo: "/placeholder.svg"
    },
    instructor: {
      name: "Dr. Sarah Johnson",
      title: "Senior Python Developer",
      avatar: "/placeholder.svg"
    },
    duration: "8 weeks",
    enrolled: 1234,
    rating: 4.8,
    progress: 35,
    modules: [
      {
        id: 1,
        title: "Introduction to Python",
        duration: "2 hours",
        completed: true,
        lessons: [
          { id: 1, title: "What is Python?", duration: "15 min", completed: true },
          { id: 2, title: "Setting Up Your Environment", duration: "30 min", completed: true },
          { id: 3, title: "Your First Python Program", duration: "45 min", completed: true },
          { id: 4, title: "Basic Syntax", duration: "30 min", completed: true }
        ]
      },
      {
        id: 2,
        title: "Data Types and Variables",
        duration: "3 hours",
        completed: true,
        lessons: [
          { id: 5, title: "Numbers and Strings", duration: "45 min", completed: true },
          { id: 6, title: "Lists and Tuples", duration: "45 min", completed: true },
          { id: 7, title: "Dictionaries", duration: "45 min", completed: false },
          { id: 8, title: "Type Conversion", duration: "45 min", completed: false }
        ]
      },
      {
        id: 3,
        title: "Control Flow",
        duration: "4 hours",
        completed: false,
        lessons: [
          { id: 9, title: "If Statements", duration: "1 hour", completed: false },
          { id: 10, title: "Loops", duration: "1 hour", completed: false },
          { id: 11, title: "Functions", duration: "1 hour", completed: false },
          { id: 12, title: "Error Handling", duration: "1 hour", completed: false }
        ]
      }
    ],
    skills: ["Python", "Programming", "Data Structures", "Algorithms"],
    certificate: {
      available: true,
      type: "Professional Certificate"
    }
  },
  "web-development": {
    id: "web-development",
    title: "Modern Web Development",
    description: "Master modern web development with React, Next.js, and TypeScript.",
    thumbnail: "/placeholder.svg",
    provider: {
      name: "ColabApes Learning",
      logo: "/placeholder.svg"
    },
    instructor: {
      name: "Alex Chen",
      title: "Senior Frontend Developer",
      avatar: "/placeholder.svg"
    },
    duration: "12 weeks",
    enrolled: 2345,
    rating: 4.9,
    progress: 15,
    modules: [
      {
        id: 1,
        title: "HTML & CSS Fundamentals",
        duration: "3 hours",
        completed: true,
        lessons: [
          { id: 1, title: "HTML Basics", duration: "45 min", completed: true },
          { id: 2, title: "CSS Styling", duration: "45 min", completed: true },
          { id: 3, title: "Responsive Design", duration: "45 min", completed: true },
          { id: 4, title: "Flexbox & Grid", duration: "45 min", completed: false }
        ]
      },
      {
        id: 2,
        title: "JavaScript Essentials",
        duration: "4 hours",
        completed: false,
        lessons: [
          { id: 5, title: "JS Fundamentals", duration: "1 hour", completed: false },
          { id: 6, title: "DOM Manipulation", duration: "1 hour", completed: false },
          { id: 7, title: "Events", duration: "1 hour", completed: false },
          { id: 8, title: "Async Programming", duration: "1 hour", completed: false }
        ]
      }
    ],
    skills: ["HTML", "CSS", "JavaScript", "React", "Next.js", "TypeScript"],
    certificate: {
      available: true,
      type: "Professional Certificate"
    }
  }
};

export default function CoursePage({ params }: { params: { courseId: string } }) {
  const [activeTab, setActiveTab] = useState("content");
  const course = mockCourseData[params.courseId as keyof typeof mockCourseData];

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Course not found</h1>
        <Link href="/learning">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Learning
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      {/* Back Button */}
      <Link href="/learning">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Learning
        </Button>
      </Link>

      {/* Course Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-muted-foreground mb-4">{course.description}</p>
          
          {/* Instructor Info */}
          <div className="flex items-center gap-4 mb-4">
            <Image
              src={course.instructor.avatar}
              alt={course.instructor.name}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <h3 className="font-semibold">{course.instructor.name}</h3>
              <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
            </div>
          </div>

          {/* Course Stats */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{course.enrolled.toLocaleString()} enrolled</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Certificate Included</span>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={course.progress} className="mb-4" />
            <p className="text-sm text-muted-foreground mb-4">{course.progress}% Complete</p>
            <Button className="w-full" size="lg">
              <Play className="mr-2 h-4 w-4" />
              Continue Learning
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Course Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="content">Course Content</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <Card>
            <ScrollArea className="h-[600px]">
              <div className="p-6">
                {course.modules.map((module) => (
                  <div key={module.id} className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{module.title}</h3>
                        <p className="text-sm text-muted-foreground">{module.duration}</p>
                      </div>
                      {module.completed && (
                        <Badge variant="secondary">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-3">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <BookOpen className="h-4 w-4" />
                            <span>{lesson.title}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                            {lesson.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="overview">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Skills You'll Learn</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Certificate</h3>
                  <p className="text-muted-foreground">
                    Upon completion, you'll receive a {course.certificate.type} that you can share with your network.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Course Structure</h3>
                  <ul className="list-disc list-inside text-muted-foreground">
                    <li>{course.modules.length} modules</li>
                    <li>{course.modules.reduce((acc, module) => acc + module.lessons.length, 0)} lessons</li>
                    <li>Hands-on projects</li>
                    <li>Interactive quizzes</li>
                    <li>Peer discussions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
