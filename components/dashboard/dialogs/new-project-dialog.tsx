"use client"

import * as React from "react"
import { Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';

interface ProjectFormData {
  projectName: string;
  projectDescription: string;
  projectType: 'product' | 'service';
  projectCategory: string;
  projectImage?: File;
}

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated?: (project: any) => void;
}

const digitalProductCategories = [
  "Video Games", "Digital Music", "Software/Apps", "Digital Art",
  "Online Courses", "Ebooks", "Digital Templates", "Virtual Goods"
];

const digitalServiceCategories = [
  "Music Production", "Video Editing", "Web Development", "Graphic Design",
  "Content Creation", "Digital Marketing", "Virtual Assistance", "Online Coaching"
];

const defaultTasks = [
  {
    title: "Project Setup",
    description: "Set up initial project structure and requirements",
    priority: "high",
    status: "todo",
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
  },
  {
    title: "Team Onboarding",
    description: "Onboard team members and assign initial roles",
    priority: "high",
    status: "todo",
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
  },
  {
    title: "Project Timeline",
    description: "Create detailed project timeline and milestones",
    priority: "medium",
    status: "todo",
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
  }
];

const defaultEvents = [
  {
    title: "Project Kickoff Meeting",
    description: "Initial team meeting to discuss project goals and timeline",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    start_time: "10:00:00",
    duration: 60,
    type: "meeting",
    is_virtual: true,
  },
  {
    title: "First Sprint Planning",
    description: "Plan the first sprint and assign tasks",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
    start_time: "14:00:00",
    duration: 90,
    type: "meeting",
    is_virtual: true,
  }
];

export function NewProjectDialog({ open, onOpenChange, onProjectCreated }: NewProjectDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const [session, setSession] = useState<Session | null>(null);
  const [formData, setFormData] = React.useState<ProjectFormData>({
    projectName: "",
    projectDescription: "",
    projectType: "product",
    projectCategory: "",
  });
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  useEffect(() => {
    if (!open) {
      setFormData({
        projectName: "",
        projectDescription: "",
        projectType: "product",
        projectCategory: "",
      });
      setIsSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.projectName?.trim()) {
        throw new Error('Project name is required');
      }

      if (!session?.user) {
        toast({
          title: "Authentication Error",
          description: "Please sign in to create a project",
          variant: "destructive",
        });
        return;
      }

      console.log('Creating project with data:', {
        name: formData.projectName.trim(),
        description: formData.projectDescription.trim(),
        founder_id: session.user.id
      });

      // Create project with minimal fields
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          name: formData.projectName.trim(),
          description: formData.projectDescription.trim(),
          founder_id: session.user.id
        })
        .select()
        .single();

      if (projectError) {
        console.error('Project creation error:', projectError);
        throw new Error(`Failed to create project: ${projectError.message}`);
      }

      console.log('Project created successfully:', project);

      // Create initial team member entry for founder
      const { error: teamError } = await supabase
        .from('team_members')
        .insert({
          project_id: project.id,
          user_id: session.user.id,
          role: 'founder'
        });

      if (teamError) {
        console.error('Team member creation error:', teamError);
        throw new Error('Failed to set up team membership');
      }

      console.log('Team member created successfully');

      toast({
        title: "Success",
        description: "Project created successfully!",
      });

      if (onProjectCreated) {
        onProjectCreated(project);
      }

      // Close dialog and redirect
      onOpenChange(false);
      
      // Ensure dialog is closed before redirecting
      setTimeout(() => {
        router.push(`/projects/${project.id}`);
        router.refresh();
      }, 500);

    } catch (error) {
      console.error('Error in project creation:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData(prev => ({ ...prev, projectImage: e.target.files![0] }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Create a new project to start collaborating with your team.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              placeholder="Enter project name"
            />
          </div>

          {/* Project Description */}
          <div className="space-y-2">
            <Label htmlFor="projectDescription">Description</Label>
            <Textarea
              id="projectDescription"
              value={formData.projectDescription}
              onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
              placeholder="Describe your project"
              className="h-20"
            />
          </div>

          {/* Project Type */}
          <div className="space-y-2">
            <Label htmlFor="projectType">Type</Label>
            <Select
              value={formData.projectType}
              onValueChange={(value) => setFormData({ ...formData, projectType: value as 'product' | 'service' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="service">Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Project Category with Hover Effect */}
          <div className="space-y-2 relative group">
            <Label htmlFor="projectCategory">Category</Label>
            <Input
              id="projectCategory"
              value={formData.projectCategory}
              onChange={(e) => setFormData({ ...formData, projectCategory: e.target.value })}
              placeholder="Enter or select category"
              className="peer"
            />
            <div className="hidden group-hover:block absolute z-10 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md mt-1 p-2 border border-gray-200 dark:border-gray-700">
              <div className="text-sm text-muted-foreground mb-2">Suggested categories:</div>
              <div className="grid grid-cols-2 gap-2">
                {formData.projectType === 'product' ? digitalProductCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className="text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
                    onClick={() => setFormData({ ...formData, projectCategory: category })}
                  >
                    {category}
                  </button>
                )) : digitalServiceCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className="text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
                    onClick={() => setFormData({ ...formData, projectCategory: category })}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Project Image */}
          <div className="space-y-2">
            <Label>Project Image</Label>
            <div className="flex items-center space-x-4">
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData({ ...formData, projectImage: file });
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
