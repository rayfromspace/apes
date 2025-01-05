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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, projectImage: e.target.files![0] }));
    }
  };

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
      console.log('Session:', session);
      
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

      const projectData = {
        title: formData.projectName.trim(),
        description: formData.projectDescription.trim(),
        type: formData.projectType,
        category: formData.projectCategory.trim(),
        founder_id: session.user.id,
        image_url
      };
      
      console.log('Project data to insert:', projectData);

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

      // Notify parent component about the new project
      onProjectCreated?.(project);

      toast({
        title: "Success!",
        description: "Project created successfully. Redirecting to project dashboard...",
      });

      onOpenChange(false);
      router.push(`/projects/${project.id}`);
      router.refresh();
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={formData.projectName}
                onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                placeholder="Enter project name"
              />
            </div>

            <div>
              <Label htmlFor="projectType">Project Type</Label>
              <Select
                value={formData.projectType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, projectType: value as 'product' | 'service' }))}
              >
                <SelectTrigger id="projectType">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Digital Product</SelectItem>
                  <SelectItem value="service">Digital Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="projectCategory">Category</Label>
              <Input
                id="projectCategory"
                value={formData.projectCategory}
                onChange={(e) => setFormData(prev => ({ ...prev, projectCategory: e.target.value }))}
                placeholder="Enter project category (e.g., Web Development, Mobile App)"
              />
            </div>

            <div>
              <Label htmlFor="projectDescription">Project Description</Label>
              <Textarea
                id="projectDescription"
                value={formData.projectDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, projectDescription: e.target.value }))}
                placeholder="Describe your project..."
                className="h-32"
              />
            </div>

            <div>
              <Label>Project Image</Label>
              <div 
                className="mt-2 flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div className="p-3 bg-primary/10 rounded-full">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-base font-medium">Upload Project Image</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.projectImage 
                      ? `Selected: ${formData.projectImage.name}`
                      : "Drag and drop or click to upload"}
                  </p>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
