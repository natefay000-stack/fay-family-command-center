"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, CalendarDays, Smile, Meh, Frown, Sparkles } from "lucide-react"
import { AddCheckInDialog } from "@/components/add-check-in-dialog"

interface CheckIn {
  id: string
  date: string
  mood: string
  content: string
  highlights?: string
  challenges?: string
  created_at: string
}

interface CheckInsViewProps {
  initialCheckIns: CheckIn[]
}

export function CheckInsView({ initialCheckIns }: CheckInsViewProps) {
  const [checkIns, setCheckIns] = useState<CheckIn[]>(initialCheckIns)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const handleCheckInAdded = (newCheckIn: CheckIn) => {
    setCheckIns([newCheckIn, ...checkIns])
    setShowAddDialog(false)
  }

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "great":
        return <Sparkles className="h-4 w-4" />
      case "good":
        return <Smile className="h-4 w-4" />
      case "okay":
        return <Meh className="h-4 w-4" />
      case "struggling":
        return <Frown className="h-4 w-4" />
      default:
        return null
    }
  }

  const getMoodVariant = (mood: string) => {
    switch (mood) {
      case "great":
        return "default"
      case "good":
        return "secondary"
      case "okay":
        return "outline"
      case "struggling":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Check-ins</h1>
          <p className="text-muted-foreground">Daily reflections and progress updates</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Check-in
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Check-ins</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checkIns.length}</div>
            <p className="text-xs text-muted-foreground">All-time entries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                checkIns.filter((c) => {
                  const checkInDate = new Date(c.date)
                  const now = new Date()
                  return checkInDate.getMonth() === now.getMonth() && checkInDate.getFullYear() === now.getFullYear()
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Entries this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Great Days</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checkIns.filter((c) => c.mood === "great").length}</div>
            <p className="text-xs text-muted-foreground">Feeling amazing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(() => {
                let streak = 0
                const sortedCheckIns = [...checkIns].sort(
                  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
                )
                const today = new Date()
                today.setHours(0, 0, 0, 0)

                for (const checkIn of sortedCheckIns) {
                  const checkInDate = new Date(checkIn.date)
                  checkInDate.setHours(0, 0, 0, 0)
                  const diffDays = Math.floor((today.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))

                  if (diffDays === streak) {
                    streak++
                  } else {
                    break
                  }
                }
                return streak
              })()}
            </div>
            <p className="text-xs text-muted-foreground">Consecutive days</p>
          </CardContent>
        </Card>
      </div>

      {/* Check-ins List */}
      {checkIns.length > 0 ? (
        <div className="space-y-4">
          {checkIns.map((checkIn) => (
            <Card key={checkIn.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={getMoodVariant(checkIn.mood)} className="capitalize">
                      {getMoodIcon(checkIn.mood)}
                      <span className="ml-1">{checkIn.mood}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(checkIn.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-relaxed">{checkIn.content}</p>
                {checkIn.highlights && (
                  <div className="p-3 bg-primary/5 rounded-lg">
                    <p className="text-sm font-medium text-primary mb-1">Highlights</p>
                    <p className="text-sm">{checkIn.highlights}</p>
                  </div>
                )}
                {checkIn.challenges && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Challenges</p>
                    <p className="text-sm text-muted-foreground">{checkIn.challenges}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <CalendarDays className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
              <div>
                <h3 className="text-lg font-semibold mb-2">No check-ins yet</h3>
                <p className="text-muted-foreground mb-4">Start documenting your daily reflections and progress!</p>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Check-in
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <AddCheckInDialog open={showAddDialog} onOpenChange={setShowAddDialog} onCheckInAdded={handleCheckInAdded} />
    </div>
  )
}
