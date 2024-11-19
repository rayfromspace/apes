"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { NewInvestmentDialog } from "@/components/value-stake/new-investment-dialog"

export function InvestmentsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Investments</h1>
        <p className="text-muted-foreground">
          Manage your investments and track their performance
        </p>
      </div>
      <NewInvestmentDialog />
    </div>
  )
}