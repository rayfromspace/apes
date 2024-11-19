"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ProjectInvestmentProps {
  id: string
}

const investmentOptions = [
  { amount: 10, label: "$10" },
  { amount: 25, label: "$25" },
  { amount: 50, label: "$50" },
  { amount: 100, label: "$100" },
  { amount: 200, label: "$200" },
  { amount: 400, label: "$400" },
]

export function ProjectInvestment({ id }: ProjectInvestmentProps) {
  const handleInvest = (amount: number) => {
    toast.success(`Investment of $${amount} processed successfully`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Total Raised</span>
            <span>$85,000 / $100,000</span>
          </div>
          <Progress value={85} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Investors</p>
            <p className="text-2xl font-bold">128</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Avg. Investment</p>
            <p className="text-2xl font-bold">$664</p>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Invest Now</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Choose Investment Amount</DialogTitle>
              <DialogDescription>
                Select how much you would like to invest in this project
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              {investmentOptions.map((option) => (
                <Button
                  key={option.amount}
                  variant="outline"
                  onClick={() => handleInvest(option.amount)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}