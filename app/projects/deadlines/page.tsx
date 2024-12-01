import { DeadlinesHeader } from "@/components/projects/deadlines/header";
import { DeadlinesList } from "@/components/projects/deadlines/list";

export default function DeadlinesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-6">
        <DeadlinesHeader />
        <DeadlinesList />
      </div>
    </div>
  );
}