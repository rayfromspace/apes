"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from "@/types/project";

const formSchema = z.object({
  teamSize: z.string(),
  requiredRoles: z.string().min(5, {
    message: "Please list at least one required role.",
  }),
  experienceLevel: z.string(),
  commitmentLevel: z.string(),
});

interface TeamStructureProps {
  initialData: Partial<Project>;
  onComplete: (data: Partial<Project>) => void;
  onBack: () => void;
}

export function TeamStructure({
  initialData,
  onComplete,
  onBack,
}: TeamStructureProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamSize: initialData.teamSize || "",
      requiredRoles: initialData.requiredRoles || "",
      experienceLevel: initialData.experienceLevel || "",
      commitmentLevel: initialData.commitmentLevel || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onComplete(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="teamSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Size</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1-5">1-5 members</SelectItem>
                  <SelectItem value="6-10">6-10 members</SelectItem>
                  <SelectItem value="11-20">11-20 members</SelectItem>
                  <SelectItem value="20+">20+ members</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Estimated number of team members needed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="requiredRoles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Roles</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Developer, Designer, Project Manager"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                List the key roles needed for your project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="experienceLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience Level</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Required experience level for team members.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="commitmentLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commitment Level</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select commitment level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Expected time commitment from team members.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
}
