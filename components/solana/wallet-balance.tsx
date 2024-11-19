"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useWalletBalance } from "./use-wallet-balance"
import { formatUSDC } from "@/lib/solana"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function WalletBalance() {
  const { solBalance, usdcBalance, isLoading } = useWalletBalance()

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-4 w-20" />
        </CardContent>
      </Card>
    )
  }

  const lowBalance = solBalance < 0.1 // Show warning if less than 0.1 SOL

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">SOL Balance:</span>
            <span className="font-mono">{solBalance.toFixed(4)} SOL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">USDC Balance:</span>
            <span className="font-mono">{formatUSDC(usdcBalance)}</span>
          </div>
        </CardContent>
      </Card>

      {lowBalance && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Low SOL balance. Click "Get Devnet SOL" to request an airdrop.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}