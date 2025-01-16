import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProjectStore } from "@/lib/stores/project-store";
import { useInvestmentStore } from "@/lib/stores/investment-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface CreateInvestmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateInvestmentDialog({ open, onOpenChange }: CreateInvestmentDialogProps) {
  const router = useRouter();
  const { projects } = useProjectStore();
  const { createInvestment } = useInvestmentStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    project_id: "",
    type: "",
    invested: "",
    progress: "0",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.project_id || !formData.type || !formData.invested) {
        throw new Error("Please fill in all required fields");
      }

      const investment = await createInvestment({
        project_id: formData.project_id,
        type: formData.type as "equity" | "token" | "revenue_share",
        invested: parseFloat(formData.invested),
        current_value: parseFloat(formData.invested), // Initially same as invested amount
        progress: parseInt(formData.progress),
        roi: 0, // Initial ROI is 0
        status: "active",
      });

      toast.success("Investment created successfully");
      onOpenChange(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to create investment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Investment</DialogTitle>
          <DialogDescription>
            Add a new investment to your portfolio
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select
                value={formData.project_id}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, project_id: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Investment Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equity">Equity</SelectItem>
                  <SelectItem value="token">Token</SelectItem>
                  <SelectItem value="revenue_share">Revenue Share</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invested">Investment Amount ($)</Label>
              <Input
                id="invested"
                type="number"
                min="0"
                step="0.01"
                value={formData.invested}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, invested: e.target.value }))
                }
                placeholder="Enter amount"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, progress: e.target.value }))
                }
                placeholder="Enter progress"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Investment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
