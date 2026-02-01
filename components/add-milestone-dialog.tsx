"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"

interface AddMilestoneDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goalId: string
  onMilestoneAdded: () => void
}

export function AddMilestoneDialog({ open, onOpenChange, goalId, onMilestoneAdded }: AddMilestoneDialogProps) {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [targetDate, setTargetDate] = useState("")

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from("milestones").insert({
      goal_id: goalId,
      title,
      description,
      target_date: targetDate || null,
      completed: false,
    })

    if (!error) {
      setTitle("")
      setDescription("")
      setTargetDate("")
      onMilestoneAdded()
      onOpenChange(false)
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Milestone</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Milestone Title</Label>
            <Input
              id="title"
              placeholder="e.g., Complete first 100 miles"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Add details about this milestone..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetDate">Target Date (optional)</Label>
            <Input id="targetDate" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Milestone"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
