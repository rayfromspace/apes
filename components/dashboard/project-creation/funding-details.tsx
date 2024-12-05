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
import { Textarea } from "@/components/ui/textarea";
import { Project } from "@/types/project";

const formSchema = z.object({
  fundingGoal: z.string().min(1, {
    message: "Please enter a funding goal.",
  }),
  fundingType: z.string(),
  timeline: z.string(),
  useOfFunds: z.string().min(20, {
    message: "Please provide more detail about how the funds will be used.",
  }),
});

interface FundingDetailsProps {
  initialData: Partial<Project>;
  onComplete: (data: Partial<Project>) => void;
  onBack: () => void;
}

export function FundingDetails({
  initialData,
  onComplete,
  onBack,
}: FundingDetailsProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fundingGoal: initialData.fundingGoal || "",
      fundingType: initialData.fundingType || "",
      timeline: initialData.timeline || "",
      useOfFunds: initialData.useOfFunds || "",
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
          name="fundingGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Funding Goal</FormLabel>
              <FormControl>
                <Input placeholder="e.g., $50,000" {...field} />
              </FormControl>
              <FormDescription>
                The total amount of funding you're seeking.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fundingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Funding Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select funding type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="equity">Equity</SelectItem>
                  <SelectItem value="debt">Debt</SelectItem>
                  <SelectItem value="grant">Grant</SelectItem>
                  <SelectItem value="revenue-share">Revenue Share</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The type of funding arrangement you're seeking.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="timeline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timeline</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1-3">1-3 months</SelectItem>
                  <SelectItem value="3-6">3-6 months</SelectItem>
                  <SelectItem value="6-12">6-12 months</SelectItem>
                  <SelectItem value="12+">12+ months</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Expected timeline for utilizing the funds.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="useOfFunds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Use of Funds</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe how you plan to use the funding"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a detailed breakdown of how you plan to use the funding.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Create Project</Button>
        </div>
      </form>
    </Form>
  );
}
