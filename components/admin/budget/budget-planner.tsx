import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

const formSchema = z.object({
  totalBudget: z.string().min(1, "Total budget is required"),
  teamSalaries: z.string().min(1, "Team salaries are required"),
  marketing: z.string().min(1, "Marketing budget is required"),
  tools: z.string().min(1, "Tools budget is required"),
  treasury: z.string().min(1, "Treasury amount is required"),
  notes: z.string().optional(),
})

export function BudgetPlanner() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalBudget: "",
      teamSalaries: "",
      marketing: "",
      tools: "",
      treasury: "",
      notes: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Budget plan saved successfully!")
    console.log(values)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly Budget Planning</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="totalBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Budget</FormLabel>
                    <FormControl>
                      <Input placeholder="$100,000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teamSalaries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Salaries</FormLabel>
                    <FormControl>
                      <Input placeholder="$60,000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="marketing"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marketing Budget</FormLabel>
                    <FormControl>
                      <Input placeholder="$20,000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tools"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tools & Services</FormLabel>
                    <FormControl>
                      <Input placeholder="$10,000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="treasury"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Treasury</FormLabel>
                    <FormControl>
                      <Input placeholder="$10,000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes or comments about the budget..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">Save Budget Plan</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}