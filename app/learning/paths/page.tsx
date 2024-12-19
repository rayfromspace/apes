"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Course {
  id: string;
  title: string;
  duration: string;
  completed?: boolean;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  level: string;
  progress?: number;
  image: string;
  courses: Course[];
  skills: string[];
}

const learningPaths: LearningPath[] = [
  {
    id: "1",
    title: "Blockchain Developer Path",
    description: "Become a professional blockchain developer",
    category: "Development",
    duration: "6 months",
    level: "Intermediate",
    progress: 35,
    image: "/path-images/blockchain.jpg",
    courses: [
      { id: "1", title: "Web3 Fundamentals", duration: "4 weeks", completed: true },
      { id: "2", title: "Smart Contract Development", duration: "6 weeks", completed: true },
      { id: "3", title: "DApp Architecture", duration: "8 weeks" },
      { id: "4", title: "Advanced Blockchain Concepts", duration: "6 weeks" },
    ],
    skills: ["Solidity", "Web3.js", "Smart Contracts", "DApp Development"],
  },
  {
    id: "2",
    title: "Digital Product Designer",
    description: "Master end-to-end product design",
    category: "Design",
    duration: "4 months",
    level: "Beginner",
    image: "/path-images/product-design.jpg",
    courses: [
      { id: "5", title: "UI Design Basics", duration: "3 weeks" },
      { id: "6", title: "UX Research", duration: "4 weeks" },
      { id: "7", title: "Product Strategy", duration: "4 weeks" },
      { id: "8", title: "Design Systems", duration: "5 weeks" },
    ],
    skills: ["UI Design", "UX Research", "Product Strategy", "Design Systems"],
  },
];

export default function LearningPaths() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPaths = learningPaths.filter((path) =>
    path.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Learning Paths</h1>
        <p className="text-muted-foreground">
          Structured learning paths to achieve your career goals
        </p>
      </div>

      <Input
        placeholder="Search learning paths..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-md"
      />

      <div className="grid gap-8 md:grid-cols-2">
        {filteredPaths.map((path) => (
          <Card key={path.id} className="flex flex-col">
            <div className="relative aspect-video">
              <img
                src={path.image}
                alt={path.title}
                className="object-cover w-full h-full rounded-t-lg"
              />
              {path.progress && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50">
                  <Progress value={path.progress} className="h-2" />
                  <p className="text-xs text-white text-center mt-1">
                    {path.progress}% Complete
                  </p>
                </div>
              )}
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{path.title}</CardTitle>
                <Badge variant="secondary">{path.level}</Badge>
              </div>
              <CardDescription>{path.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">{path.duration}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Category</p>
                  <p className="font-medium">{path.category}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Skills You'll Learn</h4>
                <div className="flex flex-wrap gap-2">
                  {path.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Accordion type="single" collapsible>
                <AccordionItem value="courses">
                  <AccordionTrigger>Course Curriculum</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {path.courses.map((course) => (
                        <div
                          key={course.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-muted"
                        >
                          <div className="flex items-center gap-2">
                            {course.completed ? (
                              <span className="text-green-500">✓</span>
                            ) : (
                              <span className="text-muted-foreground">○</span>
                            )}
                            <span>{course.title}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {course.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button className="w-full">
                {path.progress ? "Continue Learning" : "Start Learning Path"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
