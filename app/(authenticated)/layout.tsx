import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { NotificationBell } from "@/components/notification-bell"

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Redirect to demo mode if Supabase is not configured
  if (!supabase) {
    redirect("/demo/dashboard")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  const initials = profile.full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="min-h-screen bg-gray-600">
      <nav className="h-16 border-b bg-white px-6 flex items-center justify-between sticky top-0 z-50">
        <a href="/dashboard" className="text-xl font-bold text-navy-dark">
          Fay Goals
        </a>
        <div className="flex items-center gap-4">
          <NotificationBell userId={user.id} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Avatar className="h-9 w-9 cursor-pointer bg-navy-dark">
                  <AvatarFallback className="bg-navy-dark text-white text-sm">{initials || "U"}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <a href="/settings">Settings</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/notifications">Notifications</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <form action="/api/auth/signout" method="post">
                  <button type="submit" className="w-full text-left">
                    Sign Out
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
