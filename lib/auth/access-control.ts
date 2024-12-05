import { User } from '@/lib/auth/types';

export type Role = 'founder' | 'cofounder' | 'board_member' | 'team_member' | 'investor' | null;

export interface ProjectMember {
  userId: string;
  role: Role;
  permissions: string[];
}

export interface ProjectAccess {
  canView: boolean;
  canEdit: boolean;
  canManageTeam: boolean;
  canManageFunds: boolean;
  canVote: boolean;
  role: Role;
}

const roleHierarchy: Record<Role, number> = {
  'founder': 100,
  'cofounder': 80,
  'board_member': 60,
  'investor': 40,
  'team_member': 20,
  null: 0,
};

const rolePermissions: Record<Role, string[]> = {
  'founder': [
    'view:all',
    'edit:all',
    'manage:team',
    'manage:funds',
    'vote:all',
    'delete:project'
  ],
  'cofounder': [
    'view:all',
    'edit:all',
    'manage:team',
    'manage:funds:limited',
    'vote:all'
  ],
  'board_member': [
    'view:all',
    'vote:strategic',
    'manage:funds:oversight',
    'view:analytics'
  ],
  'investor': [
    'view:metrics',
    'view:updates',
    'vote:investor'
  ],
  'team_member': [
    'view:team',
    'view:tasks',
    'edit:assigned'
  ],
  null: []
};

export function checkProjectAccess(
  user: User | null,
  projectMembers: ProjectMember[]
): ProjectAccess {
  if (!user) {
    return {
      canView: false,
      canEdit: false,
      canManageTeam: false,
      canManageFunds: false,
      canVote: false,
      role: null
    };
  }

  const member = projectMembers.find(m => m.userId === user.id);
  const role = member?.role || null;
  const permissions = member?.permissions || [];

  return {
    canView: hasPermission(role, permissions, 'view:all'),
    canEdit: hasPermission(role, permissions, 'edit:all'),
    canManageTeam: hasPermission(role, permissions, 'manage:team'),
    canManageFunds: hasPermission(role, permissions, 'manage:funds'),
    canVote: hasPermission(role, permissions, 'vote:all'),
    role
  };
}

export function hasPermission(
  role: Role,
  customPermissions: string[],
  requiredPermission: string
): boolean {
  // Custom permissions override role-based permissions
  if (customPermissions.includes(requiredPermission)) {
    return true;
  }

  // Check role-based permissions
  const rolePerms = rolePermissions[role] || [];
  return rolePerms.includes(requiredPermission);
}

export function canAccessRoute(
  user: User | null,
  projectMembers: ProjectMember[],
  requiredRole: Role
): boolean {
  if (!user) return false;

  const member = projectMembers.find(m => m.userId === user.id);
  const userRole = member?.role || null;

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export function getPublicProjectData(project: any) {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    coverImage: project.coverImage,
    highlights: {
      teamSize: project.teamSize,
      stage: project.stage,
      industry: project.industry,
      fundingGoal: project.isPublicFunding ? project.fundingGoal : undefined,
      currentFunding: project.isPublicFunding ? project.currentFunding : undefined,
    },
    publicStats: {
      completedMilestones: project.publicMilestones?.completed || 0,
      totalMilestones: project.publicMilestones?.total || 0,
      teamGrowth: project.publicMetrics?.teamGrowth,
    },
    opportunities: {
      hasInvestmentOpportunities: project.isOpenForInvestment,
      hasOpenRoles: project.hasOpenPositions,
    },
  };
}
