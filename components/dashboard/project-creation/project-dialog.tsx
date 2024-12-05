"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProjectBasics } from "./project-basics";
import { TeamStructure } from "./team-structure";
import { FundingDetails } from "./funding-details";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/lib/stores/project-store";
import { Project } from "@/types/project";

interface ProjectDialogProps {
  children: React.ReactNode;
}

type Step = "basics" | "team" | "funding";

export function ProjectDialog({ children }: ProjectDialogProps) {
  const [step, setStep] = useState<Step>("basics");
  const [open, setOpen] = useState(false);
  const [projectData, setProjectData] = useState<Partial<Project>>({});
  const addProject = useProjectStore((state) => state.addProject);

  const handleStepComplete = (data: Partial<Project>) => {
    const updatedData = { ...projectData, ...data };
    setProjectData(updatedData);

    if (step === "basics") {
      setStep("team");
    } else if (step === "team") {
      setStep("funding");
    } else if (step === "funding") {
      // Create project
      addProject(updatedData as Project);
      setOpen(false);
      setStep("basics");
      setProjectData({});
    }
  };

  const handleBack = () => {
    if (step === "team") {
      setStep("basics");
    } else if (step === "funding") {
      setStep("team");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            {step === "basics" && "Enter the basic details of your project"}
            {step === "team" && "Define your team structure"}
            {step === "funding" && "Set up your funding requirements"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {step === "basics" && (
            <ProjectBasics
              initialData={projectData}
              onComplete={handleStepComplete}
            />
          )}
          {step === "team" && (
            <TeamStructure
              initialData={projectData}
              onComplete={handleStepComplete}
              onBack={handleBack}
            />
          )}
          {step === "funding" && (
            <FundingDetails
              initialData={projectData}
              onComplete={handleStepComplete}
              onBack={handleBack}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
