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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Check, ChevronsUpDown } from "lucide-react"

interface ProjectFormData {
  title: string;
  description: string;
  type: 'digital product' | 'digital service';
  category: string;
  customCategory?: string;
  image?: File;
}

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated?: (project: any) => void;
}

const digitalProductCategories = [
  "Video Games", "Digital Music", "Software/Apps", "Digital Art",
  "Online Courses", "Ebooks", "Digital Templates", "Virtual Goods",
  "Other"
];

const digitalServiceCategories = [
  "Music Production", "Video Editing", "Web Development", "Graphic Design",
  "Content Creation", "Digital Marketing", "Virtual Assistance", "Online Coaching",
  "Other"
];

export function NewProjectDialog({ open, onOpenChange, onProjectCreated }: NewProjectDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const [formData, setFormData] = React.useState<ProjectFormData>({
    title: "",
    description: "",
    type: "digital product",
    category: "",
    customCategory: "",
  });
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [openCategory, setOpenCategory] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!open) {
      setFormData({
        title: "",
        description: "",
        type: "digital product",
        category: "",
        customCategory: "",
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

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Error",
          description: "Please sign in to create a project",
          variant: "destructive",
        });
        return;
      }

      // Create project first
      const categories = formData.type === 'digital product' ? digitalProductCategories : digitalServiceCategories;
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([
          {
            title: formData.title.trim(),
            description: formData.description?.trim(),
            type: formData.type,
            category: categories.includes(formData.category) ? formData.category : formData.category || 'Other',
            founder_id: session.user.id,
            status: 'active',
            visibility: 'private', // Default to private
          }
        ])
        .select()
        .single();

      if (projectError) throw projectError;

      // Handle image upload if present
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const filePath = `${project.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, formData.image);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
        } else {
          // Update project with image URL
          const { error: updateError } = await supabase
            .from('projects')
            .update({ image_url: filePath })
            .eq('id', project.id);

          if (updateError) {
            console.error('Error updating project with image:', updateError);
          }
        }
      }

      toast({
        title: "Success",
        description: "Project created successfully",
      });

      onProjectCreated?.(project);
      onOpenChange(false);
      router.push(`/dashboard/projects/${project.id}`);
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = formData.type === 'digital product' ? digitalProductCategories : digitalServiceCategories;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Start your new digital venture. You can add more details later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter project title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your project"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Project Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'digital product' | 'digital service') => 
                  setFormData(prev => ({ ...prev, type: value, category: '' }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="digital product">Digital Product</SelectItem>
                  <SelectItem value="digital service">Digital Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <div className="flex gap-2">
                <Select
                  value={formData.category === 'Other' || categories.indexOf(formData.category) === -1 ? 'Other' : formData.category}
                  onValueChange={(value) => {
                    setFormData(prev => ({
                      ...prev,
                      category: value,
                      customCategory: value === 'Other' ? '' : undefined
                    }));
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.toLowerCase()} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(formData.category === 'Other' || categories.indexOf(formData.category) === -1) && (
                  <Input
                    placeholder="Enter custom category"
                    value={formData.customCategory || formData.category}
                    onChange={(e) => {
                      const customValue = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        category: customValue,
                        customCategory: customValue
                      }));
                    }}
                    className="flex-1"
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Project Image</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData(prev => ({ ...prev, image: file }));
                    }
                  }}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {formData.image ? 'Change Image' : 'Upload Image'}
                </Button>
                {formData.image && (
                  <span className="text-sm text-muted-foreground">
                    {formData.image.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
