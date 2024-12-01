"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  minInvestment: number;
  category: string;
}

interface Pool {
  id: string;
  name: string;
  description: string;
  totalValue: number;
  investorCount: number;
  averageReturn: number;
  riskLevel: string;
}

const projects: Project[] = [
  {
    id: "1",
    name: "Green Energy Initiative",
    description: "Sustainable energy project focusing on solar panel innovation",
    targetAmount: 500000,
    currentAmount: 325000,
    minInvestment: 1000,
    category: "Renewable Energy"
  },
  {
    id: "2",
    name: "AI Healthcare Solution",
    description: "AI-powered diagnostic tool for early disease detection",
    targetAmount: 750000,
    currentAmount: 450000,
    minInvestment: 2500,
    category: "Healthcare"
  }
];

const pools: Pool[] = [
  {
    id: "1",
    name: "Tech Innovation Pool",
    description: "Diversified portfolio of technology startups",
    totalValue: 2500000,
    investorCount: 150,
    averageReturn: 12.5,
    riskLevel: "Moderate"
  },
  {
    id: "2",
    name: "Sustainable Future Pool",
    description: "Investment pool focused on environmental projects",
    totalValue: 1800000,
    investorCount: 95,
    averageReturn: 8.7,
    riskLevel: "Low"
  }
];

export default function InvestmentsPage() {
  const [investmentAmount, setInvestmentAmount] = useState("");
  const router = useRouter();

  const handleViewProject = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  const handleInvest = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation(); // Prevent navigation when clicking the invest button
    // Handle investment logic here
    console.log(`Investing ${investmentAmount} in project ${projectId}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-4xl font-bold">Value Stake Investments</h1>
        <p className="text-muted-foreground">
          Choose between direct project investments or join investment pools
        </p>
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="projects">Direct Projects</TabsTrigger>
          <TabsTrigger value="pools">Investment Pools</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="group cursor-pointer transition-all hover:shadow-lg"
                onClick={() => handleViewProject(project.id)}
              >
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round((project.currentAmount / project.targetAmount) * 100)}%</span>
                    </div>
                    <Progress value={(project.currentAmount / project.targetAmount) * 100} />
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Target Amount</p>
                        <p className="font-medium">${project.targetAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Min Investment</p>
                        <p className="font-medium">${project.minInvestment.toLocaleString()}</p>
                      </div>
                    </div>
                    <div 
                      className="space-y-2"
                      onClick={(e) => e.stopPropagation()} // Prevent navigation when interacting with form
                    >
                      <Label htmlFor={`invest-${project.id}`}>Investment Amount</Label>
                      <div className="flex space-x-2">
                        <Input
                          id={`invest-${project.id}`}
                          type="number"
                          placeholder="Enter amount"
                          min={project.minInvestment}
                          value={investmentAmount}
                          onChange={(e) => setInvestmentAmount(e.target.value)}
                        />
                        <Button onClick={(e) => handleInvest(e, project.id)}>Invest</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pools.map((pool) => (
              <Card key={pool.id}>
                <CardHeader>
                  <CardTitle>{pool.name}</CardTitle>
                  <CardDescription>{pool.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Value</p>
                      <p className="font-medium">${pool.totalValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Investors</p>
                      <p className="font-medium">{pool.investorCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg. Return</p>
                      <p className="font-medium">{pool.averageReturn}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Risk Level</p>
                      <p className="font-medium">{pool.riskLevel}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`pool-invest-${pool.id}`}>Investment Amount</Label>
                    <div className="flex space-x-2">
                      <Input
                        id={`pool-invest-${pool.id}`}
                        type="number"
                        placeholder="Enter amount"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                      />
                      <Button>Join Pool</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
