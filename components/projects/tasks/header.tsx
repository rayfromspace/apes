import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function TasksHeader() {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">Tasks</h1>
        <p className="text-muted-foreground">
          Track and manage your project tasks
        </p>
      </div>
      <Button onClick={() => router.push("/projects/tasks/create")}>
        <Plus className="mr-2 h-4 w-4" /> New Task
      </Button>
    </div>
  );
}