import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function DeadlinesHeader() {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">Deadlines</h1>
        <p className="text-muted-foreground">
          Track project milestones and deadlines
        </p>
      </div>
      <Button onClick={() => router.push("/projects/deadlines/create")}>
        <Plus className="mr-2 h-4 w-4" /> Add Deadline
      </Button>
    </div>
  );
}