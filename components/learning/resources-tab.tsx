import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ThumbsUp, Bookmark } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "Article" | "Video" | "Course" | "Tool";
  votes: number;
  tags: string[];
  contributor: string;
}

const DEMO_RESOURCES: Resource[] = [
  {
    id: "1",
    title: "Understanding Investment Fundamentals",
    description: "A comprehensive guide to getting started with investments",
    url: "https://example.com/investment-guide",
    type: "Article",
    votes: 128,
    tags: ["Beginner", "Fundamentals"],
    contributor: "Investment Academy",
  },
  {
    id: "2",
    title: "Market Analysis Masterclass",
    description: "Learn professional market analysis techniques",
    url: "https://example.com/market-analysis",
    type: "Course",
    votes: 89,
    tags: ["Advanced", "Analysis"],
    contributor: "Trading Experts",
  },
];

export function ResourcesTab() {
  return (
    <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
      <div className="space-y-4">
        {DEMO_RESOURCES.map((resource) => (
          <Card key={resource.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{resource.title}</h3>
                    <Badge variant="outline">{resource.type}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {resource.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {resource.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Contributed by {resource.contributor}
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 ml-4">
                  <Button variant="ghost" size="icon">
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">{resource.votes}</span>
                  <Button variant="ghost" size="icon">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                className="mt-4 w-full justify-between"
                onClick={() => window.open(resource.url, "_blank")}
              >
                Visit Resource
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
