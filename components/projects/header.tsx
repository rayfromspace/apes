"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function ProjectsHeader() {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="text-muted-foreground">
          Manage and track all your active projects
        </p>
      </div>
      <Button onClick={() => router.push("/projects/create")}>
        <Plus className="mr-2 h-4 w-4" /> New Project
      </Button>
    </div>
  );
}