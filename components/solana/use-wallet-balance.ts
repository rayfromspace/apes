"use client"

import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { useEffect, useState } from "react"
import { USDC_MINT } from "@/lib/solana"

export function useWalletBalance() {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [solBalance, setSolBalance] = useState(0)
  const [usdcBalance, setUsdcBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!publicKey) return

    const fetchBalances = async () => {
      try {
        setIsLoading(true)
        
        // Get SOL balance
        const sol = await connection.getBalance(publicKey)
        setSolBalance(sol / LAMPORTS_PER_SOL)

        // Get USDC token account and balance
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { mint: USDC_MINT }
        )

        // Handle case where user doesn't have a USDC account yet
        const usdcAccount = tokenAccounts.value[0]
        if (usdcAccount) {
          const balance = usdcAccount.account.data.parsed.info.tokenAmount.uiAmount
          setUsdcBalance(balance)
        } else {
          setUsdcBalance(0)
        }
      } catch (error) {
        console.error("Error fetching balances:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBalances()
    
    // Set up balance change listener
    const subscriptionId = connection.onAccountChange(
      publicKey,
      () => fetchBalances(),
      "confirmed"
    )

    return () => {
      connection.removeAccountChangeListener(subscriptionId)
    }
  }, [connection, publicKey])

  return { solBalance, usdcBalance, isLoading }
}