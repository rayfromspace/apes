import { Role } from "@/lib/auth/access-control";

// Base project information
export interface ProjectBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  slug: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
}

// Public project information
export interface PublicProject extends ProjectBase {
  coverImage?: string;
  highlights: {
    teamSize: number;
    stage: string;
    industry: string;
    fundingGoal?: number;
    currentFunding?: number;
  };
  publicStats: {
    completedMilestones: number;
    totalMilestones: number;
    teamGrowth?: number;
    projectHealth?: number;
  };
  opportunities: {
    hasInvestmentOpportunities: boolean;
    hasOpenRoles: boolean;
    minimumInvestment?: number;
    openPositions?: Array<{
      title: string;
      department: string;
    }>;
  };
  tags: string[];
  socialLinks?: {
    website?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

// Private project information (includes everything in PublicProject)
export interface PrivateProject extends PublicProject {
  // Team & Members
  members: Array<{
    userId: string;
    role: Role;
    permissions: string[];
    joinedAt: Date;
    equity?: number;
    department?: string;
    title?: string;
  }>;
  
  // Financial Information
  finances: {
    bankDetails?: {
      accountName: string;
      accountNumber: string;
      routingNumber: string;
      bank: string;
    };
    monthlyBurnRate: number;
    runway: number;
    investments: Array<{
      id: string;
      investorId: string;
      amount: number;
      equity: number;
      date: Date;
      terms: string;
      status: 'pending' | 'completed' | 'rejected';
    }>;
    expenses: Array<{
      id: string;
      category: string;
      amount: number;
      date: Date;
      description: string;
      approvedBy?: string;
    }>;
  };

  // Intellectual Property
  intellectualProperty: {
    patents?: Array<{
      id: string;
      title: string;
      status: string;
      filingDate: Date;
      number?: string;
    }>;
    trademarks?: Array<{
      id: string;
      name: string;
      status: string;
      filingDate: Date;
    }>;
    documents: Array<{
      id: string;
      title: string;
      category: string;
      url: string;
      uploadedBy: string;
      uploadedAt: Date;
    }>;
  };

  // Detailed Metrics
  metrics: {
    kpis: Record<string, number>;
    analytics: {
      userGrowth?: number;
      retention?: number;
      engagement?: number;
      revenue?: number;
      customMetrics?: Record<string, number>;
    };
    milestones: Array<{
      id: string;
      title: string;
      description: string;
      dueDate: Date;
      completedDate?: Date;
      status: 'pending' | 'in_progress' | 'completed' | 'delayed';
      assignedTo?: string[];
    }>;
  };

  // Strategic Information
  strategic: {
    vision: string;
    mission: string;
    objectives: Array<{
      id: string;
      title: string;
      description: string;
      timeframe: string;
      status: 'planned' | 'in_progress' | 'completed';
      priority: 'low' | 'medium' | 'high';
    }>;
    competitors: Array<{
      name: string;
      strengths: string[];
      weaknesses: string[];
      marketShare?: number;
    }>;
    marketAnalysis: {
      targetMarket: string;
      marketSize: number;
      growthRate: number;
      keyTrends: string[];
    };
  };

  // Compliance & Legal
  compliance: {
    licenses: Array<{
      type: string;
      number: string;
      expiryDate: Date;
      status: 'active' | 'pending' | 'expired';
    }>;
    certifications: Array<{
      name: string;
      issuer: string;
      validUntil: Date;
    }>;
    agreements: Array<{
      id: string;
      title: string;
      type: string;
      parties: string[];
      signedDate: Date;
      expiryDate?: Date;
      document: string;
    }>;
  };

  // Settings & Preferences
  settings: {
    visibility: 'public' | 'private' | 'invitation';
    allowInvestorRequests: boolean;
    allowTeamApplications: boolean;
    requireNDA: boolean;
    notificationPreferences: {
      financial: boolean;
      team: boolean;
      milestones: boolean;
      investments: boolean;
    };
  };
}

// Project creation input
export type CreateProjectInput = Omit<
  ProjectBase,
  'id' | 'createdAt' | 'updatedAt'
> & {
  visibility: 'public' | 'private' | 'invitation';
};

// Project update input
export type UpdateProjectInput = Partial<Omit<PrivateProject, 'id' | 'createdAt'>>;

// Project summary (used in lists and cards)
export interface ProjectSummary extends ProjectBase {
  coverImage?: string;
  highlights: {
    teamSize: number;
    stage: string;
    industry: string;
  };
  metrics: {
    completedMilestones: number;
    totalMilestones: number;
  };
}
