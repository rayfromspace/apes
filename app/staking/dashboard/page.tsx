"use client";

import { useEffect, useState } from "react";
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
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { Coins, ArrowUpRight, ArrowDownRight, Timer, Wallet } from "lucide-react";
import { toast } from "sonner";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/lib/auth/store";
import { Database } from "@/lib/database.types";

interface StakingPool {
  id: string;
  name: string;
  token: string;
  apy: number;
  total_staked: number;
  min_stake: number;
  lock_period: string;
  rewards: number;
  your_stake?: number;
}

interface UserStake {
  pool_id: string;
  amount: number;
  rewards_earned: number;
}

interface StakingReward {
  created_at: string;
  amount: number;
}

export default function StakingDashboard() {
  const supabase = createClientComponentClient<Database>();
  const { user, isAuthenticated, isInitialized } = useAuth();
  const [stakingPools, setStakingPools] = useState<StakingPool[]>([]);
  const [userStakes, setUserStakes] = useState<UserStake[]>([]);
  const [rewardHistory, setRewardHistory] = useState<StakingReward[]>([]);
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!isInitialized) return;
      
      try {
        // Always fetch staking pools
        const { data: poolsData, error: poolsError } = await supabase
          .from('staking_pools')
          .select('*');

        if (poolsError) throw poolsError;

        let finalPools = poolsData || [];

        // Only fetch user-specific data if authenticated
        if (isAuthenticated && user) {
          // Fetch user stakes
          const { data: stakesData, error: stakesError } = await supabase
            .from('user_stakes')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active');

          if (stakesError) throw stakesError;

          // Fetch reward history
          const { data: rewardsData, error: rewardsError } = await supabase
            .from('staking_rewards')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (rewardsError) throw rewardsError;

          // Combine pools with user stakes
          finalPools = (poolsData || []).map((pool: StakingPool) => {
            const userStake = stakesData?.find((stake: UserStake) => stake.pool_id === pool.id);
            return {
              ...pool,
              your_stake: userStake?.amount || 0
            };
          });

          setUserStakes(stakesData || []);
          setRewardHistory(rewardsData || []);
        }

        setStakingPools(finalPools);
      } catch (error) {
        console.error('Error fetching staking data:', error);
        toast.error('Failed to load staking data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isInitialized, isAuthenticated, user, supabase]);

  const totalStaked = userStakes.reduce(
    (sum, stake) => sum + (stake?.amount || 0),
    0
  );

  const totalRewards = userStakes.reduce(
    (sum, stake) => sum + (stake?.rewards_earned || 0),
    0
  );

  const handleStake = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to stake tokens");
      return;
    }

    if (!selectedPool || !stakeAmount) {
      toast.error("Please select a pool and enter an amount");
      return;
    }

    const pool = stakingPools.find((p) => p.id === selectedPool);
    if (!pool) return;

    if (Number(stakeAmount) < pool.min_stake) {
      toast.error(`Minimum stake amount is ${pool.min_stake} ${pool.token}`);
      return;
    }

    try {
      if (!user?.id) throw new Error("User not found");

      // Insert new stake
      const { error: stakeError } = await supabase
        .from('user_stakes')
        .insert({
          user_id: user.id,
          pool_id: selectedPool,
          amount: Number(stakeAmount),
          locked_until: pool.lock_period !== 'None' 
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            : null
        });

      if (stakeError) throw stakeError;

      // Update pool total
      const { error: poolError } = await supabase
        .from('staking_pools')
        .update({ 
          total_staked: pool.total_staked + Number(stakeAmount)
        })
        .eq('id', selectedPool);

      if (poolError) throw poolError;

      toast.success("Successfully staked tokens!");
      setSelectedPool(null);
      setStakeAmount("");
      
      // Refresh data
      const { data: stakesData } = await supabase
        .from('user_stakes')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (stakesData) {
        setUserStakes(stakesData);
      }
    } catch (error) {
      console.error('Error staking tokens:', error);
      toast.error('Failed to stake tokens');
    }
  };

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

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
            <div className="text-2xl font-bold">
              ${isAuthenticated ? totalStaked.toLocaleString() : "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              {isAuthenticated ? "Across all pools" : "Sign in to view"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${isAuthenticated ? totalRewards.toLocaleString() : "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              {isAuthenticated ? "Earned from staking" : "Sign in to view"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average APY</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stakingPools.length > 0
                ? (stakingPools.reduce((sum, pool) => sum + pool.apy, 0) / stakingPools.length).toFixed(2)
                : "0"}%
            </div>
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
                        ${pool.total_staked.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Min Stake</p>
                      <p className="font-medium">
                        {pool.min_stake} {pool.token}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Lock Period</p>
                      <p className="font-medium">{pool.lock_period}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Rewards</p>
                      <p className="font-medium">
                        ${pool.rewards.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {isAuthenticated && pool.your_stake > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">Your Stake</p>
                      <p className="font-medium">
                        {pool.your_stake} {pool.token}
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardContent className="pt-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full" 
                        variant={isAuthenticated && pool.your_stake ? "secondary" : "default"}
                      >
                        {!isAuthenticated 
                          ? "Sign in to Stake" 
                          : pool.your_stake 
                            ? "Manage Stake" 
                            : "Stake Now"
                        }
                      </Button>
                    </DialogTrigger>
                    {isAuthenticated && (
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
                              Min stake: {pool.min_stake} {pool.token}
                            </p>
                          </div>
                          <Button onClick={handleStake} className="w-full">
                            Confirm Stake
                          </Button>
                        </div>
                      </DialogContent>
                    )}
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
                {isAuthenticated 
                  ? "Track your staking rewards over time"
                  : "Sign in to view your rewards history"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAuthenticated ? (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={rewardHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="created_at" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis />
                      <RechartsTooltip
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Rewards']}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#8884d8"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[400px]">
                  <p className="text-muted-foreground">Sign in to view your rewards history</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
