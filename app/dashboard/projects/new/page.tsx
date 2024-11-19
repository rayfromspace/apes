"use client"

import { ProjectCreationForm } from "@/components/projects/project-creation-form"
import { Card } from "@/components/ui/card"

export default function NewProjectPage() {
  return (
    <div className="p-6">
      <Card className="max-w-4xl mx-auto p-6">
        <ProjectCreationForm />
      </Card>
    </div>
  )
}