"use client"

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
} from "@/components/ui/form"
import { ProjectData } from "../project-creation-form"
import { X } from "lucide-react"

const formSchema = z.object({
  teamSize: z.number().min(1, "Team size must be at least 1"),
  roles: z.array(z.object({
    title: z.string().min(1, "Role title is required"),
    description: z.string().min(1, "Role description is required"),
  })).min(1, "Add at least one role"),
})

interface ProjectTeamProps {
  data: Partial<ProjectData>
  onUpdate: (data: Partial<ProjectData>) => void
  onNext: () => void
  onPrev: () => void
}

export function ProjectTeam({
  data,
  onUpdate,
  onNext,
  onPrev,
}: ProjectTeamProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamSize: data.teamSize || 1,
      roles: data.roles || [{ title: "", description: "" }],
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onUpdate(values)
    onNext()
  }

  const addRole = () => {
    const currentRoles = form.getValues("roles")
    form.setValue("roles", [...currentRoles, { title: "", description: "" }])
  }

  const removeRole = (index: number) => {
    const currentRoles = form.getValues("roles")
    form.setValue(
      "roles",
      currentRoles.filter((_, i) => i !== index)
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Team Roles</FormLabel>
            <Button type="button" variant="outline" onClick={addRole}>
              Add Role
            </Button>
          </div>
          {form.watch("roles").map((_, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Role {index + 1}</h4>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRole(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
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
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onPrev}
          >
            Back
          </Button>
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </div>
      </form>
    </Form>
  )
}