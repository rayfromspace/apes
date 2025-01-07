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
  "Ebooks", "Software/SaaS", "Mobile and Web Applications", "Video Games", "Digital Art",
  "Stock Photos and Videos", "Digital Music, Sounds, and Audiobooks", "Printables",
  "Online Courses", "3D Models", "Fonts, Logos, and Design Templates", "Virtual Goods",
  "Digital Magazines", "Customizable Templates", "Digital Stickers", "Digital Scrapbooking Kits",
  "Interactive PDFs", "Digital Puzzles", "Augmented Reality Experiences", "Membership Sites", "Other"
];

const digitalServiceCategories = [
  "Video Editing", "Consulting", "Music Label Services", "Graphic Design", "Content Creation",
  "SEO and Digital Marketing", "Virtual Assistance", "Translation Services", "Web Development and Design",
  "Remote Tech Support", "Online Fitness Coaching", "Educational Tutoring", "Legal Services",
  "Voice Over and Narration", "Social Media Management", "Email Marketing", "Podcast Production",
  "Data Analysis", "Virtual Event Planning", "Remote Therapy or Counseling", "Other"
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
  const [formData, setFormData] = React.useState<ProjectFormData>({
    projectName: "",
    projectDescription: "",
    projectType: "product",
    projectCategory: "",
  });
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      setFormData({
        projectName: "",
        projectDescription: "",
        projectType: "product",
        projectCategory: "",
      });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!formData.projectName.trim()) {
        throw new Error('Project name is required');
      }
      if (!formData.projectType) {
        throw new Error('Project type is required');
      }
      if (!formData.projectDescription.trim()) {
        throw new Error('Project description is required');
      }
      if (!formData.projectCategory.trim()) {
        throw new Error('Project category is required');
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Please log in again');
      }

      let image_url = null;
      
      // Upload image if provided
      if (formData.projectImage) {
        const fileExt = formData.projectImage.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `project-covers/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('projects')
          .upload(filePath, formData.projectImage);

        if (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('projects')
          .getPublicUrl(filePath);

        image_url = publicUrl;
      }

      // Create project with status and visibility
      const projectData = {
        title: formData.projectName.trim(),
        description: formData.projectDescription.trim(),
        type: formData.projectType,
        category: formData.projectCategory.trim(),
        founder_id: session.user.id,
        image_url,
        status: 'active',
        visibility: 'public',
        current_funding: 0,
        funding_goal: 10000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert(projectData)
        .select('id, title')
        .single();

      if (projectError) {
        console.error('Project creation error:', projectError);
        throw new Error(`Failed to create project: ${projectError.message}`);
      }

      if (!project) {
        throw new Error('Project created but failed to retrieve ID');
      }

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
      }

      // Create default tasks
      const tasksWithProjectId = defaultTasks.map(task => ({
        ...task,
        project_id: project.id,
        creator_id: session.user.id,
        assignee_id: session.user.id,
      }));

      const { error: tasksError } = await supabase
        .from('tasks')
        .insert(tasksWithProjectId);

      if (tasksError) {
        console.error('Tasks creation error:', tasksError);
      }

      // Create default events
      const eventsWithProjectId = defaultEvents.map(event => ({
        ...event,
        project_id: project.id,
        creator_id: session.user.id,
      }));

      const { error: eventsError } = await supabase
        .from('events')
        .insert(eventsWithProjectId);

      if (eventsError) {
        console.error('Events creation error:', eventsError);
      }

      // Create welcome message/announcement
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          project_id: project.id,
          sender_id: session.user.id,
          content: `Welcome to ${formData.projectName}! 🎉\n\nI've created this project to help us collaborate effectively. Here's what you'll find:\n\n1. Tasks: I've added some initial tasks to get us started\n2. Calendar: Check out our upcoming meetings\n3. Team: You can invite team members using the "Invite" button\n\nLet's make this project a success! 🚀`,
          type: 'announcement'
        });

      if (messageError) {
        console.error('Message creation error:', messageError);
      }

      // Notify parent component about the new project
      onProjectCreated?.(project);

      toast({
        title: "Success!",
        description: "Project created successfully. Redirecting to project dashboard...",
      });

      // Close dialog first
      onOpenChange(false);

      // Short delay to ensure dialog closes smoothly
      setTimeout(() => {
        router.push(`/projects/${project.id}`);
        router.refresh();
      }, 100);

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create project',
        variant: "destructive"
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

  const categories = formData.projectType === 'product' ? digitalProductCategories : digitalServiceCategories;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              value={formData.projectName}
              onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
              placeholder="Enter project name"
            />
          </div>

          {/* Project Type */}
          <div className="space-y-2">
            <Label>Project Type</Label>
            <Select
              value={formData.projectType}
              onValueChange={(value: 'product' | 'service') => 
                setFormData(prev => ({ ...prev, projectType: value, projectCategory: '' }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product">Digital Product</SelectItem>
                <SelectItem value="service">Digital Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Project Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={formData.projectCategory}
              onValueChange={(value) => setFormData(prev => ({ ...prev, projectCategory: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Project Description */}
          <div className="space-y-2">
            <Label htmlFor="projectDescription">Description</Label>
            <Textarea
              id="projectDescription"
              value={formData.projectDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, projectDescription: e.target.value }))}
              placeholder="Describe your project"
              className="h-32"
            />
          </div>

          {/* Project Image */}
          <div className="space-y-2">
            <Label>Project Image</Label>
            <div 
              className={cn(
                "border-2 border-dashed rounded-lg p-4 hover:bg-accent/50 cursor-pointer transition-colors",
                "flex flex-col items-center justify-center gap-2 text-center"
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                {formData.projectImage ? (
                  <span>{formData.projectImage.name}</span>
                ) : (
                  <span>Click to upload project image</span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
