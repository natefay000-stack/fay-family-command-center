"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { Goal, GoalCategory } from "@/lib/types"

interface GoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goal?: Goal | null // If provided, we're editing
  userId: string
  userName?: string
  onSave: (goal: Goal) => void
  onDelete?: (goalId: string) => void
  isDemo?: boolean // Skip API calls in demo mode
}

const CATEGORIES: { value: GoalCategory; label: string; emoji: string }[] = [
  { value: "health", label: "Health & Fitness", emoji: "💪" },
  { value: "sports", label: "Sports", emoji: "⚾" },
  { value: "academic", label: "Academic", emoji: "📚" },
  { value: "personal", label: "Personal Growth", emoji: "🌟" },
  { value: "professional", label: "Professional", emoji: "💼" },
  { value: "travel", label: "Travel", emoji: "✈️" },
]

export function GoalDialog({
  open,
  onOpenChange,
  goal,
  userId,
  userName,
  onSave,
  onDelete,
  isDemo = false,
}: GoalDialogProps) {
  const isEditing = !!goal

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<GoalCategory>("personal")
  const [targetValue, setTargetValue] = useState("")
  const [currentValue, setCurrentValue] = useState("")
  const [unit, setUnit] = useState("")
  const [deadline, setDeadline] = useState("")
  const [loading, setLoading] = useState(false)

  // Reset form when dialog opens/closes or goal changes
  useEffect(() => {
    if (open && goal) {
      setTitle(goal.title)
      setDescription(goal.description || "")
      setCategory(goal.category)
      setTargetValue(goal.target_value?.toString() || "")
      setCurrentValue(goal.current_value?.toString() || "0")
      setUnit(goal.unit || "")
      setDeadline(goal.deadline || "")
    } else if (open && !goal) {
      // Reset for new goal
      setTitle("")
      setDescription("")
      setCategory("personal")
      setTargetValue("")
      setCurrentValue("0")
      setUnit("")
      setDeadline("")
    }
  }, [open, goal])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error("Please enter a goal title")
      return
    }

    setLoading(true)

    try {
      const goalData: Goal = {
        id: goal?.id || `goal-${Date.now()}`,
        user_id: userId,
        title: title.trim(),
        description: description.trim() || null,
        category,
        target_value: targetValue ? parseFloat(targetValue) : null,
        current_value: currentValue ? parseFloat(currentValue) : 0,
        unit: unit.trim() || null,
        deadline: deadline || null,
        is_completed: goal?.is_completed || false,
        created_at: goal?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // If Supabase is configured and not in demo mode, save to database
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !isDemo) {
        const endpoint = isEditing ? `/api/goals/${goal.id}` : "/api/goals"
        const method = isEditing ? "PATCH" : "POST"

        const response = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(goalData),
        })

        if (!response.ok) {
          throw new Error("Failed to save goal")
        }

        const savedGoal = await response.json()
        onSave(savedGoal)
      } else {
        // Demo mode - just return the goal data
        onSave(goalData)
      }

      toast.success(isEditing ? "Goal updated!" : "Goal created!")
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving goal:", error)
      toast.error("Failed to save goal. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!goal || !onDelete) return

    if (!confirm("Are you sure you want to delete this goal?")) return

    setLoading(true)

    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !isDemo) {
        const response = await fetch(`/api/goals/${goal.id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to delete goal")
        }
      }

      onDelete(goal.id)
      toast.success("Goal deleted")
      onOpenChange(false)
    } catch (error) {
      console.error("Error deleting goal:", error)
      toast.error("Failed to delete goal")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditing ? "Edit Goal" : "Create New Goal"}
            {userName && !isEditing && <span className="text-muted-foreground font-normal"> for {userName}</span>}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your goal details and track your progress."
              : "Set a new goal to track your progress toward what matters most."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Hit 93 MPH, Lose 10 lbs, Read 12 books"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as GoalCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <span className="flex items-center gap-2">
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Target and Current Value */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetValue">Target Value</Label>
              <Input
                id="targetValue"
                type="number"
                step="any"
                placeholder="e.g., 93"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentValue">Current Value</Label>
              <Input
                id="currentValue"
                type="number"
                step="any"
                placeholder="e.g., 88"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
              />
            </div>
          </div>

          {/* Unit */}
          <div className="space-y-2">
            <Label htmlFor="unit">Unit (optional)</Label>
            <Input
              id="unit"
              placeholder="e.g., mph, lbs, books, gpa"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label htmlFor="deadline">Target Date (optional)</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Add any notes or context for this goal..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            {isEditing && onDelete ? (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                Delete Goal
              </Button>
            ) : (
              <div />
            )}
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
                {loading ? "Saving..." : isEditing ? "Save Changes" : "Create Goal"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
