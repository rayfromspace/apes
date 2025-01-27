"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpen, MessageSquare, BookMarked, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const MOCK_COMMENTS = [
  {
    id: 1,
    author: "Alex Thompson",
    avatar: "/avatars/01.png",
    content: "This resource was incredibly helpful for understanding the basics!",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    author: "Sarah Chen",
    avatar: "/avatars/02.png",
    content: "Great explanation of complex concepts. Looking forward to more content like this.",
    timestamp: "5 hours ago",
  },
];

export default function PoolResources() {
  const params = useParams();
  const poolId = params.id as string;
  const [comment, setComment] = useState("");

  return (
    <div className="container mx-auto py-8">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Investment Fundamentals</CardTitle>
          <CardDescription>Master the basics of investment strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="resources" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="resources" className="flex items-center gap-2">
                <BookMarked className="h-4 w-4" />
                Resources
              </TabsTrigger>
              <TabsTrigger value="lessons" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Lessons
              </TabsTrigger>
              <TabsTrigger value="discussion" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Discussion
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resources">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="card-glass">
                  <CardHeader>
                    <CardTitle>Getting Started Guide</CardTitle>
                    <CardDescription>Essential concepts and terminology</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary">Beginner</Badge>
                      <Badge variant="outline">PDF</Badge>
                    </div>
                    <Button className="w-full">Access Resource</Button>
                  </CardContent>
                </Card>

                <Card className="card-glass">
                  <CardHeader>
                    <CardTitle>Market Analysis Toolkit</CardTitle>
                    <CardDescription>Tools and templates for analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary">Intermediate</Badge>
                      <Badge variant="outline">Spreadsheet</Badge>
                    </div>
                    <Button className="w-full">Access Resource</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="lessons">
              <div className="space-y-6">
                <Card className="card-glass">
                  <CardHeader>
                    <CardTitle>Module 1: Investment Basics</CardTitle>
                    <CardDescription>4 lessons • 2 hours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">1.1 Understanding Markets</h4>
                          <p className="text-sm text-muted-foreground">30 minutes</p>
                        </div>
                        <Button variant="outline">Start</Button>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">1.2 Asset Classes</h4>
                          <p className="text-sm text-muted-foreground">45 minutes</p>
                        </div>
                        <Button variant="outline">Start</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="discussion">
              <Card className="card-glass">
                <CardHeader>
                  <CardTitle>Community Discussion</CardTitle>
                  <CardDescription>Share your thoughts and questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-6">
                      {MOCK_COMMENTS.map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                          <Avatar>
                            <AvatarImage src={comment.avatar} />
                            <AvatarFallback>{comment.author[0]}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{comment.author}</span>
                              <span className="text-sm text-muted-foreground">
                                {comment.timestamp}
                              </span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2 mt-4">
                    <Input
                      placeholder="Write a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
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
