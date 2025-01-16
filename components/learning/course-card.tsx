"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, Users, Award, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Course } from "@/lib/mock-course-service";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
  matchScore?: number;
  reason?: string;
}

export default function CourseCard({ course, matchScore, reason }: CourseCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-primary/20 bg-card">
      <div className="relative h-40">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
        
        {/* Provider Logo */}
        <div className="absolute top-2 left-2 bg-white rounded-full p-1">
          <Image
            src={course.provider.logo}
            alt={course.provider.name}
            width={24}
            height={24}
            className="rounded-full"
          />
        </div>
        
        {/* Match Score */}
        {matchScore && (
          <div className="absolute top-2 right-2">
            <Badge variant="default" className="bg-primary text-primary-foreground">
              {Math.round(matchScore * 100)}% Match
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        {/* Title and Provider */}
        <div className="mb-2">
          <h3 className="font-semibold text-lg line-clamp-1 text-foreground">
            {course.title}
          </h3>
          <p className="text-sm text-muted-foreground">{course.provider.name}</p>
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span>{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{(course.enrolledCount / 1000).toFixed(1)}k</span>
          </div>
        </div>
        
        {/* Skills */}
        <div className="flex flex-wrap gap-1 mb-3">
          {course.skills.map((skill) => (
            <Badge 
              key={skill}
              variant="secondary"
              className="text-xs bg-muted hover:bg-muted/80 text-foreground"
            >
              {skill}
            </Badge>
          ))}
        </div>
        
        {/* Price and Certificate */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {course.price.isFree ? (
              <Badge variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                Free
              </Badge>
            ) : (
              <span className="font-medium text-foreground">
                ${course.price.amount} {course.price.currency}
              </span>
            )}
            {course.certificate.available && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Award className="h-4 w-4" />
                <span>Certificate</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Recommendation Reason */}
        {reason && (
          <p className="text-sm text-muted-foreground mb-3 italic">
            "{reason}"
          </p>
        )}
        
        {/* Action Button */}
        <Button 
          className="w-full bg-primary hover:bg-primary/90"
          onClick={() => window.location.href = `/learning/${course.id}`}
        >
          Start Learning
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}