import { TasksHeader } from "@/components/projects/tasks/header";
import { TasksList } from "@/components/projects/tasks/list";

export default function TasksPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-6">
        <TasksHeader />
        <TasksList />
      </div>
    </div>
  );
}