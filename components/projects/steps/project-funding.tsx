"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectData } from "../project-creation-form"

const fundingSchema = z.object({
  fundingGoal: z.string().min(1, "Required").transform(val => parseFloat(val) || 0),
  equity: z.string().min(1, "Required").transform(val => parseFloat(val) || 0),
  timeline_months: z.string().min(1, "Required").transform(val => parseInt(val) || 0),
})

interface ProjectFundingProps {
  data: Partial<ProjectData>
  onUpdate: (data: Partial<ProjectData>) => void
  onComplete: () => void
  onPrev: () => void
}

export function ProjectFunding({
  data,
  onUpdate,
  onComplete,
  onPrev,
}: ProjectFundingProps) {
  const form = useForm<z.infer<typeof fundingSchema>>({
    resolver: zodResolver(fundingSchema),
    defaultValues: {
      fundingGoal: data.fundingGoal?.toString() || "",
      equity: data.equity?.toString() || "",
      timeline_months: data.timeline_months?.toString() || "",
    },
  })

  const onSubmit = (values: z.infer<typeof fundingSchema>) => {
    onUpdate({
      fundingGoal: values.fundingGoal,
      equity: values.equity,
      timeline_months: values.timeline_months,
    })
    onComplete()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Funding Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fundingGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funding Goal (USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="50000"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the total funding amount needed for your project
                  </FormDescription>
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
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="20"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Percentage of equity offered to investors
                  </FormDescription>
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
                      min="1"
                      max="60"
                      placeholder="12"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Expected duration to complete the project
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={onPrev}
              >
                Previous
              </Button>
              <Button type="submit">
                Complete Project Setup
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}