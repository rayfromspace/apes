import { clusterApiUrl, Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"

// Use devnet by default
const network = WalletAdapterNetwork.Devnet
export const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(network)
export const connection = new Connection(endpoint, "confirmed")

// Devnet USDC mint address
export const USDC_MINT = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr")

// Helper function to format public key for display
export function formatPublicKey(publicKey: PublicKey | string | null): string {
  if (!publicKey) return ""
  const key = publicKey.toString()
  return `${key.slice(0, 4)}...${key.slice(-4)}`
}

// Helper function to format USDC amount
export function formatUSDC(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 1_000_000) // USDC has 6 decimals
}

// Request SOL airdrop for testing
export async function requestAirdrop(publicKey: PublicKey): Promise<string> {
  try {
    const signature = await connection.requestAirdrop(
      publicKey,
      2 * LAMPORTS_PER_SOL // Request 2 SOL
    )
    await connection.confirmTransaction(signature, "confirmed")
    return signature
  } catch (error) {
    console.error("Error requesting airdrop:", error)
    throw error
  }
}