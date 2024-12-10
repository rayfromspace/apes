"use client"

import * as React from "react"
import { Upload } from 'lucide-react'
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
    setFormData(prev => ({ ...prev, step: Math.min(prev.step + 1, 2) }))
  }

  const handleBack = () => {
    setFormData(prev => ({ ...prev, step: Math.max(prev.step - 1, 1) }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">New project</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <nav className="flex justify-center mb-8">
            <ul className="flex space-x-2">
              {[1, 2].map((step) => (
                <li key={step}>
                  <button
                    className={cn(
                      "w-10 h-10 rounded-full text-sm font-medium transition-colors",
                      formData.step === step
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                    onClick={() => setFormData(prev => ({ ...prev, step }))}
                  >
                    {step}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <form onSubmit={handleSubmit} className="space-y-8">
            {formData.step === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Step 1: Begin with your project's key details</h2>
                <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-12">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-primary hover:text-primary/80"
                      >
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">(JPG, PNG, or GIF)</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="project-name">Project name</Label>
                    <Input
                      id="project-name"
                      value={formData.projectName}
                      onChange={e => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Project type</Label>
                      <Select
                        value={formData.projectType}
                        onValueChange={value => setFormData(prev => ({ ...prev, projectType: value, projectCategory: "" }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="services">Services</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select
                        value={formData.projectCategory}
                        onValueChange={value => setFormData(prev => ({ ...prev, projectCategory: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.projectType === "product"
                            ? digitalProductCategories.map(category => (
                                <SelectItem key={category} value={category.toLowerCase().replace(/ /g, '-')}>
                                  {category}
                                </SelectItem>
                              ))
                            : digitalServiceCategories.map(category => (
                                <SelectItem key={category} value={category.toLowerCase().replace(/ /g, '-')}>
                                  {category}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Project Description</Label>
                    <Textarea
                      value={formData.projectDescription}
                      onChange={e => setFormData(prev => ({ ...prev, projectDescription: e.target.value }))}
                      placeholder="Describe your project"
                      className="h-32"
                    />
                  </div>
                </div>
              </div>
            )}
            {formData.step === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Step 2: Founder Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="founder-skills">Your Skills</Label>
                    <Textarea
                      id="founder-skills"
                      value={formData.founderSkills}
                      onChange={e => setFormData(prev => ({ ...prev, founderSkills: e.target.value }))}
                      placeholder="List your key skills relevant to this project"
                      className="h-32"
                    />
                  </div>
                  <div>
                    <Label htmlFor="founder-experience">Your Experience</Label>
                    <Textarea
                      id="founder-experience"
                      value={formData.founderExperience}
                      onChange={e => setFormData(prev => ({ ...prev, founderExperience: e.target.value }))}
                      placeholder="Describe your relevant experience for this project"
                      className="h-32"
                    />
                  </div>
                  <div>
                    <Label htmlFor="complementary-skills">Complementary Skills Needed</Label>
                    <Textarea
                      id="complementary-skills"
                      value={formData.complementarySkills}
                      onChange={e => setFormData(prev => ({ ...prev, complementarySkills: e.target.value }))}
                      placeholder="What skills are you looking for in potential team members?"
                      className="h-32"
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <div className="space-x-2">
                {formData.step > 1 && (
                  <Button type="button" variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                )}
                {formData.step < 2 ? (
                  <Button type="button" onClick={handleNext}>
                    Continue
                  </Button>
                ) : (
                  <Button type="submit">Create</Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
