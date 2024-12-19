"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Coins, ArrowUpRight, ArrowDownRight, Timer, Wallet } from "lucide-react";
import { toast } from "sonner";

interface StakingPool {
  id: string;
  name: string;
  token: string;
  apy: number;
  totalStaked: number;
  minStake: number;
  lockPeriod: string;
  rewards: number;
  yourStake?: number;
}

const stakingPools: StakingPool[] = [
  {
    id: "1",
    name: "High Yield Pool",
    token: "USDC",
    apy: 12.5,
    totalStaked: 1500000,
    minStake: 100,
    lockPeriod: "30 days",
    rewards: 25000,
    yourStake: 1000,
  },
  {
    id: "2",
    name: "Flexible Pool",
    token: "ETH",
    apy: 8.0,
    totalStaked: 2500000,
    minStake: 0.1,
    lockPeriod: "None",
    rewards: 15000,
  },
  // Add more pools as needed
];

const rewardHistory = [
  { date: "2023-12-01", rewards: 120 },
  { date: "2023-12-02", rewards: 150 },
  { date: "2023-12-03", rewards: 180 },
  { date: "2023-12-04", rewards: 200 },
  { date: "2023-12-05", rewards: 190 },
  { date: "2023-12-06", rewards: 220 },
  { date: "2023-12-07", rewards: 250 },
];

export default function StakingDashboard() {
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");

  const totalStaked = stakingPools.reduce(
    (sum, pool) => sum + (pool.yourStake || 0),
    0
  );
  const totalRewards = stakingPools.reduce(
    (sum, pool) => sum + (pool.yourStake ? (pool.yourStake * pool.apy) / 100 : 0),
    0
  );

  const handleStake = () => {
    if (!selectedPool || !stakeAmount) {
      toast.error("Please select a pool and enter an amount");
      return;
    }

    const pool = stakingPools.find((p) => p.id === selectedPool);
    if (!pool) return;

    if (Number(stakeAmount) < pool.minStake) {
      toast.error(`Minimum stake amount is ${pool.minStake} ${pool.token}`);
      return;
    }

    // Add staking logic here
    toast.success("Successfully staked tokens!");
    setSelectedPool(null);
    setStakeAmount("");
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Staking Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your staked assets and track rewards
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staked</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalStaked.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all pools
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRewards.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Earned from staking
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average APY</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10.25%</div>
            <p className="text-xs text-muted-foreground">
              Weighted average
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Pools</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stakingPools.length}</div>
            <p className="text-xs text-muted-foreground">
              Available for staking
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pools" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pools">Staking Pools</TabsTrigger>
          <TabsTrigger value="rewards">Rewards History</TabsTrigger>
        </TabsList>

        <TabsContent value="pools" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stakingPools.map((pool) => (
              <Card key={pool.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{pool.name}</CardTitle>
                      <CardDescription>
                        {pool.token} Staking Pool
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-lg">
                      {pool.apy}% APY
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Staked</p>
                      <p className="font-medium">
                        ${pool.totalStaked.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Min Stake</p>
                      <p className="font-medium">
                        {pool.minStake} {pool.token}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Lock Period</p>
                      <p className="font-medium">{pool.lockPeriod}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Rewards</p>
                      <p className="font-medium">
                        ${pool.rewards.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {pool.yourStake && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">Your Stake</p>
                      <p className="font-medium">
                        {pool.yourStake} {pool.token}
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardContent className="pt-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" variant={pool.yourStake ? "secondary" : "default"}>
                        {pool.yourStake ? "Manage Stake" : "Stake Now"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Stake in {pool.name}</DialogTitle>
                        <DialogDescription>
                          Enter the amount you want to stake
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Input
                            type="number"
                            placeholder={`Amount in ${pool.token}`}
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(e.target.value)}
                          />
                          <p className="text-sm text-muted-foreground">
                            Min stake: {pool.minStake} {pool.token}
                          </p>
                        </div>
                        <Button onClick={handleStake} className="w-full">
                          Confirm Stake
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rewards">
          <Card>
            <CardHeader>
              <CardTitle>Rewards History</CardTitle>
              <CardDescription>
                Track your staking rewards over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rewardHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="rewards"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
