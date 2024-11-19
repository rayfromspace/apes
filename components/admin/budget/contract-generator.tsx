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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

const formSchema = z.object({
  contractType: z.string().min(1, "Contract type is required"),
  parties: z.string().min(1, "Involved parties are required"),
  salary: z.string().min(1, "Salary is required"),
  bonus: z.string().min(1, "Bonus structure is required"),
  equity: z.string().min(1, "Equity percentage is required"),
  duration: z.string().min(1, "Contract duration is required"),
  terms: z.string().min(1, "Terms and conditions are required"),
})

export function ContractGenerator() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractType: "",
      parties: "",
      salary: "",
      bonus: "",
      equity: "",
      duration: "",
      terms: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Contract generated successfully!")
    console.log(values)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="contractType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select contract type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="founder">Founder Agreement</SelectItem>
                      <SelectItem value="cofounder">
                        Co-Founder Agreement
                      </SelectItem>
                      <SelectItem value="board">Board Member Agreement</SelectItem>
                      <SelectItem value="employee">
                        Employee Agreement
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="parties"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Involved Parties</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter names of involved parties"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Duration</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 12 months, 2 years"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter annual salary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bonus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bonus Structure</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter bonus details"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="equity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equity Percentage</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter equity percentage"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terms and Conditions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter detailed terms and conditions..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button variant="outline">Preview Contract</Button>
              <Button type="submit">Generate Contract</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}