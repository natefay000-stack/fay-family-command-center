"use client"

import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Calendar } from "lucide-react"

interface GoalCardProps {
  id: string
  title: string
  description?: string
  progress: number
  milestonesCompleted: number
  milestonesTotal: number
  dueDate?: string
  category: string
  status: "on-track" | "behind" | "ahead" | "at-risk"
}

export function GoalCard({
  id,
  title,
  description,
  progress,
  milestonesCompleted,
  milestonesTotal,
  dueDate,
  category,
  status,
}: GoalCardProps) {
  const daysUntilDue = dueDate ? Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null

  const categoryEmojis: Record<string, string> = {
    athletic: "⚡",
    academic: "📚",
    health: "💪",
    financial: "💰",
    default: "🎯",
  }

  return (
    <Link href={`/goals#${id}`} className="block group">
      <Card className="bg-white rounded-2xl border-none shadow-sm hover:shadow-md transition-all duration-200 h-full overflow-hidden">
        {/* Visual Area - Progress Circle */}
        <div className="aspect-square bg-gray-50 flex items-center justify-center border-b relative">
          <div className="relative w-40 h-40">
            <svg className="transform -rotate-90 w-40 h-40">
              <circle cx="80" cy="80" r="70" stroke="#E5E5E5" strokeWidth="12" fill="transparent" />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#1D3C6C"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl">{categoryEmojis[category] || categoryEmojis.default}</span>
              <span className="text-2xl font-bold mt-2">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-3">
          {/* Title */}
          <h3 className="text-base font-medium text-foreground leading-tight line-clamp-2 min-h-[2.5rem]">{title}</h3>

          {/* Milestones */}
          <div className="text-sm text-muted-foreground">
            {milestonesCompleted} of {milestonesTotal} milestones
          </div>

          {/* Due Date */}
          {dueDate && daysUntilDue !== null && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
              <Calendar className="h-4 w-4" />
              <span>
                {daysUntilDue > 0 ? `${daysUntilDue} days left` : daysUntilDue === 0 ? "Due today" : "Overdue"}
              </span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
