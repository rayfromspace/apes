"use client"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const isMobileView = window.innerWidth < 1024
      setIsMobile(isMobileView)
      setSidebarOpen(!isMobileView)
    }

    // Initial check
    checkScreenSize()

    // Add event listener
    window.addEventListener('resize', checkScreenSize)

    // Load saved state for desktop
    if (!isMobile) {
      const savedState = localStorage.getItem('sidebarOpen')
      setSidebarOpen(savedState === null ? true : savedState === 'true')
    }

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [isMobile])

  const toggleSidebar = () => {
    const newState = !sidebarOpen
    setSidebarOpen(newState)
    if (!isMobile) {
      localStorage.setItem('sidebarOpen', String(newState))
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar Backdrop for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 z-50 bg-background transition-all duration-300",
          isMobile ? "w-64" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-16",
          "border-r"
        )}
      >
        <DashboardNav collapsed={!sidebarOpen || (!isMobile && !sidebarOpen)} />
      </aside>

      {/* Main content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          isMobile ? "ml-0" : sidebarOpen ? "lg:ml-64" : "lg:ml-16"
        )}
      >
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className={cn(
                "shrink-0",
                !isMobile && "lg:hidden"
              )}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <UserNav />
            </div>
          </div>
        </header>
        <div className="container py-6">
          {children}
        </div>
      </main>
    </div>
  )
}