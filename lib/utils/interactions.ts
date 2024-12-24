import { Project } from "@/types/project";

export type InteractionType = 'like' | 'bookmark' | 'share' | 'comment' | 'follow';

export interface InteractionEvent {
  type: InteractionType;
  targetId: string;
  targetType: 'project' | 'post' | 'comment';
  metadata?: Record<string, any>;
}

export const handleInteraction = async (event: InteractionEvent): Promise<boolean> => {
  try {
    // Here you would implement the actual API call
    // For now, we'll just simulate success
    return true;
  } catch (error) {
    console.error('Error handling interaction:', error);
    return false;
  }
};

export const canInteract = (
  project: Project,
  interactionType: InteractionType,
  userId?: string
): boolean => {
  if (!userId) return false;

  switch (interactionType) {
    case 'like':
    case 'bookmark':
    case 'share':
      return true;
    case 'comment':
      return project.visibility === 'public' || 
             project.founder_id === userId ||
             project.team_members.some(member => member.user_id === userId);
    case 'follow':
      return project.founder_id !== userId;
    default:
      return false;
  }
};

export const getInteractionLabel = (
  type: InteractionType,
  count: number
): string => {
  switch (type) {
    case 'like':
      return `${count} ${count === 1 ? 'like' : 'likes'}`;
    case 'bookmark':
      return `${count} ${count === 1 ? 'save' : 'saves'}`;
    case 'share':
      return `${count} ${count === 1 ? 'share' : 'shares'}`;
    case 'comment':
      return `${count} ${count === 1 ? 'comment' : 'comments'}`;
    case 'follow':
      return `${count} ${count === 1 ? 'follower' : 'followers'}`;
    default:
      return count.toString();
  }
};
