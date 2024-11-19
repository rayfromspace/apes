"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { toast } from "sonner"

interface User {
  email: string
  role?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string, role: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in via cookie
    const userEmail = Cookies.get("userEmail")
    if (userEmail) {
      setUser({ email: userEmail })
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Demo login - store user info in cookie
      Cookies.set("userEmail", email)
      setUser({ email })
      toast.success("Successfully logged in!")
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Failed to log in")
      throw error
    }
  }

  const register = async (email: string, username: string, password: string, role: string) => {
    try {
      // Demo registration - store user info in cookie
      Cookies.set("userEmail", email)
      setUser({ email, role })
      toast.success("Successfully registered!")
      router.push("/dashboard")
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("Failed to register")
      throw error
    }
  }

  const logout = () => {
    Cookies.remove("userEmail")
    setUser(null)
    toast.success("Successfully logged out!")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)