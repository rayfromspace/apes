"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateInvestmentDialog } from "./create-investment-dialog";

export function ValueStakeHeader() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Value Stake</h1>
          <p className="text-muted-foreground">
            Track your investments and portfolio performance
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Investment
        </Button>
      </div>

      <CreateInvestmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}