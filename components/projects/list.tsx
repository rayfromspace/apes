"use client";

import { ProjectCard } from "@/components/projects/project-card";
import { ProjectFilters } from "@/components/projects/project-filters";

const DEMO_PROJECTS = [
  {
    id: "1",
    title: "DeFi Trading Platform",
    description: "A decentralized exchange platform with advanced trading features.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop",
    category: "DeFi",
    progress: 65,
    fundingGoal: 50000,
    currentFunding: 32500,
    founder: "Alex Thompson",
    skills: ["Solidity", "React", "Web3"],
  },
  {
    id: "2",
    title: "AI Content Creator",
    description: "AI-powered platform for generating and managing content.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2832&auto=format&fit=crop",
    category: "AI/ML",
    progress: 45,
    fundingGoal: 75000,
    currentFunding: 33750,
    founder: "Sarah Chen",
    skills: ["Python", "TensorFlow", "React"],
  },
];

export function ProjectsList() {
  return (
    <div className="space-y-6">
      <ProjectFilters />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEMO_PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}