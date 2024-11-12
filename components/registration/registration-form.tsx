"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { StepOne } from "./step-one"
import { StepTwo } from "./step-two"
import { StepThree } from "./step-three"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function RegistrationForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1
    username: "",
    email: "",
    password: "",
    // Step 2
    firstName: "",
    lastName: "",
    role: "",
    // Step 3
    skills: "",
    experience: "",
    interests: ""
  })

  const handleUpdateData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const handleNext = () => {
    setStep(prev => Math.min(prev + 1, 3))
  }

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    try {
      // Here you would typically send the data to your API
      console.log('Form submitted:', formData)
      toast.success("Account created successfully!")
      router.push("/dashboard")
    } catch (error) {
      console.error('Registration error:', error)
      toast.error("Failed to create account. Please try again.")
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="pt-6">
        {step === 1 && (
          <StepOne
            data={formData}
            onUpdate={handleUpdateData}
            onNext={handleNext}
          />
        )}
        {step === 2 && (
          <StepTwo
            data={formData}
            onUpdate={handleUpdateData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {step === 3 && (
          <StepThree
            data={formData}
            onUpdate={handleUpdateData}
            onSubmit={handleSubmit}
            onPrev={handlePrev}
          />
        )}
      </CardContent>
    </Card>
  )
}