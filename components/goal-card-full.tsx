"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Plus, Minus, CheckCircle2, Archive, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { AddMilestoneDialog } from "@/components/add-milestone-dialog"

interface Milestone {
  id: string
  title: string
  description?: string
  target_date?: string
  completed: boolean
  completed_at?: string
}

interface Goal {
  id: string
  title: string
  description?: string
  category: string
  target_value: number
  current_value: number
  unit?: string
  start_date: string
  end_date: string
  status: string
  milestones?: Milestone[]
}

interface GoalCardFullProps {
  goal: Goal
  onUpdate: (goal: Goal) => void
  onDelete: (goalId: string) => void
}

export function GoalCard({ goal, onUpdate, onDelete }: GoalCardFullProps) {
  const [loading, setLoading] = useState(false)
  const [showMilestoneDialog, setShowMilestoneDialog] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const progress = goal.target_value > 0 ? (goal.current_value / goal.target_value) * 100 : 0

  const updateProgress = async (increment: boolean) => {
    setLoading(true)
    const newValue = increment
      ? Math.min(goal.current_value + 1, goal.target_value)
      : Math.max(goal.current_value - 1, 0)

    const { data, error } = await supabase
      .from("goals")
      .update({ current_value: newValue })
      .eq("id", goal.id)
      .select()
      .single()

    if (!error && data) {
      onUpdate({ ...goal, current_value: newValue })
    }

    setLoading(false)
  }

  const updateStatus = async (status: string) => {
    const { data, error } = await supabase.from("goals").update({ status }).eq("id", goal.id).select().single()

    if (!error && data) {
      onUpdate({ ...goal, status })
    }
  }

  const deleteGoal = async () => {
    if (confirm("Are you sure you want to delete this goal?")) {
      const { error } = await supabase.from("goals").delete().eq("id", goal.id)

      if (!error) {
        onDelete(goal.id)
      }
    }
  }

  const toggleMilestone = async (milestoneId: string, completed: boolean) => {
    const { error } = await supabase
      .from("milestones")
      .update({
        completed: !completed,
        completed_at: !completed ? new Date().toISOString() : null,
      })
      .eq("id", milestoneId)

    if (!error) {
      router.refresh()
      const updatedMilestones =
        goal.milestones?.map((m) =>
          m.id === milestoneId
            ? { ...m, completed: !completed, completed_at: !completed ? new Date().toISOString() : null }
            : m,
        ) || []
      onUpdate({ ...goal, milestones: updatedMilestones })
    }
  }

  const handleMilestoneAdded = () => {
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="capitalize">
                {goal.category}
              </Badge>
              <Badge variant={goal.status === "active" ? "default" : "outline"}>{goal.status}</Badge>
            </div>
            <CardTitle className="text-xl mb-2">{goal.title}</CardTitle>
            {goal.description && <p className="text-sm text-muted-foreground">{goal.description}</p>}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {goal.status === "active" && (
                <DropdownMenuItem onClick={() => updateStatus("completed")}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark Complete
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => updateStatus("archived")}>
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={deleteGoal} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progress</span>
            <span className="text-muted-foreground">
              {goal.current_value} / {goal.target_value} {goal.unit}
            </span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-xs text-muted-foreground">{Math.round(progress)}% complete</p>
        </div>

        {/* Update Buttons */}
        {goal.status === "active" && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateProgress(false)}
              disabled={loading || goal.current_value === 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateProgress(true)}
              disabled={loading || goal.current_value >= goal.target_value}
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              Update Progress
            </Button>
          </div>
        )}

        {/* Milestones */}
        {goal.milestones && goal.milestones.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Milestones ({goal.milestones.filter((m) => m.completed).length}/{goal.milestones.length})
              </span>
              <Button variant="ghost" size="sm" onClick={() => setShowMilestoneDialog(true)}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-2">
              {goal.milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-start gap-2 text-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={() => toggleMilestone(milestone.id, milestone.completed)}
                  >
                    <CheckCircle2
                      className={`h-4 w-4 ${milestone.completed ? "text-primary fill-current" : "text-muted-foreground"}`}
                    />
                  </Button>
                  <div className="flex-1">
                    <p className={milestone.completed ? "line-through text-muted-foreground" : ""}>{milestone.title}</p>
                    {milestone.target_date && (
                      <p className="text-xs text-muted-foreground">
                        Due: {new Date(milestone.target_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {goal.milestones?.length === 0 && (
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-transparent"
            onClick={() => setShowMilestoneDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        )}

        {/* Dates */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>Start: {new Date(goal.start_date).toLocaleDateString()}</span>
          <span>End: {new Date(goal.end_date).toLocaleDateString()}</span>
        </div>
      </CardContent>

      <AddMilestoneDialog
        open={showMilestoneDialog}
        onOpenChange={setShowMilestoneDialog}
        goalId={goal.id}
        onMilestoneAdded={handleMilestoneAdded}
      />
    </Card>
  )
}
