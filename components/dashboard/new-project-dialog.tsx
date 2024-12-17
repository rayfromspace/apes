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

interface ProjectFormData {
  step: number
  projectImage?: File
  projectName: string
  projectType: string
  projectCategory: string
  projectDescription: string
  founderSkills: string
  founderExperience: string
  complementarySkills: string
}

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function NewProjectDialog({ open, onOpenChange }: NewProjectDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = React.useState<ProjectFormData>({
    step: 1,
    projectName: "",
    projectType: "",
    projectCategory: "",
    projectDescription: "",
    founderSkills: "",
    founderExperience: "",
    complementarySkills: "",
  })

  const handleNext = () => {
    setFormData(prev => ({ ...prev, step: Math.min(prev.step + 1, 3) }))
  }

  const handleBack = () => {
    setFormData(prev => ({ ...prev, step: Math.max(prev.step - 1, 1) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Here you would typically make an API call to create the project
      // For example: const response = await createProject(formData);
      
      // Close the dialog
      onOpenChange(false);
      
      // Show success message
      toast({
        title: "Success",
        description: "Project created successfully",
      });

      // Redirect to admin dashboard
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl">Create New Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {formData.step === 1 && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed rounded-lg hover:border-primary/50 transition-colors">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-base font-medium">Upload Project Image</p>
                  <p className="text-sm text-muted-foreground">
                    Drag and drop or click to upload
                  </p>
                </div>
              </div>
              <Button
                className="w-full text-sm"
                onClick={() => setFormData((prev) => ({ ...prev, step: 2 }))}
              >
                Next
              </Button>
            </div>
          )}

          {formData.step === 2 && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm">Project Name</Label>
                <Input
                  className="mt-1.5"
                  value={formData.projectName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      projectName: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label className="text-sm">Project Type</Label>
                <Select
                  value={formData.projectType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, projectType: value }))
                  }
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="digital_product">Digital Product</SelectItem>
                    <SelectItem value="digital_service">Digital Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">Category</Label>
                <Select
                  value={formData.projectCategory}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, projectCategory: value }))
                  }
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {(formData.projectType === "digital_product"
                      ? digitalProductCategories
                      : digitalServiceCategories
                    ).map((category) => (
                      <SelectItem
                        key={category}
                        value={category.toLowerCase()}
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">Description</Label>
                <Textarea
                  className="mt-1.5 text-sm"
                  value={formData.projectDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      projectDescription: e.target.value,
                    }))
                  }
                />
              </div>

              <Button
                className="w-full text-sm"
                onClick={() => setFormData((prev) => ({ ...prev, step: 3 }))}
              >
                Next
              </Button>
            </div>
          )}

          {formData.step === 3 && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm">Your Skills</Label>
                <Textarea
                  className="mt-1.5 text-sm"
                  value={formData.founderSkills}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      founderSkills: e.target.value,
                    }))
                  }
                  placeholder="List your relevant skills"
                />
              </div>

              <div>
                <Label className="text-sm">Your Experience</Label>
                <Textarea
                  className="mt-1.5 text-sm"
                  value={formData.founderExperience}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      founderExperience: e.target.value,
                    }))
                  }
                  placeholder="Describe your relevant experience"
                />
              </div>

              <div>
                <Label className="text-sm">Complementary Skills Needed</Label>
                <Textarea
                  className="mt-1.5 text-sm"
                  value={formData.complementarySkills}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      complementarySkills: e.target.value,
                    }))
                  }
                  placeholder="What skills are you looking for in potential collaborators?"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="w-full text-sm"
                  onClick={() => setFormData((prev) => ({ ...prev, step: 2 }))}
                >
                  Back
                </Button>
                <Button type="submit" className="w-full text-sm">
                  Create Project
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
