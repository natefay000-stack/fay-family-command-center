"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, TrendingUp, CheckCircle, Trash2 } from "lucide-react"
import { GoalDialog } from "./goal-dialog"
import { LogProgressDialog } from "./log-progress-dialog"
import type { Goal } from "@/lib/types"

interface InteractiveGoalCardProps {
  goal: Goal
  userName?: string
  onUpdate: (goal: Goal) => void
  onDelete: (goalId: string) => void
  compact?: boolean
  isDemo?: boolean
}

const categoryConfig: Record<string, { emoji: string; color: string }> = {
  sports: { emoji: "⚾", color: "bg-green-100 text-green-700" },
  health: { emoji: "💪", color: "bg-blue-100 text-blue-700" },
  academic: { emoji: "📚", color: "bg-purple-100 text-purple-700" },
  personal: { emoji: "🌟", color: "bg-yellow-100 text-yellow-700" },
  professional: { emoji: "💼", color: "bg-orange-100 text-orange-700" },
  travel: { emoji: "✈️", color: "bg-pink-100 text-pink-700" },
}

export function InteractiveGoalCard({
  goal,
  userName,
  onUpdate,
  onDelete,
  compact = false,
  isDemo = false,
}: InteractiveGoalCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [logOpen, setLogOpen] = useState(false)

  const config = categoryConfig[goal.category] || { emoji: "🎯", color: "bg-gray-100 text-gray-700" }

  const progress = goal.target_value
    ? Math.min(100, Math.round((goal.current_value / goal.target_value) * 100))
    : 0

  const getStatusColor = () => {
    if (goal.is_completed) return "bg-green-500"
    if (progress >= 75) return "bg-green-500"
    if (progress >= 50) return "bg-blue-500"
    if (progress >= 25) return "bg-yellow-500"
    return "bg-gray-400"
  }

  const daysLeft = goal.deadline
    ? Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  if (compact) {
    return (
      <>
        <Card
          className="p-3 hover:shadow-md transition-shadow cursor-pointer group relative"
          onClick={() => setLogOpen(true)}
        >
          {/* Menu Button */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLogOpen(true)}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Log Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Goal
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => {
                    if (confirm("Delete this goal?")) onDelete(goal.id)
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Content */}
          <div className="flex items-start gap-2 mb-2">
            <span className="text-lg">{config.emoji}</span>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm leading-tight truncate pr-6">{goal.title}</h4>
              {goal.is_completed && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Completed
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {goal.target_value && !goal.is_completed && (
            <div className="space-y-1">
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${getStatusColor()}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{goal.current_value} / {goal.target_value} {goal.unit}</span>
                <span>{progress}%</span>
              </div>
            </div>
          )}

          {/* Deadline */}
          {daysLeft !== null && daysLeft > 0 && !goal.is_completed && (
            <div className="text-xs text-muted-foreground mt-1">
              {daysLeft} days left
            </div>
          )}
        </Card>

        <GoalDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          goal={goal}
          userId={goal.user_id}
          onSave={onUpdate}
          onDelete={onDelete}
          isDemo={isDemo}
        />

        <LogProgressDialog
          open={logOpen}
          onOpenChange={setLogOpen}
          goal={goal}
          onSave={onUpdate}
          isDemo={isDemo}
        />
      </>
    )
  }

  // Full size card
  return (
    <>
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center text-xl`}>
              {config.emoji}
            </div>
            <div>
              <h3 className="font-semibold">{goal.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${config.color}`}>
                {goal.category}
              </span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLogOpen(true)}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Log Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Goal
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  if (confirm("Delete this goal?")) onDelete(goal.id)
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {goal.description && (
          <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
        )}

        {/* Progress Section */}
        {goal.target_value && (
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {goal.current_value} / {goal.target_value} {goal.unit}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${getStatusColor()}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-sm text-muted-foreground">
            {goal.is_completed ? (
              <span className="text-green-600 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> Completed
              </span>
            ) : daysLeft !== null ? (
              daysLeft > 0 ? `${daysLeft} days left` : "Overdue"
            ) : (
              "No deadline"
            )}
          </div>
          <Button size="sm" onClick={() => setLogOpen(true)}>
            <TrendingUp className="h-4 w-4 mr-1" />
            Log Progress
          </Button>
        </div>
      </Card>

      <GoalDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        goal={goal}
        userId={goal.user_id}
        onSave={onUpdate}
        onDelete={onDelete}
        isDemo={isDemo}
      />

      <LogProgressDialog
        open={logOpen}
        onOpenChange={setLogOpen}
        goal={goal}
        onSave={onUpdate}
        isDemo={isDemo}
      />
    </>
  )
}
