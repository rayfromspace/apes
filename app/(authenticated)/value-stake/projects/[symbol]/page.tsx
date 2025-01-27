"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart2,
  Users2,
  TrendingUp,
  MessageSquare,
  Bell,
  ArrowRightLeft,
  DollarSign,
  Send,
  ThumbsUp,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data - replace with real data fetching
const projectData = {
  name: "TechStart",
  symbol: "TECH",
  price: "0.68",
  change: -34.12,
  category: "Technology",
  marketCap: "2.1M",
  volume: "450K",
  holders: 128,
  description: "Next-generation tech startup focusing on AI and blockchain solutions.",
  color: "bg-yellow-500",
};

const announcements = [
  {
    id: 1,
    title: "Q4 2024 Roadmap Released",
    content: "We're excited to announce our Q4 2024 roadmap, featuring major platform updates and new partnership announcements.",
    date: "2024-12-18",
    author: {
      name: "Sarah Chen",
      role: "Product Lead",
      avatar: "/avatars/sarah.jpg",
    },
  },
  {
    id: 2,
    title: "New Partnership with CloudTech",
    content: "We've partnered with CloudTech to enhance our infrastructure capabilities and expand our service offerings.",
    date: "2024-12-15",
    author: {
      name: "Michael Ross",
      role: "CEO",
      avatar: "/avatars/michael.jpg",
    },
  },
];

const transactions = [
  {
    id: 1,
    type: "buy",
    amount: "1,000",
    price: "0.65",
    total: "650",
    date: "2024-12-18 14:30",
    user: "0x1234...5678",
  },
  {
    id: 2,
    type: "sell",
    amount: "500",
    price: "0.68",
    total: "340",
    date: "2024-12-18 14:15",
    user: "0x8765...4321",
  },
];

const comments = [
  {
    id: 1,
    content: "Really impressed with the latest developments. The team is executing well on their roadmap.",
    date: "2024-12-18 15:30",
    likes: 24,
    author: {
      name: "Alex Thompson",
      avatar: "/avatars/alex.jpg",
    },
  },
  {
    id: 2,
    content: "The new partnership with CloudTech is a game-changer. Looking forward to seeing the integration.",
    date: "2024-12-18 14:45",
    likes: 18,
    author: {
      name: "Jessica Lee",
      avatar: "/avatars/jessica.jpg",
    },
  },
];

export default function ProjectPage({ params }: { params: { symbol: string } }) {
  const [newComment, setNewComment] = useState("");

  const handleComment = () => {
    // Handle comment submission
    setNewComment("");
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Project Header */}
      <Card className="p-6 card-glass shadow-soft">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg ${projectData.color}`} />
              <div>
                <h1 className="text-3xl font-bold">{projectData.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{projectData.category}</Badge>
                  <Badge variant="secondary">{projectData.symbol}</Badge>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              {projectData.description}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">${projectData.price}</div>
            <div className={`text-lg ${projectData.change > 0 ? "text-green-500" : "text-red-500"}`}>
              {projectData.change > 0 ? "+" : ""}{projectData.change}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <BarChart2 className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Market Cap</p>
              <p className="text-lg font-semibold">${projectData.marketCap}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">24h Volume</p>
              <p className="text-lg font-semibold">${projectData.volume}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <Users2 className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Holders</p>
              <p className="text-lg font-semibold">{projectData.holders}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="buy" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="buy">
            <DollarSign className="h-4 w-4 mr-2" />
            Buy
          </TabsTrigger>
          <TabsTrigger value="announcements">
            <Bell className="h-4 w-4 mr-2" />
            Announcements
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare className="h-4 w-4 mr-2" />
            Comments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="space-y-4">
          <Card className="card-glass shadow-soft">
            <CardHeader>
              <CardTitle>Buy {projectData.symbol}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount ({projectData.symbol})</label>
                  <Input type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Total (USD)</label>
                  <Input type="number" placeholder="0.00" />
                </div>
              </div>
              <Button className="w-full">
                Buy {projectData.symbol}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="card-glass shadow-soft">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={announcement.author.avatar} />
                      <AvatarFallback>{announcement.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{announcement.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        by {announcement.author.name} · {announcement.author.role} · {announcement.date}
                      </p>
                      <p className="mt-2">{announcement.content}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="card-glass shadow-soft">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${tx.type === 'buy' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {tx.type === 'buy' ? '+' : '-'}
                      </div>
                      <div>
                        <p className="font-medium">{tx.amount} {projectData.symbol}</p>
                        <p className="text-sm text-muted-foreground">{tx.user}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${tx.total}</p>
                      <p className="text-sm text-muted-foreground">${tx.price} per token</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <Card className="card-glass shadow-soft">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder="Share your thoughts..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button onClick={handleComment}>
                      <Send className="h-4 w-4 mr-2" />
                      Comment
                    </Button>
                  </div>
                </div>

                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4 pt-4">
                    <Avatar>
                      <AvatarImage src={comment.author.avatar} />
                      <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{comment.author.name}</p>
                          <p className="text-sm text-muted-foreground">{comment.date}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Report</DropdownMenuItem>
                            <DropdownMenuItem>Share</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="mt-2">{comment.content}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          {comment.likes}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
