"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  points: number;
  progress?: number;
  unlocked: boolean;
  unlockedAt?: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

const achievements: Achievement[] = [
  {
    id: "1",
    title: "Web3 Pioneer",
    description: "Complete your first blockchain development course",
    category: "Development",
    points: 100,
    progress: 75,
    unlocked: false,
    icon: "🚀",
    rarity: "common",
  },
  {
    id: "2",
    title: "Design Maestro",
    description: "Create 5 successful digital products",
    category: "Design",
    points: 250,
    unlocked: true,
    unlockedAt: "2023-12-01",
    icon: "🎨",
    rarity: "rare",
  },
  // Add more achievements as needed
];

export default function Achievements() {
  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const inProgressAchievements = achievements.filter((a) => !a.unlocked);

  const totalPoints = unlockedAchievements.reduce(
    (sum, achievement) => sum + achievement.points,
    0
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-500";
      case "rare":
        return "bg-blue-500";
      case "epic":
        return "bg-purple-500";
      case "legendary":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Achievements</h1>
        <p className="text-muted-foreground">
          Track your learning progress and earn rewards
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Points</CardTitle>
            <CardDescription>Your learning score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPoints}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements Unlocked</CardTitle>
            <CardDescription>Your progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {unlockedAchievements.length}/{achievements.length}
            </div>
            <Progress
              value={(unlockedAchievements.length / achievements.length) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Rank</CardTitle>
            <CardDescription>Based on your achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Expert</div>
            <p className="text-sm text-muted-foreground">
              Next rank at {(totalPoints + 500).toLocaleString()} points
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Achievements</TabsTrigger>
          <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={achievement.unlocked ? "border-primary" : ""}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                          achievement.unlocked ? "" : "opacity-50"
                        }`}
                      >
                        {achievement.icon}
                      </div>
                      <div>
                        <CardTitle>{achievement.title}</CardTitle>
                        <CardDescription>
                          {achievement.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className={`${getRarityColor(
                          achievement.rarity
                        )} text-white`}
                      >
                        {achievement.rarity.charAt(0).toUpperCase() +
                          achievement.rarity.slice(1)}
                      </Badge>
                      <span className="font-medium">
                        {achievement.points} points
                      </span>
                    </div>
                    {achievement.progress && !achievement.unlocked && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <Progress value={achievement.progress} />
                      </div>
                    )}
                    {achievement.unlocked && achievement.unlockedAt && (
                      <p className="text-sm text-muted-foreground">
                        Unlocked on{" "}
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="unlocked">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {unlockedAchievements.map((achievement) => (
              <Card key={achievement.id} className="border-primary">
                {/* Same card content as above */}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="in-progress">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inProgressAchievements.map((achievement) => (
              <Card key={achievement.id}>
                {/* Same card content as above */}
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
