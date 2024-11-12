"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Wallet, Shield, Users, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ProjectWalletInfoProps {
  onComplete: () => void
}

export function ProjectWalletInfo({ onComplete }: ProjectWalletInfoProps) {
  const [step, setStep] = useState(1)
  const [showDialog, setShowDialog] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async () => {
    setIsCreating(true)
    // Simulate wallet creation process
    await new Promise(resolve => setTimeout(resolve, 2000))
    setStep(2)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setStep(3)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setStep(4)
    setIsCreating(false)
  }

  const steps = [
    {
      icon: Wallet,
      title: "Initialize Wallet",
      description: "Creating your project's USDC wallet on Solana",
    },
    {
      icon: Shield,
      title: "Security Setup",
      description: "Configuring multi-signature security features",
    },
    {
      icon: Users,
      title: "Permissions",
      description: "Setting up team member access controls",
    },
    {
      icon: CheckCircle2,
      title: "Complete",
      description: "Your project wallet is ready to use",
    },
  ]

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Project Wallet Setup</DialogTitle>
          <DialogDescription>
            We're creating a secure multi-signature USDC wallet for your project on the Solana network.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {steps.map((item, index) => {
            const stepNumber = index + 1
            const isActive = step === stepNumber
            const isComplete = step > stepNumber
            
            return (
              <div
                key={item.title}
                className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                  isActive ? "bg-primary/5" : ""
                }`}
              >
                <div className={`p-2 rounded-full ${
                  isComplete ? "bg-primary/10 text-primary" :
                  isActive ? "bg-primary/10 text-primary" :
                  "bg-muted text-muted-foreground"
                }`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                {isComplete && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </div>
            )
          })}

          {step === 4 && (
            <Alert className="bg-primary/5 border-primary/20">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <AlertTitle>Wallet Created Successfully</AlertTitle>
              <AlertDescription>
                Your project's multi-signature USDC wallet is now ready. You can manage funds and set up team permissions from your project dashboard.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-4">
            {step < 4 ? (
              <Button onClick={handleCreate} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <span className="animate-pulse">Creating Wallet...</span>
                    <Progress value={(step / 4) * 100} className="w-20 ml-2" />
                  </>
                ) : (
                  "Create Wallet"
                )}
              </Button>
            ) : (
              <Button onClick={onComplete}>Continue to Dashboard</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}