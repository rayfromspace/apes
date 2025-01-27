"use client";

import * as React from "react";
import { useState } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from "@/lib/auth/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface TechStackItem {
  id: string;
  name: string;
  url?: string;
  project_id: string;
}

interface TechStackDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TechStackDialog({
  projectId,
  open,
  onOpenChange,
}: TechStackDialogProps) {
  const [techStack, setTechStack] = useState<TechStackItem[]>([]);
  const [newTechName, setNewTechName] = useState("");
  const [newTechUrl, setNewTechUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();
  const { user } = useAuth();

  React.useEffect(() => {
    if (open && projectId) {
      fetchTechStack();
    }
  }, [open, projectId]);

  const fetchTechStack = async () => {
    try {
      const { data, error } = await supabase
        .from('project_tech_stack')
        .select('*')
        .eq('project_id', projectId);

      if (error) throw error;
      setTechStack(data || []);
    } catch (error) {
      console.error('Error fetching tech stack:', error);
      toast.error('Failed to load tech stack');
    }
  };

  const handleAddTech = async () => {
    if (!newTechName.trim()) return;

    setIsLoading(true);
    try {
      const newTech = {
        project_id: projectId,
        name: newTechName.trim(),
        url: newTechUrl.trim() || null,
      };

      const { data, error } = await supabase
        .from('project_tech_stack')
        .insert([newTech])
        .select()
        .single();

      if (error) throw error;

      setTechStack([...techStack, data]);
      setNewTechName("");
      setNewTechUrl("");
      toast.success('Technology added successfully');
    } catch (error) {
      console.error('Error adding technology:', error);
      toast.error('Failed to add technology');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveTech = async (id: string) => {
    try {
      const { error } = await supabase
        .from('project_tech_stack')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTechStack(techStack.filter(tech => tech.id !== id));
      toast.success('Technology removed successfully');
    } catch (error) {
      console.error('Error removing technology:', error);
      toast.error('Failed to remove technology');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Project Tech Stack</DialogTitle>
          <DialogDescription>
            Add or remove technologies and tools used in this project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            {techStack.map((tech) => (
              <div
                key={tech.id}
                className="flex items-center justify-between gap-2 p-2 rounded-lg border group hover:bg-accent"
              >
                <div className="flex items-center gap-2 flex-1">
                  <Badge variant="outline">{tech.name}</Badge>
                  {tech.url && (
                    <a
                      href={tech.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveTech(tech.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="techName">Add Technology</Label>
            <div className="flex gap-2">
              <Input
                id="techName"
                placeholder="Technology name"
                value={newTechName}
                onChange={(e) => setNewTechName(e.target.value)}
              />
              <Input
                id="techUrl"
                placeholder="URL (optional)"
                value={newTechUrl}
                onChange={(e) => setNewTechUrl(e.target.value)}
              />
              <Button
                type="submit"
                size="icon"
                onClick={handleAddTech}
                disabled={!newTechName.trim() || isLoading}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
