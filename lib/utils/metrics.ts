import { Project } from "@/types/project";

export const calculateEngagement = (
  likes: number,
  comments: number,
  shares: number,
  views: number
): number => {
  if (views === 0) return 0;
  return ((likes + comments * 2 + shares * 3) / views) * 100;
};

export const calculateProjectProgress = (project: Project): number => {
  if (!project.milestones?.length) return 0;
  const completed = project.milestones.filter(m => m.status === 'completed').length;
  return (completed / project.milestones.length) * 100;
};

export const calculateFundingProgress = (current: number, goal: number): number => {
  if (goal === 0) return 0;
  return (current / goal) * 100;
};

export const getProjectStatus = (project: Project): {
  label: string;
  color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
} => {
  const progress = calculateProjectProgress(project);
  const funding = calculateFundingProgress(project.current_funding, project.funding_goal);

  if (project.status === 'completed') {
    return { label: 'Completed', color: 'success' };
  }
  
  if (project.status === 'cancelled') {
    return { label: 'Cancelled', color: 'error' };
  }

  if (funding < 20) {
    return { label: 'Needs Funding', color: 'warning' };
  }

  if (progress > 75) {
    return { label: 'Near Completion', color: 'primary' };
  }

  return { label: 'In Progress', color: 'default' };
};
