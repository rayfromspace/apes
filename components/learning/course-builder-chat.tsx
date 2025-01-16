"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Bot, User, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { courseService, type CourseQuery, type CourseRecommendation } from "@/lib/mock-course-service";
import CourseCard from "./course-card";

interface Message {
  role: "assistant" | "user";
  content: string;
  options?: string[];
  recommendations?: CourseRecommendation[];
}

// Chat flow configuration
const CHAT_FLOW = {
  INITIAL: {
    content: "Hi! I'm your Course Building Assistant. Let's find the perfect courses for you. What skills would you like to learn?",
    options: [
      "Programming & Development",
      "Data Science & Analytics",
      "Digital Marketing",
      "Design & UX",
      "Business & Management",
      "AI & Machine Learning"
    ]
  },
  SKILL_LEVEL: {
    content: "Great choice! What's your current level in this area?",
    options: ["Beginner", "Intermediate", "Advanced"]
  },
  TIME_COMMITMENT: {
    content: "How much time can you dedicate to learning per week?",
    options: ["2-4 hours", "4-8 hours", "8+ hours"]
  },
  LEARNING_STYLE: {
    content: "Last question: What's your preferred learning style?",
    options: [
      "Project-based learning",
      "Video lectures",
      "Interactive exercises",
      "Reading materials"
    ]
  }
};

export default function CourseBuilderChat() {
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: CHAT_FLOW.INITIAL.content,
    options: CHAT_FLOW.INITIAL.options
  }]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [userResponses, setUserResponses] = useState<Partial<CourseQuery>>({});

  const handleSendMessage = async (content: string) => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setIsExpanded(true);
    }

    // Add user message
    const userMessage: Message = {
      role: "user",
      content
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Update user responses based on chat flow
    const currentStep = messages.length;
    let nextQuestion: Message | null = null;
    let updatedResponses = { ...userResponses };

    switch (currentStep) {
      case 1: // After selecting interest
        updatedResponses.interest = content;
        nextQuestion = {
          role: "assistant",
          content: CHAT_FLOW.SKILL_LEVEL.content,
          options: CHAT_FLOW.SKILL_LEVEL.options
        };
        break;
      case 3: // After selecting level
        updatedResponses.level = content;
        nextQuestion = {
          role: "assistant",
          content: CHAT_FLOW.TIME_COMMITMENT.content,
          options: CHAT_FLOW.TIME_COMMITMENT.options
        };
        break;
      case 5: // After selecting time commitment
        updatedResponses.timeCommitment = content;
        nextQuestion = {
          role: "assistant",
          content: CHAT_FLOW.LEARNING_STYLE.content,
          options: CHAT_FLOW.LEARNING_STYLE.options
        };
        break;
      case 7: // After selecting learning style
        updatedResponses.learningStyle = content;
        // Get course recommendations
        try {
          const recommendations = await courseService.getRecommendations(updatedResponses as CourseQuery);
          nextQuestion = {
            role: "assistant",
            content: "Based on your preferences, here are some courses I think you'll love:",
            recommendations
          };
        } catch (error) {
          nextQuestion = {
            role: "assistant",
            content: "I apologize, but I couldn't fetch course recommendations at the moment. Please try again later.",
            options: ["Start Over"]
          };
        }
        break;
      default:
        if (content === "Start Over") {
          setUserResponses({});
          setMessages([{
            role: "assistant",
            content: CHAT_FLOW.INITIAL.content,
            options: CHAT_FLOW.INITIAL.options
          }]);
          setIsLoading(false);
          return;
        }
    }

    setUserResponses(updatedResponses);

    if (nextQuestion) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessages(prev => [...prev, nextQuestion!]);
    }

    setIsLoading(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (!hasInteracted) {
    return (
      <Card 
        className="relative bg-card/50 border-primary/20 cursor-pointer hover:bg-card/60 transition-all duration-300"
        onClick={() => {
          setHasInteracted(true);
          setIsExpanded(true);
        }}
      >
        <div className="p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <Input
            placeholder="Ask me to build a personalized course path for you..."
            className="flex-1 bg-transparent border-none focus:ring-0 cursor-pointer"
            readOnly
          />
          <Button size="icon" className="bg-primary hover:bg-primary/90">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "flex flex-col bg-card/50 border-primary/20 transition-all duration-300",
        isExpanded ? "h-[600px]" : "h-[150px]"
      )}
    >
      {/* Header */}
      <div className="p-3 border-b border-primary/20 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <span className="font-medium">Course Builder Assistant</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleExpanded}
          className="hover:bg-primary/10"
        >
          {isExpanded ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "ml-auto flex-row-reverse" : "max-w-[80%]"
              )}
            >
              {/* Avatar */}
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                message.role === "assistant" ? "bg-primary/20" : "bg-muted"
              )}>
                {message.role === "assistant" ? (
                  <Bot className="w-4 h-4 text-primary" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>

              {/* Message Content */}
              <div className={cn(
                "rounded-lg p-4",
                message.role === "assistant" 
                  ? "bg-card border border-primary/20" 
                  : "bg-primary text-primary-foreground"
              )}>
                <p className={cn(
                  "text-sm",
                  message.role === "assistant" && "text-foreground"
                )}>{message.content}</p>
                
                {/* Options */}
                {message.options && isExpanded && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.options.map((option, idx) => (
                      <Button
                        key={idx}
                        variant="secondary"
                        size="sm"
                        className="bg-muted hover:bg-muted/80 text-foreground"
                        onClick={() => handleSendMessage(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Course Recommendations */}
                {message.recommendations && isExpanded && (
                  <div className="mt-4 grid gap-4">
                    {message.recommendations.map((recommendation, idx) => (
                      <div key={idx} className="space-y-4">
                        {recommendation.courses.map(course => (
                          <CourseCard
                            key={course.id}
                            course={course}
                            matchScore={recommendation.matchScore}
                            reason={recommendation.reason}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Message */}
          {isLoading && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="rounded-lg p-4 bg-card border border-primary/20">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-primary/20">
        <div className="relative">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputMessage.trim()) {
                handleSendMessage(inputMessage.trim());
              }
            }}
            placeholder="Type your message..."
            className="w-full rounded-full pl-4 pr-12 py-2 bg-background border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90"
            onClick={() => inputMessage.trim() && handleSendMessage(inputMessage.trim())}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}