"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/shared/user-avatar";
import { format } from "date-fns";

interface Connection {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "active" | "pending" | "inactive";
  lastActive: string;
}

// Demo connections for development
const DEMO_CONNECTIONS: Connection[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "AI Engineer",
    avatar: "https://avatar.vercel.sh/sarah",
    status: "active",
    lastActive: "2024-01-09T14:30:00Z",
  },
  {
    id: "2",
    name: "Alex Thompson",
    role: "Product Manager",
    avatar: "https://avatar.vercel.sh/alex",
    status: "active",
    lastActive: "2024-01-10T09:15:00Z",
  },
];

interface ConnectionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectionsDialog({ open, onOpenChange }: ConnectionsDialogProps) {
  const [activeTab, setActiveTab] = useState("active");
  const [connections, setConnections] = useState<Connection[]>(DEMO_CONNECTIONS);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConnections = connections.filter(connection => 
    connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    connection.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Network Connections</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Search connections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Tabs defaultValue="active" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {filteredConnections
                    .filter(conn => conn.status === "active")
                    .map((connection) => (
                      <div key={connection.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <UserAvatar 
                            user={{
                              id: connection.id,
                              name: connection.name,
                              avatar: connection.avatar,
                              role: connection.role
                            }}
                            showHoverCard={true}
                            size="md"
                          />
                          <div>
                            <h4 className="font-medium">{connection.name}</h4>
                            <p className="text-sm text-muted-foreground">{connection.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge>Active</Badge>
                          <Button variant="ghost" size="sm">Message</Button>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="pending">
              <div className="p-4 text-center text-muted-foreground">
                No pending connection requests
              </div>
            </TabsContent>

            <TabsContent value="all">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {filteredConnections.map((connection) => (
                    <div key={connection.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <UserAvatar 
                          user={{
                            id: connection.id,
                            name: connection.name,
                            avatar: connection.avatar,
                            role: connection.role
                          }}
                          showHoverCard={true}
                          size="md"
                        />
                        <div>
                          <h4 className="font-medium">{connection.name}</h4>
                          <p className="text-sm text-muted-foreground">{connection.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge>{connection.status}</Badge>
                        <Button variant="ghost" size="sm">Message</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
