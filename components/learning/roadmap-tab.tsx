import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  progress: number;
}

const DEMO_ROADMAP: RoadmapItem[] = [
  {
    id: "1",
    title: "Fundamentals of Investing",
    description: "Learn the basics of investment strategies and concepts",
    completed: true,
    progress: 100,
  },
  {
    id: "2",
    title: "Market Analysis",
    description: "Understanding market trends and analysis techniques",
    completed: false,
    progress: 60,
  },
  {
    id: "3",
    title: "Portfolio Management",
    description: "Learn how to build and manage an investment portfolio",
    completed: false,
    progress: 30,
  },
  {
    id: "4",
    title: "Risk Management",
    description: "Understanding and managing investment risks",
    completed: false,
    progress: 0,
  },
];

export function RoadmapTab() {
  return (
    <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
      <div className="space-y-4">
        {DEMO_ROADMAP.map((item) => (
          <Card key={item.id} className="relative overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full w-1 ${
                item.completed ? "bg-green-500" : "bg-muted"
              }`}
            />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {item.title}
                </CardTitle>
                {item.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {item.description}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{item.progress}%</span>
                </div>
                <Progress value={item.progress} />
              </div>
              <Button
                variant="ghost"
                className="mt-4 w-full justify-between"
                disabled={item.completed}
              >
                {item.completed ? "Completed" : "Continue Learning"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
