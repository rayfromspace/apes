"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Send, BookOpen, Code, Trophy, Users, MessageSquare } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function LearningPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setIsExpanded(true);
    const newMessage: Message = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    // TODO: Implement AI response logic
    setTimeout(() => {
      const aiResponse: Message = {
        role: 'assistant',
        content: 'This is a placeholder response. The AI chatbot integration will be implemented soon.'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Learning Pool</h1>
        <p className="text-muted-foreground text-lg mb-12">
          Enhance your skills with AI-powered learning and hands-on project experience.
        </p>

        {/* AI Chat Section */}
        {isExpanded ? (
          <Card className="mb-12 bg-card/50 backdrop-blur p-6">
            <div className="space-y-4">
              <div className="min-h-[200px] max-h-[400px] overflow-y-auto space-y-4 mb-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                      Thinking...
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <Input
                  placeholder="Continue your conversation..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="pr-24"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                  <Button size="icon" variant="ghost">
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button size="icon" onClick={handleSend}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Input
                placeholder="What do you want to learn today?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className={cn(
                  "pr-24 h-14 text-lg transition-all duration-300",
                  "hover:shadow-[0_0_15px_rgba(0,200,0,0.3)] focus:shadow-[0_0_20px_rgba(0,200,0,0.4)]",
                  "border-2 hover:border-green-500/30 focus:border-green-500/40"
                )}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                <Button size="icon" variant="ghost" className="h-10 w-10">
                  <Mic className="h-5 w-5" />
                </Button>
                <Button 
                  size="icon" 
                  onClick={handleSend}
                  className="h-10 w-10 bg-green-500/80 hover:bg-green-500"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Course Categories */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              title: "Technical Skills",
              icon: Code,
              description: "Programming, blockchain, AI/ML",
            },
            {
              title: "Project Management",
              icon: BookOpen,
              description: "Planning, coordination, management",
            },
            {
              title: "Collaboration",
              icon: Users,
              description: "Team skills, communication",
            },
            {
              title: "Achievements",
              icon: Trophy,
              description: "Progress tracking, certificates",
            },
          ].map((category, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="h-5 w-5 text-primary" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Courses */}
        <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: "AI for Business",
              image: "/placeholder.jpg",
              description: "Learn how to leverage AI in business",
            },
            {
              title: "Web Development Fundamentals",
              image: "/placeholder.jpg",
              description: "Master modern web development",
            },
          ].map((course, index) => (
            <Card
              key={index}
              className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{course.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}