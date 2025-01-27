"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Layout, BookOpen, MessageSquare, BookMarked, Download } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "document" | "video" | "ebook" | "link";
  category: string;
  author: string;
  downloadCount: number;
  fileSize?: string;
  duration?: string;
  tags: string[];
  url: string;
}

const resources: Resource[] = [
  {
    id: "1",
    title: "Web3 Development Guide",
    description: "Comprehensive guide to blockchain development",
    type: "document",
    category: "Development",
    author: "John Doe",
    downloadCount: 1234,
    fileSize: "2.5 MB",
    tags: ["Web3", "Blockchain", "Development"],
    url: "/resources/web3-guide.pdf",
  },
  {
    id: "2",
    title: "Product Design Masterclass",
    description: "Video course on digital product design",
    type: "video",
    category: "Design",
    author: "Jane Smith",
    downloadCount: 892,
    duration: "2h 30m",
    tags: ["Design", "UI/UX", "Product"],
    url: "/resources/design-masterclass.mp4",
  },
  // Add more resources as needed
];

export default function ResourceLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || resource.type === typeFilter;
    const matchesCategory =
      categoryFilter === "all" || resource.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "document":
        return <Download className="h-6 w-6" />;
      case "video":
        return <Video className="h-6 w-6" />;
      case "ebook":
        return <Book className="h-6 w-6" />;
      case "link":
        return <Link className="h-6 w-6" />;
      default:
        return <Download className="h-6 w-6" />;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Learning Resources</CardTitle>
          <CardDescription>
            Track your progress, access learning materials, and engage with the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="learning-path" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Learning Path
              </TabsTrigger>
              <TabsTrigger value="discussion" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Discussion
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2">
                <BookMarked className="h-4 w-4" />
                Resources
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <Card className="card-glass">
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                  <CardDescription>Track your learning journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card className="shadow-soft">
                        <CardHeader className="space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Completed Lessons
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">12/24</div>
                          <p className="text-xs text-muted-foreground">
                            50% complete
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="shadow-soft">
                        <CardHeader className="space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Learning Streak
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">7 days</div>
                          <p className="text-xs text-muted-foreground">
                            Keep it up!
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="shadow-soft">
                        <CardHeader className="space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Time Spent
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">24h</div>
                          <p className="text-xs text-muted-foreground">
                            This week
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="shadow-soft">
                        <CardHeader className="space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Resources Completed
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">8</div>
                          <p className="text-xs text-muted-foreground">
                            +2 this week
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="learning-path">
              <Card className="card-glass">
                <CardHeader>
                  <CardTitle>Learning Path</CardTitle>
                  <CardDescription>Your structured learning journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {/* Add your learning path content here */}
                    <p>Learning path content coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="discussion">
              <Card className="card-glass">
                <CardHeader>
                  <CardTitle>Discussion</CardTitle>
                  <CardDescription>Engage with your learning community</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {/* Add your discussion content here */}
                    <p>Discussion forum coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources">
              <Card className="card-glass">
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                  <CardDescription>Access your learning materials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      placeholder="Search resources..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="max-w-sm"
                    />
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="md:w-1/4">
                        <SelectValue placeholder="Resource Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="document">Documents</SelectItem>
                        <SelectItem value="video">Videos</SelectItem>
                        <SelectItem value="ebook">E-Books</SelectItem>
                        <SelectItem value="link">Links</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="md:w-1/4">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Development">Development</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredResources.map((resource) => (
                        <Card key={resource.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                {getResourceIcon(resource.type)}
                                <div>
                                  <CardTitle className="text-xl">{resource.title}</CardTitle>
                                  <CardDescription>{resource.author}</CardDescription>
                                </div>
                              </div>
                              <Badge variant="secondary" className="capitalize">
                                {resource.type}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                              {resource.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {resource.tags.map((tag) => (
                                <Badge key={tag} variant="outline">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Category</p>
                                <p className="font-medium">{resource.category}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Downloads</p>
                                <p className="font-medium">
                                  {resource.downloadCount.toLocaleString()}
                                </p>
                              </div>
                              {resource.fileSize && (
                                <div>
                                  <p className="text-muted-foreground">Size</p>
                                  <p className="font-medium">{resource.fileSize}</p>
                                </div>
                              )}
                              {resource.duration && (
                                <div>
                                  <p className="text-muted-foreground">Duration</p>
                                  <p className="font-medium">{resource.duration}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button className="w-full" asChild>
                              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4" />
                                Download Resource
                              </a>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
