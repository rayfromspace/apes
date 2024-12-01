"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, AlertCircle, Calendar, Clock } from "lucide-react";
import { format, isBefore, isToday } from "date-fns";
import { cn } from "@/lib/utils";

interface Deadline {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  dueDate: Date;
  type: 'milestone' | 'deliverable' | 'meeting';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
}

const DEMO_DEADLINES: Deadline[] = [
  {
    id: "1",
    projectId: "1",
    projectName: "DeFi Trading Platform",
    title: "Smart Contract Audit",
    dueDate: new Date(Date.now() + 172800000), // 2 days from now
    type: 'milestone',
    priority: 'high',
    status: 'pending',
  },
  {
    id: "2",
    projectId: "2",
    projectName: "AI Content Creator",
    title: "Beta Testing Phase",
    dueDate: new Date(Date.now() + 86400000), // tomorrow
    type: 'deliverable',
    priority: 'medium',
    status: 'pending',
  },
  {
    id: "3",
    projectId: "3",
    projectName: "Supply Chain Solution",
    title: "Stakeholder Meeting",
    dueDate: new Date(),
    type: 'meeting',
    priority: 'high',
    status: 'pending',
  },
];

function DeadlineCard({ deadline }: { deadline: Deadline }) {
  const getPriorityStyles = (priority: Deadline['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-50 dark:bg-red-950/20';
      case 'medium':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
      case 'low':
        return 'text-green-500 bg-green-50 dark:bg-green-950/20';
    }
  };

  const getTypeIcon = (type: Deadline['type']) => {
    switch (type) {
      case 'milestone':
        return <Star className="h-4 w-4" />;
      case 'deliverable':
        return <AlertCircle className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-primary">{getTypeIcon(deadline.type)}</span>
            <h3 className="font-medium">{deadline.title}</h3>
          </div>
          <Badge 
            variant="secondary"
            className={cn(
              "capitalize",
              getPriorityStyles(deadline.priority)
            )}
          >
            {deadline.priority}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{deadline.projectName}</span>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className={cn(
              "font-medium",
              isToday(deadline.dueDate) ? "text-yellow-500" :
              isBefore(deadline.dueDate, new Date()) ? "text-red-500" :
              "text-muted-foreground"
            )}>
              {isToday(deadline.dueDate) ? "Today" : format(deadline.dueDate, "MMM d")}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function DeadlinesList() {
  const sortedDeadlines = [...DEMO_DEADLINES].sort((a, b) => 
    a.dueDate.getTime() - b.dueDate.getTime()
  );

  return (
    <div className="space-y-4">
      {sortedDeadlines.map((deadline) => (
        <DeadlineCard key={deadline.id} deadline={deadline} />
      ))}
    </div>
  );
}