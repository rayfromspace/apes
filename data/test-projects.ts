import { Project } from "@/types/project";

// Test user IDs
export const TEST_USER_IDS = {
  AI_PLATFORM_FOUNDER: "ai-platform-founder",
  DIGITAL_ASSET_FOUNDER: "digital-asset-founder",
  VIRTUAL_EVENT_FOUNDER: "virtual-event-founder",
  COFOUNDER: "test-cofounder-id",
  BOARD_MEMBER: "test-board-member-id",
  TEAM_MEMBER: "test-team-member-id",
};

export const TEST_PROJECTS: Project[] = [
  {
    id: "project-1",
    title: "AI Content Platform",
    description: "An AI-powered platform for generating and managing content across multiple channels. Features include automated content creation, SEO optimization, and performance analytics.",
    category: "software-saas",
    visibility: "public",
    progress: 65,
    funding_goal: 150000,
    current_funding: 97500,
    founder_id: TEST_USER_IDS.AI_PLATFORM_FOUNDER,
    start_date: "2024-01-01",
    end_date: "2024-06-30",
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    skills: ["React", "AI/ML", "NLP", "Python", "TypeScript"],
    members: [
      {
        userId: TEST_USER_IDS.AI_PLATFORM_FOUNDER,
        role: "founder",
        joinedAt: "2024-01-01",
        status: "active"
      },
      {
        userId: TEST_USER_IDS.COFOUNDER,
        role: "cofounder",
        joinedAt: "2024-01-05",
        status: "active"
      },
      {
        userId: TEST_USER_IDS.TEAM_MEMBER,
        role: "team_member",
        joinedAt: "2024-01-10",
        status: "active"
      }
    ],
    milestones: [
      {
        id: "1",
        title: "MVP Launch",
        description: "Launch minimum viable product",
        dueDate: "2024-03-01",
        status: "in_progress"
      },
      {
        id: "2",
        title: "Beta Testing",
        description: "Begin beta testing with early adopters",
        dueDate: "2024-04-15",
        status: "pending"
      }
    ]
  },
  {
    id: "project-2",
    title: "Digital Asset Marketplace",
    description: "A marketplace for buying and selling digital assets including 3D models, templates, and design resources. Features secure transactions and creator analytics.",
    category: "marketplace",
    visibility: "public",
    progress: 40,
    funding_goal: 200000,
    current_funding: 80000,
    founder_id: TEST_USER_IDS.DIGITAL_ASSET_FOUNDER,
    start_date: "2024-02-01",
    end_date: "2024-08-31",
    image_url: "https://images.unsplash.com/photo-1472851294608-062f824d29cc",
    skills: ["React", "Node.js", "AWS", "Smart Contracts", "UI/UX"],
    members: [
      {
        userId: TEST_USER_IDS.DIGITAL_ASSET_FOUNDER,
        role: "founder",
        joinedAt: "2024-02-01",
        status: "active"
      },
      {
        userId: TEST_USER_IDS.BOARD_MEMBER,
        role: "board_member",
        joinedAt: "2024-02-15",
        status: "active"
      }
    ],
    milestones: [
      {
        id: "1",
        title: "Platform Architecture",
        description: "Complete platform architecture and infrastructure setup",
        dueDate: "2024-03-15",
        status: "completed"
      },
      {
        id: "2",
        title: "Creator Onboarding",
        description: "Begin onboarding initial creators",
        dueDate: "2024-05-01",
        status: "pending"
      }
    ]
  },
  {
    id: "project-3",
    title: "Virtual Event Platform",
    description: "A comprehensive platform for hosting and managing virtual events, featuring real-time interaction, networking capabilities, and analytics.",
    category: "virtual-events",
    visibility: "public",
    progress: 25,
    funding_goal: 175000,
    current_funding: 43750,
    founder_id: TEST_USER_IDS.VIRTUAL_EVENT_FOUNDER,
    start_date: "2024-03-01",
    end_date: "2024-09-30",
    image_url: "https://images.unsplash.com/photo-1591115765373-5207764f72e7",
    skills: ["React", "WebRTC", "Node.js", "MongoDB", "WebSockets"],
    members: [
      {
        userId: TEST_USER_IDS.VIRTUAL_EVENT_FOUNDER,
        role: "founder",
        joinedAt: "2024-03-01",
        status: "active"
      }
    ],
    milestones: [
      {
        id: "1",
        title: "Technical Prototype",
        description: "Develop technical prototype with core features",
        dueDate: "2024-04-15",
        status: "in_progress"
      }
    ]
  }
];
