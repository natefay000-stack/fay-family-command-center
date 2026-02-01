import type React from "react"
import { AppHeader } from "@/components/app-header"
import { AppNav } from "@/components/app-nav"
import { Toaster } from "sonner"

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Mock profile for demo mode (use static date to avoid hydration mismatch)
  const demoProfile = {
    id: "demo-user",
    email: "demo@faygoals.com",
    full_name: "Demo User",
    role: "parent" as const,
    created_at: "2026-01-01T00:00:00.000Z",
  }

  return (
    <div className="min-h-screen bg-gray-600">
      <AppHeader profile={demoProfile} isDemo={true} />
      <AppNav isDemo={true} />
      <main>{children}</main>
      <Toaster position="bottom-right" richColors />
    </div>
  )
}
