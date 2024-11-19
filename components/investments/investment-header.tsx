"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ChevronLeft } from "lucide-react"
import Link from "next/link"

interface InvestmentHeaderProps {
  id: string
}

export function InvestmentHeader({ id }: InvestmentHeaderProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/investments">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Project Investment #{id}</h1>
            <p className="text-muted-foreground">View investment details and performance</p>
          </div>
        </div>
        <Button>
          <ArrowUpRight className="mr-2 h-4 w-4" />
          Add Investment
        </Button>
      </CardContent>
    </Card>
  )
}