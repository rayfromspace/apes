import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Trophy, Target, BookOpen } from "lucide-react";

interface CourseProgress {
  id: string;
  title: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  lastAccessed: string;
  estimatedTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

const DEMO_COURSES: CourseProgress[] = [
  {
    id: "1",
    title: "Investment Fundamentals",
    progress: 75,
    totalModules: 12,
    completedModules: 9,
    lastAccessed: "2 hours ago",
    estimatedTime: "2 hours remaining",
    difficulty: "Beginner",
  },
  {
    id: "2",
    title: "Advanced Market Analysis",
    progress: 30,
    totalModules: 8,
    completedModules: 2,
    lastAccessed: "1 day ago",
    estimatedTime: "4 hours remaining",
    difficulty: "Advanced",
  },
];

export function DashboardTab() {
  return (
    <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total Learning Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">24h</span>
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
              <span className="text-2xl font-bold">3</span>
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
              <span className="text-2xl font-bold">2</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="mt-8 mb-4 text-lg font-semibold">In Progress</h2>
      <div className="space-y-4">
        {DEMO_COURSES.map((course) => (
          <Card key={course.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Last accessed {course.lastAccessed}
                  </p>
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
                <Progress value={course.progress} />
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
