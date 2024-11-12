"use client"

import { useState } from "react"
import { ProjectBasics } from "./steps/project-basics"
import { ProjectDetails } from "./steps/project-details"
import { ProjectFunding } from "./steps/project-funding"
import { ProjectTeam } from "./steps/project-team"
import { ProjectWalletInfo } from "./steps/project-wallet-info"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"

export interface ProjectData {
  name: string
  type: "product" | "service"
  category: string
  description: string
  timeline: string
  goals: string[]
  teamSize: number
  roles: { title: string; description: string }[]
  fundingGoal: number
  equity: number
  timeline_months: number
  milestones: { title: string; description: string; deadline: string }[]
  targetAudience: string
  revenueModel: string
  marketResearch: string
  competitors: string
  implementationSteps: string[]
}

export function ProjectCreationForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<Partial<ProjectData>>({})
  const [showWalletSetup, setShowWalletSetup] = useState(false)

  const updateData = (newData: Partial<ProjectData>) => {
    setData(prev => ({ ...prev, ...newData }))
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const handleComplete = () => {
    setShowWalletSetup(true)
  }

  const handleWalletComplete = () => {
    router.push("/dashboard/projects")
  }

  const progress = (step / 4) * 100

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground text-center">
          Step {step} of 4
        </p>
      </div>

      {step === 1 && (
        <ProjectBasics
          data={data}
          onUpdate={updateData}
          onNext={nextStep}
        />
      )}
      {step === 2 && (
        <ProjectDetails
          data={data}
          onUpdate={updateData}
          onNext={nextStep}
          onPrev={prevStep}
        />
      )}
      {step === 3 && (
        <ProjectTeam
          data={data}
          onUpdate={updateData}
          onNext={nextStep}
          onPrev={prevStep}
        />
      )}
      {step === 4 && (
        <ProjectFunding
          data={data}
          onUpdate={updateData}
          onComplete={handleComplete}
          onPrev={prevStep}
        />
      )}

      {showWalletSetup && (
        <ProjectWalletInfo onComplete={handleWalletComplete} />
      )}
    </div>
  )
}