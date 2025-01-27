"use client"

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FileText, 
  Users, 
  Banknote, 
  CalendarPlus, 
  Files, 
  Laptop,
  Plus,
  UserPlus,
  Calendar,
  Settings,
  Share2,
  MessageSquare,
  DollarSign,
  Code,
  FileUp,
  Briefcase,
  BookOpen,
  Building
} from 'lucide-react'
import { useState } from "react"
import { TechStackDialog } from "@/components/projects/dialogs/tech-stack-dialog"
import { ProposalDialog } from "@/components/projects/dialogs/proposal-dialog"
import { DocumentsDialog } from "@/components/projects/dialogs/documents-dialog"
import { TaskDialog } from "@/components/projects/dialogs/task-dialog"
import { InviteDialog } from "@/components/projects/dialogs/invite-dialog"
import { MeetingDialog } from "@/components/projects/dialogs/meeting-dialog"
import { MessageDialog } from "@/components/projects/dialogs/message-dialog"
import { ExpenseDialog } from "@/components/projects/dialogs/expense-dialog"
import { ShareDialog } from "@/components/projects/dialogs/share-dialog"
import { ProjectInfoDialog } from "@/components/projects/dialogs/company-dialog"
import { SettingsDialog } from "@/components/projects/dialogs/settings-dialog"

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  visibility: 'public' | 'private';
  status: 'active' | 'completed' | 'archived';
  founder_id: string;
  created_at: string;
  updated_at: string;
}

interface QuickActionsProps {
  project?: Project;
  userRole: string | null;
}

export function QuickActions({ project, userRole }: QuickActionsProps) {
  const router = useRouter();
  const [techStackOpen, setTechStackOpen] = useState(false);
  const [proposalOpen, setProposalOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [meetingOpen, setMeetingOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [projectInfoOpen, setProjectInfoOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const canManageProject = userRole === 'founder' || userRole === 'admin';

  if (!project) {
    return null;
  }

  const quickActions = [
    {
      id: "new-task",
      title: "New Task",
      description: "Create a new task",
      icon: Plus,
      onClick: () => setTaskOpen(true),
      color: "text-green-500",
    },
    {
      id: "tech-stack",
      title: "Tech Stack",
      description: "List of software being used",
      icon: Laptop,
      onClick: () => setTechStackOpen(true),
      color: "text-blue-500",
    },
    {
      id: "new-proposal",
      title: "New Proposal",
      description: "Submit a proposal",
      icon: FileText,
      onClick: () => setProposalOpen(true),
      color: "text-purple-500",
    },
    {
      id: "invite-member",
      title: "Invite Member",
      description: "Add team member",
      icon: UserPlus,
      onClick: () => setInviteOpen(true),
      color: "text-indigo-500",
      requiresManage: true,
    },
    {
      id: "documents",
      title: "Documents",
      description: "View & upload files",
      icon: Files,
      onClick: () => setDocumentsOpen(true),
      color: "text-orange-500",
    },
    {
      id: "schedule-meeting",
      title: "Schedule Meeting",
      description: "Plan team meetings",
      icon: Calendar,
      onClick: () => setMeetingOpen(true),
      color: "text-yellow-500",
    },
    {
      id: "send-message",
      title: "Send Message",
      description: "Message the team",
      icon: MessageSquare,
      onClick: () => setMessageOpen(true),
      color: "text-pink-500",
    },
    {
      id: "add-expense",
      title: "Add Expense",
      description: "Track project expenses",
      icon: Banknote,
      onClick: () => setExpenseOpen(true),
      color: "text-red-500",
      requiresManage: true,
    },
    {
      id: "share-project",
      title: "Share Project",
      description: "Share with others",
      icon: Share2,
      onClick: () => setShareOpen(true),
      color: "text-cyan-500",
    },
    {
      id: "board-members",
      title: "Board Members",
      description: "View board members",
      icon: Users,
      onClick: () => router.push('/team'),
      color: "text-emerald-500",
    },
    {
      id: "project-info",
      title: "Project Info",
      description: "View project details",
      icon: Building,
      onClick: () => setProjectInfoOpen(true),
      color: "text-slate-500",
    },
    {
      id: "settings",
      title: "Settings",
      description: "Project settings",
      icon: Settings,
      onClick: () => setSettingsOpen(true),
      color: "text-gray-500",
      requiresManage: true,
    },
  ];

  const filteredActions = quickActions.filter(
    action => !action.requiresManage || canManageProject
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Manage your project efficiently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="flex flex-col h-[100px] items-center justify-center space-y-2 hover:bg-muted/50"
                onClick={action.onClick}
              >
                <action.icon className={`h-6 w-6 ${action.color}`} />
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {project && (
        <>
          <TechStackDialog
            projectId={project.id}
            open={techStackOpen}
            onOpenChange={setTechStackOpen}
          />
          <ProposalDialog
            projectId={project.id}
            open={proposalOpen}
            onOpenChange={setProposalOpen}
          />
          <DocumentsDialog
            projectId={project.id}
            open={documentsOpen}
            onOpenChange={setDocumentsOpen}
          />
          <TaskDialog
            projectId={project.id}
            open={taskOpen}
            onOpenChange={setTaskOpen}
          />
          <InviteDialog
            projectId={project.id}
            open={inviteOpen}
            onOpenChange={setInviteOpen}
          />
          <MeetingDialog
            projectId={project.id}
            open={meetingOpen}
            onOpenChange={setMeetingOpen}
          />
          <MessageDialog
            projectId={project.id}
            open={messageOpen}
            onOpenChange={setMessageOpen}
          />
          <ExpenseDialog
            projectId={project.id}
            open={expenseOpen}
            onOpenChange={setExpenseOpen}
          />
          <ShareDialog
            projectId={project.id}
            open={shareOpen}
            onOpenChange={setShareOpen}
          />
          <ProjectInfoDialog
            projectId={project.id}
            open={projectInfoOpen}
            onOpenChange={setProjectInfoOpen}
          />
          <SettingsDialog
            projectId={project.id}
            open={settingsOpen}
            onOpenChange={setSettingsOpen}
          />
        </>
      )}
    </div>
  )
}
