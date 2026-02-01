"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"

interface PersonCardProps {
  id: string
  name: string
  role: string
  weekRating: number
  activeGoals: number
  streak: number
  logsToday: number
  recentActivity: string
}

export function PersonCard({
  id,
  name,
  role,
  weekRating,
  activeGoals,
  streak,
  logsToday,
  recentActivity,
}: PersonCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Link href={`/family#${id}`} className="block group">
      <Card className="bg-white rounded-2xl border-none shadow-sm hover:shadow-md transition-all duration-200 h-full overflow-hidden">
        <div className="aspect-square bg-gray-50 flex items-center justify-center border-b">
          <Avatar className="h-32 w-32">
            <AvatarFallback className="bg-navy-dark text-white text-4xl font-bold">{initials}</AvatarFallback>
          </Avatar>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-4">
          {/* Name & Role */}
          <div>
            <h3 className="text-base font-medium text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground capitalize">{role}</p>
          </div>

          {/* Stats Grid - Simple numbers */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t">
            <div>
              <p className="text-2xl font-bold text-foreground">{activeGoals}</p>
              <p className="text-xs text-muted-foreground">Goals</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{streak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{logsToday}</p>
              <p className="text-xs text-muted-foreground">Today</p>
            </div>
          </div>

          {/* Recent Activity - One line */}
          <p className="text-sm text-muted-foreground line-clamp-1 pt-2 border-t">{recentActivity}</p>
        </div>
      </Card>
    </Link>
  )
}
