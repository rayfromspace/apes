"use client"

import { AuthForm } from "@/components/auth/auth-form"
import { Card } from "@/components/ui/card"
import { Rocket } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Rocket className="h-6 w-6" />
          <span className="text-xl font-bold">Colab Apes</span>
        </Link>
      </div>
      
      <div className="flex-1 container flex items-center justify-center py-8">
        <Card className="w-full max-w-md p-8">
          <AuthForm mode="login" />
        </Card>
      </div>
    </div>
  )
}