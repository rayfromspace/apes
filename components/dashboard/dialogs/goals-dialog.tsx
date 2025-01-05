"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string;
  completed: boolean;
  createdAt: string;
}

interface GoalsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Demo goals for development
const DEMO_GOALS: Goal[] = [
  {
    id: "1",
    title: "Launch MVP",
    description: "Complete and launch the minimum viable product",
    deadline: "2024-03-01",
    completed: false,
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    title: "Secure Seed Funding",
    description: "Raise initial seed funding round",
    deadline: "2024-06-30",
    completed: false,
    createdAt: "2024-01-01",
  },
];

export function GoalsDialog({ open, onOpenChange }: GoalsDialogProps) {
  const [activeTab, setActiveTab] = useState("current");
  const [goals, setGoals] = useState<Goal[]>(DEMO_GOALS);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const handleAddGoal = () => {
    const goal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      title: newGoal.title,
      description: newGoal.description,
      deadline: newGoal.deadline,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setGoals([...goals, goal]);
    setNewGoal({ title: "", description: "", deadline: "" });
  };

  const toggleGoalCompletion = (goalId: string) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Goals Management</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="current" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">Current Goals</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="add">Add New</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {goals.filter(goal => !goal.completed).map((goal) => (
                  <div key={goal.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{goal.title}</h4>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          Due: {format(new Date(goal.deadline), "MMM d, yyyy")}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleGoalCompletion(goal.id)}
                      >
                        Complete
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteGoal(goal.id)}
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
                {goals.filter(goal => goal.completed).map((goal) => (
                  <div key={goal.id} className="flex items-start justify-between p-4 border rounded-lg opacity-70">
                    <div className="space-y-1">
                      <h4 className="font-medium line-through">{goal.title}</h4>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          Completed
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteGoal(goal.id)}
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
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="Enter goal title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="Enter goal description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleAddGoal}
                disabled={!newGoal.title || !newGoal.description || !newGoal.deadline}
              >
                Add Goal
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
