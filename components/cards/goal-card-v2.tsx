"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, TrendingUp, Users } from "lucide-react"

interface GoalCardProps {
  id: string
  title: string
  milestonesCompleted: number
  milestonesTotal: number
  dueDate?: string
  category: string
  status: "on-track" | "behind" | "ahead" | "at-risk"
  owner?: string
  compact?: boolean
}

const categoryConfig: Record<string, { bg: string; icon: string; badge: string; company: string }> = {
  athletic: { bg: "bg-white", icon: "⚾️", badge: "bg-blue-100 text-blue-700", company: "Athletic" },
  academic: { bg: "bg-white", icon: "📚", badge: "bg-green-100 text-green-700", company: "Academic" },
  health: { bg: "bg-white", icon: "💪", badge: "bg-purple-100 text-purple-700", company: "Health" },
  financial: { bg: "bg-white", icon: "💰", badge: "bg-yellow-100 text-yellow-700", company: "Financial" },
  personal: { bg: "bg-white", icon: "🎯", badge: "bg-pink-100 text-pink-700", company: "Personal" },
  travel: { bg: "bg-white", icon: "✈️", badge: "bg-indigo-100 text-indigo-700", company: "Travel" },
  home: { bg: "bg-white", icon: "🏠", badge: "bg-orange-100 text-orange-700", company: "Home" },
  default: { bg: "bg-white", icon: "🎯", badge: "bg-gray-100 text-gray-700", company: "Goal" },
}

export function GoalCard({
  id,
  title,
  milestonesCompleted,
  milestonesTotal,
  dueDate,
  category,
  owner,
  compact = false,
}: GoalCardProps) {
  const config = categoryConfig[category] || categoryConfig.default
  const progress = (milestonesCompleted / milestonesTotal) * 100

  const daysLeft = dueDate ? Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null

  const statusDate = dueDate
    ? new Date(dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "No deadline"

  if (compact) {
    return (
      <Card className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group h-full flex flex-col">
        <div className="p-4 flex flex-col items-center text-center flex-1">
          {/* Icon Circle - Centered */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-4xl shadow-md mb-3">
            {config.icon}
          </div>

          {/* Category Badge */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${config.badge}`}>{config.company}</span>
            <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px]">
              ✓
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
            {title}
          </h3>

          {/* Progress Percentage - Large */}
          <div className="text-2xl font-bold text-gray-900 mb-2">{Math.round(progress)}%</div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Days Left */}
          {daysLeft !== null && (
            <div className="text-xs text-gray-600 mb-3">
              <Calendar className="w-3 h-3 inline mr-1" />
              {daysLeft} days left
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-center gap-3 text-xs text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span className="font-semibold">{milestonesCompleted}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span className="font-semibold">{milestonesTotal}</span>
            </div>
          </div>

          {/* Details Button */}
          <Button
            asChild
            size="sm"
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-all w-full"
          >
            <Link href={`/goals#${id}`}>Details</Link>
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group">
      <div className="p-6">
        {/* Header with Logo and Date */}
        <div className="flex items-start justify-between mb-4">
          {/* Company Logo Circle */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-3xl shadow-md">
            {config.icon}
          </div>
          {/* Date Badge */}
          <div className="text-sm text-gray-500 font-medium">{statusDate}</div>
        </div>

        {/* Company Name with Checkmark */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${config.badge}`}>{config.company}</span>
          <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
            ✓
          </span>
        </div>

        {/* Job Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* Job Details */}
        <div className="flex flex-wrap gap-2 mb-4 text-sm text-gray-600">
          {owner && (
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{owner}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" />
            <span>{Math.round(progress)}% Complete</span>
          </div>
          {daysLeft !== null && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{daysLeft} days left</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stats and Button Row */}
        <div className="flex items-center justify-between">
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span className="font-semibold">{milestonesCompleted}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span className="font-semibold">{milestonesTotal}</span>
            </div>
          </div>

          {/* Details Button */}
          <Button
            asChild
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold transition-all"
          >
            <Link href={`/goals#${id}`}>Details</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
