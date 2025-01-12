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
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';
import { InfoIcon } from 'lucide-react';

interface ProjectFormData {
  title: string;
  description: string;
  type: 'product' | 'service';
  category: string;
  image?: File;
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
    title: "",
    description: "",
    type: "product",
    category: "",
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
        title: "",
        description: "",
        type: "product",
        category: "",
      });
      setIsSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.title?.trim()) {
        throw new Error('Project title is required');
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
        title: formData.title.trim(),
        description: formData.description.trim(),
        founder_id: session.user.id
      });

      // Create project with minimal fields
      const { data: project, error } = await supabase
        .from('projects')
        .insert([
          {
            title: formData.title.trim(),
            description: formData.description.trim(),
            type: formData.type,
            category: formData.category,
            founder_id: session.user.id,
            status: 'planning',
            visibility: 'private'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Handle image upload if present
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const filePath = `${project.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, formData.image);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          // Continue anyway since the project was created
        } else {
          // Update project with image URL
          const { data: publicUrl } = supabase.storage
            .from('project-images')
            .getPublicUrl(filePath);

          await supabase
            .from('projects')
            .update({ image_url: publicUrl.publicUrl })
            .eq('id', project.id);
        }
      }

      // Create default tasks for the project
      const { error: tasksError } = await supabase
        .from('tasks')
        .insert(
          defaultTasks.map(task => ({
            ...task,
            project_id: project.id,
            assigned_to: session.user.id
          }))
        );

      if (tasksError) {
        console.error('Error creating default tasks:', tasksError);
      }

      // Create default events for the project
      const { error: eventsError } = await supabase
        .from('events')
        .insert(
          defaultEvents.map(event => ({
            ...event,
            project_id: project.id,
            organizer_id: session.user.id
          }))
        );

      if (eventsError) {
        console.error('Error creating default events:', eventsError);
      }

      toast({
        title: "Success",
        description: "Project created successfully! Redirecting to project dashboard...",
      });

      // Close dialog first
      onOpenChange(false);
      
      // Then redirect after a short delay to ensure smooth transition
      setTimeout(() => {
        router.push(`/projects/${project.id}`);
        router.refresh();
      }, 500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
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
          {/* Project Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter project title"
            />
          </div>

          {/* Project Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your project"
              className="h-20"
            />
          </div>

          {/* Project Type */}
          <div className="space-y-2">
            <Label htmlFor="project-type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as 'product' | 'service' })}
              name="project-type"
            >
              <SelectTrigger id="project-type">
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="service">Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Project Category with Tooltip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="category">Category</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      <InfoIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="w-80">
                    <div className="space-y-2">
                      <p className="font-medium">Suggested Categories:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {formData.type === 'product' ? (
                          <>
                            <span>Web Development</span>
                            <span>Mobile Development</span>
                            <span>AI/ML</span>
                            <span>Blockchain</span>
                            <span>IoT</span>
                            <span>Gaming</span>
                          </>
                        ) : (
                          <>
                            <span>Consulting</span>
                            <span>Design</span>
                            <span>Marketing</span>
                            <span>Development</span>
                            <span>Content</span>
                            <span>Support</span>
                          </>
                        )}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Enter project category"
            />
          </div>

          {/* Project Visibility Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="visibility" className="text-sm font-medium">Project Visibility</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="visibility"
                        disabled={true}
                        checked={false}
                      />
                      <span className="text-sm text-muted-foreground">Private</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Projects must complete the planning stage before becoming public. This helps ensure quality and readiness.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-sm text-muted-foreground">
              Your project will remain private during the planning stage
            </p>
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
                onChange={handleImageChange}
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
