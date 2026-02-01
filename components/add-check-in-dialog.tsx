"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"

interface AddCheckInDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCheckInAdded: (checkIn: any) => void
}

export function AddCheckInDialog({ open, onOpenChange, onCheckInAdded }: AddCheckInDialogProps) {
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [mood, setMood] = useState("good")
  const [content, setContent] = useState("")
  const [highlights, setHighlights] = useState("")
  const [challenges, setChallenges] = useState("")

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from("check_ins")
      .insert({
        user_id: user.id,
        date,
        mood,
        content,
        highlights: highlights || null,
        challenges: challenges || null,
      })
      .select()
      .single()

    if (!error && data) {
      onCheckInAdded(data)
      setContent("")
      setHighlights("")
      setChallenges("")
      setMood("good")
      onOpenChange(false)
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Check-in</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mood">Mood</Label>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="great">Great</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="okay">Okay</SelectItem>
                  <SelectItem value="struggling">Struggling</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">How was your day?</Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts, progress, and experiences..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="highlights">Highlights (optional)</Label>
            <Textarea
              id="highlights"
              placeholder="What went well today?"
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="challenges">Challenges (optional)</Label>
            <Textarea
              id="challenges"
              placeholder="What was difficult or needs improvement?"
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              rows={2}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Check-in"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
