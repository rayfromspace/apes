"use client"

import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function WalletButton() {
  const [isConnected, setIsConnected] = useState(false)

  const handleConnect = () => {
    setIsConnected(!isConnected)
    toast.success(isConnected ? "Wallet disconnected" : "Wallet connected")
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleConnect}
      className="font-mono"
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isConnected ? "0x1234...5678" : "Connect Wallet"}
    </Button>
  )
}