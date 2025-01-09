import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Trophy, Target, BookOpen, Gamepad2, Code, Palette, Brain, Rocket } from "lucide-react";

interface CourseProgress {
  id: string;
  title: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  lastAccessed: string;
  estimatedTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: "Investment" | "Game Design" | "Programming" | "Art" | "AI" | "Business";
  icon: React.ReactNode;
}

const DEMO_COURSES: CourseProgress[] = [
  {
    id: "1",
    title: "Investment Courses",
    progress: 75,
    totalModules: 12,
    completedModules: 9,
    lastAccessed: "2 hours ago",
    estimatedTime: "2 hours remaining",
    difficulty: "Beginner",
    category: "Investment",
    icon: <Rocket className="h-4 w-4" />,
  },
  {
    id: "2",
    title: "Game Development Courses",
    progress: 30,
    totalModules: 8,
    completedModules: 2,
    lastAccessed: "1 day ago",
    estimatedTime: "4 hours remaining",
    difficulty: "Advanced",
    category: "Game Design",
    icon: <Gamepad2 className="h-4 w-4" />,
  },
  {
    id: "3",
    title: "Programming Courses",
    progress: 45,
    totalModules: 10,
    completedModules: 4,
    lastAccessed: "3 hours ago",
    estimatedTime: "5 hours remaining",
    difficulty: "Beginner",
    category: "Programming",
    icon: <Code className="h-4 w-4" />,
  },
  {
    id: "4",
    title: "Art and Design Courses",
    progress: 20,
    totalModules: 15,
    completedModules: 3,
    lastAccessed: "5 hours ago",
    estimatedTime: "8 hours remaining",
    difficulty: "Intermediate",
    category: "Art",
    icon: <Palette className="h-4 w-4" />,
  },
  {
    id: "5",
    title: "AI and Machine Learning",
    progress: 60,
    totalModules: 20,
    completedModules: 12,
    lastAccessed: "1 hour ago",
    estimatedTime: "6 hours remaining",
    difficulty: "Intermediate",
    category: "AI",
    icon: <Brain className="h-4 w-4" />,
  },
  {
    id: "6",
    title: "Business Courses",
    progress: 35,
    totalModules: 8,
    completedModules: 3,
    lastAccessed: "4 hours ago",
    estimatedTime: "4 hours remaining",
    difficulty: "Beginner",
    category: "Business",
    icon: <Rocket className="h-4 w-4" />,
  },
  {
    id: "7",
    title: "AI and Machine Learning",
    progress: 15,
    totalModules: 12,
    completedModules: 2,
    lastAccessed: "2 days ago",
    estimatedTime: "8 hours remaining",
    difficulty: "Advanced",
    category: "AI",
    icon: <Brain className="h-4 w-4" />,
  },
  {
    id: "8",
    title: "Business Courses",
    progress: 50,
    totalModules: 10,
    completedModules: 5,
    lastAccessed: "6 hours ago",
    estimatedTime: "4 hours remaining",
    difficulty: "Beginner",
    category: "Business",
    icon: <Rocket className="h-4 w-4" />,
  },
];

export function DashboardTab() {
  return (
    <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total Learning Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">42h</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Completed Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">5</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Current Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">3</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Skills Acquired
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">12</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between mt-8 mb-4">
        <h2 className="text-lg font-semibold">In Progress</h2>
        <div className="flex gap-2">
          {Array.from(new Set(DEMO_COURSES.map(course => course.category))).map((category) => (
            <Badge key={category} variant="outline" className="cursor-pointer hover:bg-secondary">
              {category}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {DEMO_COURSES.map((course) => (
          <Card key={course.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {course.icon}
                  <div>
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Last accessed {course.lastAccessed}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    course.difficulty === "Beginner"
                      ? "secondary"
                      : course.difficulty === "Intermediate"
                      ? "default"
                      : "destructive"
                  }
                >
                  {course.difficulty}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    {course.completedModules} of {course.totalModules} modules
                  </span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {course.estimatedTime}
                </span>
                <Button variant="ghost" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Continue Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
