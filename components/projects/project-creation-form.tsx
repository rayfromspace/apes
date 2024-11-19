"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { ProjectWalletInfo } from "./steps/project-wallet-info"

const formSchema = z.object({
  // Basic Info
  name: z.string().min(3, "Project name must be at least 3 characters"),
  type: z.enum(["product", "service"]),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(100, "Description must be at least 100 characters"),
  
  // Team Info
  teamSize: z.number().min(1, "Team size must be at least 1"),
  roles: z.array(z.object({
    title: z.string().min(1, "Role title is required"),
    description: z.string().min(1, "Role description is required"),
  })).min(1, "Add at least one role"),
  
  // Funding Info
  fundingGoal: z.number().min(1000, "Minimum funding goal is $1,000"),
  equity: z.number().min(1).max(100, "Equity must be between 1 and 100"),
  timeline_months: z.number().min(1, "Timeline must be at least 1 month"),
})

const categories = [
  "Web Application",
  "Mobile App",
  "E-commerce",
  "SaaS",
  "AI/ML",
  "Blockchain",
  "Digital Content",
  "Educational",
  "Gaming",
  "Other",
]

export function ProjectCreationForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [showWalletSetup, setShowWalletSetup] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "product",
      category: "",
      description: "",
      teamSize: 1,
      roles: [{ title: "", description: "" }],
      fundingGoal: 1000,
      equity: 10,
      timeline_months: 6,
    },
  })

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (step < 3) {
      nextStep()
    } else {
      setShowWalletSetup(true)
    }
  }

  const handleWalletComplete = () => {
    router.push("/dashboard/projects")
  }

  const progress = (step / 3) * 100

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground text-center">
          Step {step} of 3
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold">Project Basics</h2>
                <p className="text-muted-foreground">
                  Let's start with the fundamental details of your project
                </p>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="product">Digital Product</SelectItem>
                        <SelectItem value="service">Digital Service</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category.toLowerCase()}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your project in detail..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold">Team Structure</h2>
                <p className="text-muted-foreground">
                  Define your team size and required roles
                </p>
              </div>

              <FormField
                control={form.control}
                name="teamSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Size</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("roles").map((_, index) => (
                <div key={index} className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`roles.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Frontend Developer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`roles.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the responsibilities and requirements..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const currentRoles = form.getValues("roles")
                  form.setValue("roles", [...currentRoles, { title: "", description: "" }])
                }}
              >
                Add Role
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold">Funding Details</h2>
                <p className="text-muted-foreground">
                  Set your funding goals and project timeline
                </p>
              </div>

              <FormField
                control={form.control}
                name="fundingGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funding Goal (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1000}
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Minimum funding goal is $1,000</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="equity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equity Offered (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Enter percentage between 1-100</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeline_months"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Timeline (Months)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="flex gap-4">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
              >
                Previous
              </Button>
            )}
            <Button type="submit" className="flex-1">
              {step === 3 ? "Complete" : "Continue"}
            </Button>
          </div>
        </form>
      </Form>

      {showWalletSetup && (
        <ProjectWalletInfo onComplete={handleWalletComplete} />
      )}
    </div>
  )
}