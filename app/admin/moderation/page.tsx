"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertTriangle,
  Flag,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  User,
} from "lucide-react";

interface Report {
  id: string;
  type: "post" | "comment" | "user" | "message";
  reason: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  reportedItem: {
    id: string;
    content: string;
    author: {
      id: string;
      name: string;
      avatar: string;
    };
    timestamp: string;
  };
  reporter: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: string;
  notes?: string;
}

const reports: Report[] = [
  {
    id: "1",
    type: "post",
    reason: "Inappropriate content",
    status: "pending",
    reportedItem: {
      id: "post1",
      content: "This is a reported post content...",
      author: {
        id: "user1",
        name: "John Doe",
        avatar: "/avatars/john.jpg",
      },
      timestamp: "2023-12-18T10:30:00Z",
    },
    reporter: {
      id: "user2",
      name: "Jane Smith",
      avatar: "/avatars/jane.jpg",
    },
    timestamp: "2023-12-18T11:00:00Z",
  },
  // Add more sample reports
];

export default function ContentModeration() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleReviewReport = (report: Report) => {
    setSelectedReport(report);
  };

  const handleResolveReport = () => {
    // Handle report resolution
    setSelectedReport(null);
  };

  const handleDismissReport = () => {
    // Handle report dismissal
    setSelectedReport(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "reviewed":
        return "bg-blue-500";
      case "resolved":
        return "bg-green-500";
      case "dismissed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "post":
        return <MessageSquare className="h-4 w-4" />;
      case "comment":
        return <MessageSquare className="h-4 w-4" />;
      case "user":
        return <User className="h-4 w-4" />;
      case "message":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Content Moderation</h1>
          <p className="text-muted-foreground">
            Review and manage reported content
          </p>
        </div>
        <Button>
          <Flag className="h-4 w-4 mr-2" />
          View Moderation Log
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Select
                value={filter}
                onValueChange={setFilter}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>
              Review and manage reported content across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Reported Content</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(report.type)}
                        <span className="capitalize">{report.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={report.reportedItem.author.avatar} />
                          <AvatarFallback>
                            {report.reportedItem.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {report.reportedItem.author.name}
                          </div>
                          <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                            {report.reportedItem.content}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={report.reporter.avatar} />
                          <AvatarFallback>
                            {report.reporter.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{report.reporter.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${getStatusColor(report.status)} text-white`}
                      >
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(report.timestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReviewReport(report)}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Review Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Report</DialogTitle>
            <DialogDescription>
              Review the reported content and take appropriate action
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <Tabs defaultValue="content">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="context">Context</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar>
                      <AvatarImage
                        src={selectedReport.reportedItem.author.avatar}
                      />
                      <AvatarFallback>
                        {selectedReport.reportedItem.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {selectedReport.reportedItem.author.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(
                          selectedReport.reportedItem.timestamp
                        ).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <p>{selectedReport.reportedItem.content}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Report Details</h4>
                  <p>
                    <span className="font-medium">Reason:</span>{" "}
                    {selectedReport.reason}
                  </p>
                  <p>
                    <span className="font-medium">Reported by:</span>{" "}
                    {selectedReport.reporter.name}
                  </p>
                  <p>
                    <span className="font-medium">Report time:</span>{" "}
                    {new Date(selectedReport.timestamp).toLocaleString()}
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="context">
                <ScrollArea className="h-[400px]">
                  {/* Add surrounding context */}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="history">
                <ScrollArea className="h-[400px]">
                  {/* Add user/content history */}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDismissReport}>
                <ThumbsDown className="h-4 w-4 mr-2" />
                Dismiss
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  // Handle content removal
                }}
              >
                Remove Content
              </Button>
            </div>
            <Button onClick={handleResolveReport}>
              <ThumbsUp className="h-4 w-4 mr-2" />
              Resolve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
