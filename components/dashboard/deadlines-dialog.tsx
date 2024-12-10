"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

interface Deadline {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  project?: string;
}

// Demo deadlines for development
const DEMO_DEADLINES: Deadline[] = [
  {
    id: "1",
    title: "Project Proposal Due",
    description: "Submit final project proposal to the board",
    date: "2024-01-15",
    priority: "high",
    completed: false,
    project: "DeFi Trading Platform",
  },
  {
    id: "2",
    title: "Investor Meeting",
    description: "Present Q1 progress to investors",
    date: "2024-01-20",
    priority: "high",
    completed: false,
  },
];

interface DeadlinesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeadlinesDialog({ open, onOpenChange }: DeadlinesDialogProps) {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [deadlines, setDeadlines] = useState<Deadline[]>(DEMO_DEADLINES);
  const [newDeadline, setNewDeadline] = useState({
    title: "",
    description: "",
    date: "",
    priority: "medium",
  });

  const handleAddDeadline = () => {
    const deadline: Deadline = {
      id: Math.random().toString(36).substr(2, 9),
      title: newDeadline.title,
      description: newDeadline.description,
      date: newDeadline.date,
      priority: newDeadline.priority as "high" | "medium" | "low",
      completed: false,
    };

    setDeadlines([...deadlines, deadline]);
    setNewDeadline({ title: "", description: "", date: "", priority: "medium" });
  };

  const toggleDeadlineCompletion = (deadlineId: string) => {
    setDeadlines(deadlines.map(deadline => 
      deadline.id === deadlineId ? { ...deadline, completed: !deadline.completed } : deadline
    ));
  };

  const deleteDeadline = (deadlineId: string) => {
    setDeadlines(deadlines.filter(deadline => deadline.id !== deadlineId));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Deadlines</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="add">Add New</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {deadlines
                  .filter(deadline => !deadline.completed)
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((deadline) => (
                    <div key={deadline.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">{deadline.title}</h4>
                        <p className="text-sm text-muted-foreground">{deadline.description}</p>
                        <div className="flex gap-2">
                          <Badge>
                            <Calendar className="w-3 h-3 mr-1" />
                            {format(new Date(deadline.date), "MMM d, yyyy")}
                          </Badge>
                          <Badge variant={
                            deadline.priority === "high" ? "destructive" : 
                            deadline.priority === "medium" ? "default" : 
                            "secondary"
                          }>
                            {deadline.priority}
                          </Badge>
                          {deadline.project && (
                            <Badge variant="outline">{deadline.project}</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleDeadlineCompletion(deadline.id)}
                        >
                          Complete
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteDeadline(deadline.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="completed">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {deadlines
                  .filter(deadline => deadline.completed)
                  .map((deadline) => (
                    <div key={deadline.id} className="flex items-start justify-between p-4 border rounded-lg opacity-70">
                      <div className="space-y-1">
                        <h4 className="font-medium line-through">{deadline.title}</h4>
                        <p className="text-sm text-muted-foreground">{deadline.description}</p>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteDeadline(deadline.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="add">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Deadline Title</Label>
                <Input
                  id="title"
                  value={newDeadline.title}
                  onChange={(e) => setNewDeadline({ ...newDeadline, title: e.target.value })}
                  placeholder="Enter deadline title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newDeadline.description}
                  onChange={(e) => setNewDeadline({ ...newDeadline, description: e.target.value })}
                  placeholder="Enter deadline description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newDeadline.date}
                  onChange={(e) => setNewDeadline({ ...newDeadline, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  className="w-full p-2 border rounded-md"
                  value={newDeadline.priority}
                  onChange={(e) => setNewDeadline({ ...newDeadline, priority: e.target.value })}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <Button 
                className="w-full" 
                onClick={handleAddDeadline}
                disabled={!newDeadline.title || !newDeadline.description || !newDeadline.date}
              >
                Add Deadline
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
