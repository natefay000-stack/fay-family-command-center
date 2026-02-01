"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Target, TrendingUp, Users, CalendarDays, Calendar } from "lucide-react"

interface AppNavProps {
  isDemo?: boolean
}

export function AppNav({ isDemo = false }: AppNavProps) {
  const pathname = usePathname()

  const basePrefix = isDemo ? "/demo" : ""

  const navItems = [
    {
      title: "Dashboard",
      href: `${basePrefix}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      title: "My Goals",
      href: `${basePrefix}/goals`,
      icon: Target,
    },
    {
      title: "My Metrics",
      href: `${basePrefix}/metrics`,
      icon: TrendingUp,
    },
    {
      title: "Calendar",
      href: `${basePrefix}/calendar`,
      icon: Calendar,
    },
    {
      title: "Family",
      href: `${basePrefix}/family`,
      icon: Users,
    },
    {
      title: "Check-ins",
      href: `${basePrefix}/check-ins`,
      icon: CalendarDays,
    },
  ]

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors hover:text-primary whitespace-nowrap border-b-2 -mb-px",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
