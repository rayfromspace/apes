"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/lib/auth/store";
import { format } from "date-fns";
import { FileText, Link as LinkIcon, Wallet } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NFTContract {
  id: string;
  name: string;
  type: 'work' | 'equity';
  status: 'active' | 'expired' | 'pending';
  contractAddress: string;
  tokenId: string;
  startDate: string;
  endDate?: string;
  value: number;
  projectName: string;
  role: string;
}

export function NFTContractsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const supabase = createClientComponentClient();
  const { user } = useAuth();
  const [contracts, setContracts] = React.useState<NFTContract[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (open && user) {
      fetchContracts();
    }
  }, [open, user]);

  const fetchContracts = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // TODO: Replace with actual Supabase query once table is created
      const mockContracts: NFTContract[] = [
        {
          id: '1',
          name: 'Senior Developer Contract',
          type: 'work',
          status: 'active',
          contractAddress: '0x1234...5678',
          tokenId: '1',
          startDate: '2025-01-01',
          value: 5000,
          projectName: 'DeFi Protocol',
          role: 'Senior Developer'
        },
        {
          id: '2',
          name: 'Founding Team Equity',
          type: 'equity',
          status: 'active',
          contractAddress: '0x8765...4321',
          tokenId: '2',
          startDate: '2024-12-01',
          value: 100000,
          projectName: 'AI Platform',
          role: 'Co-founder'
        },
        {
          id: '3',
          name: 'Smart Contract Audit',
          type: 'work',
          status: 'expired',
          contractAddress: '0x9876...1234',
          tokenId: '3',
          startDate: '2024-10-01',
          endDate: '2024-12-31',
          value: 3000,
          projectName: 'NFT Marketplace',
          role: 'Security Auditor'
        }
      ];

      setContracts(mockContracts);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'expired':
        return 'bg-gray-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            NFT Contracts
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Contracts</TabsTrigger>
            <TabsTrigger value="work">Work Contracts</TabsTrigger>
            <TabsTrigger value="equity">Equity Contracts</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6 pt-4">
            <Button className="w-full">
              Create New Contract
              <FileText className="ml-2 h-4 w-4" />
            </Button>
            
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {contracts.map((contract) => (
                  <Card key={contract.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{contract.name}</h3>
                          <Badge variant="outline">{contract.type}</Badge>
                          <div className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(contract.status)}`}>
                            {contract.status}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Project: {contract.projectName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Role: {contract.role}
                        </div>
                        <div className="text-sm">
                          Start Date: {format(new Date(contract.startDate), "MMM d, yyyy")}
                          {contract.endDate && (
                            <> • End Date: {format(new Date(contract.endDate), "MMM d, yyyy")}</>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-sm">
                            <Wallet className="h-4 w-4" />
                            ${contract.value.toLocaleString()}
                          </div>
                          <Button variant="outline" size="sm" className="gap-1">
                            <LinkIcon className="h-3 w-3" />
                            View on Chain
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="work" className="space-y-6 pt-4">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {contracts.filter(c => c.type === 'work').map((contract) => (
                  <Card key={contract.id} className="p-4">
                    {/* Same card content as above */}
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="equity" className="space-y-6 pt-4">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {contracts.filter(c => c.type === 'equity').map((contract) => (
                  <Card key={contract.id} className="p-4">
                    {/* Same card content as above */}
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
