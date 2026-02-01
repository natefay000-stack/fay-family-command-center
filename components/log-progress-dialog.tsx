"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import type { Goal } from "@/lib/types"

interface LogProgressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goal: Goal
  onSave: (updatedGoal: Goal) => void
  isDemo?: boolean
}

export function LogProgressDialog({
  open,
  onOpenChange,
  goal,
  onSave,
  isDemo = false,
}: LogProgressDialogProps) {
  const [value, setValue] = useState(goal.current_value?.toString() || "0")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const progress = goal.target_value
    ? Math.round((parseFloat(value) / goal.target_value) * 100)
    : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!value) {
      toast.error("Please enter a value")
      return
    }

    setLoading(true)

    try {
      const newValue = parseFloat(value)

      // If Supabase is configured and not in demo mode, save to database
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !isDemo) {
        // Log the metric
        await fetch("/api/metrics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            goal_id: goal.id,
            user_id: goal.user_id,
            value: newValue,
            notes: notes.trim() || null,
          }),
        })

        // Update the goal's current value
        const response = await fetch(`/api/goals/${goal.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ current_value: newValue }),
        })

        if (!response.ok) {
          throw new Error("Failed to update progress")
        }
      }

      const updatedGoal: Goal = {
        ...goal,
        current_value: newValue,
        updated_at: new Date().toISOString(),
      }

      onSave(updatedGoal)
      toast.success("Progress logged!")
      onOpenChange(false)
      setNotes("")
    } catch (error) {
      console.error("Error logging progress:", error)
      toast.error("Failed to log progress")
    } finally {
      setLoading(false)
    }
  }

  const markComplete = async () => {
    setLoading(true)

    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !isDemo) {
        const response = await fetch(`/api/goals/${goal.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            is_completed: true,
            current_value: goal.target_value || goal.current_value,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to mark complete")
        }
      }

      const updatedGoal: Goal = {
        ...goal,
        is_completed: true,
        current_value: goal.target_value || goal.current_value,
        updated_at: new Date().toISOString(),
      }

      onSave(updatedGoal)
      toast.success("Goal completed! Great job! 🎉")
      onOpenChange(false)
    } catch (error) {
      console.error("Error marking complete:", error)
      toast.error("Failed to mark complete")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            Log Progress
          </DialogTitle>
          <DialogDescription>
            Update your progress on: <strong>{goal.title}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Current Progress Display */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="font-bold text-lg">{progress}%</span>
            </div>
            <div className="w-full h-3 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-muted-foreground">
                Current: {value} {goal.unit}
              </span>
              {goal.target_value && (
                <span className="text-muted-foreground">
                  Target: {goal.target_value} {goal.unit}
                </span>
              )}
            </div>
          </div>

          {/* Value Input */}
          <div className="space-y-2">
            <Label htmlFor="value">
              New Value {goal.unit && <span className="text-muted-foreground">({goal.unit})</span>}
            </Label>
            <Input
              id="value"
              type="number"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              className="text-lg"
            />
          </div>

          {/* Quick Adjust Buttons */}
          {goal.target_value && (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setValue((parseFloat(value) - 1).toString())}
              >
                -1
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setValue((parseFloat(value) + 1).toString())}
              >
                +1
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setValue((parseFloat(value) + 5).toString())}
              >
                +5
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setValue(goal.target_value!.toString())}
              >
                Set to Target
              </Button>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any notes about this update..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            {goal.target_value && parseFloat(value) >= goal.target_value && !goal.is_completed && (
              <Button
                type="button"
                variant="secondary"
                onClick={markComplete}
                disabled={loading}
                className="bg-green-100 text-green-700 hover:bg-green-200"
              >
                🎉 Mark Complete
              </Button>
            )}
            {(!goal.target_value || parseFloat(value) < goal.target_value) && <div />}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Log Progress"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
