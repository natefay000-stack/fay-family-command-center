"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { MonthView } from "@/components/calendar/month-view"
import { WeekView } from "@/components/calendar/week-view"
import { DayView } from "@/components/calendar/day-view"

interface Metric {
  id: string
  metric_name: string
  metric_value: number
  unit: string
  date: string
  notes?: string
}

interface Milestone {
  id: string
  title: string
  due_date: string
  completed: boolean
  goal: {
    title: string
  }
}

interface CalendarViewProps {
  metrics: Metric[]
  milestones: Milestone[]
}

type ViewType = "month" | "week" | "day"

export function CalendarView({ metrics, milestones }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1))
  const [viewType, setViewType] = useState<ViewType>("month")

  const goToPrevious = () => {
    const newDate = new Date(currentDate)
    if (viewType === "month") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else if (viewType === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() - 1)
    }
    setCurrentDate(newDate)
  }

  const goToNext = () => {
    const newDate = new Date(currentDate)
    if (viewType === "month") {
      newDate.setMonth(newDate.getMonth() + 1)
    } else if (viewType === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    const today = new Date()
    if (today.getFullYear() === 2026) {
      setCurrentDate(today)
    } else {
      setCurrentDate(new Date(2026, 0, 1))
    }
  }

  const getDateRangeText = () => {
    if (viewType === "month") {
      return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    } else if (viewType === "week") {
      const weekStart = new Date(currentDate)
      weekStart.setDate(currentDate.getDate() - currentDate.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      return `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    } else {
      return currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <CalendarIcon className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl">2026 Calendar</CardTitle>
                <p className="text-sm text-muted-foreground">{getDateRangeText()}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={goToNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewType === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("month")}
              >
                Month
              </Button>
              <Button
                variant={viewType === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("week")}
              >
                Week
              </Button>
              <Button variant={viewType === "day" ? "default" : "outline"} size="sm" onClick={() => setViewType("day")}>
                Day
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Content */}
      <Card>
        <CardContent className="p-6">
          {viewType === "month" && <MonthView date={currentDate} metrics={metrics} milestones={milestones} />}
          {viewType === "week" && <WeekView date={currentDate} metrics={metrics} milestones={milestones} />}
          {viewType === "day" && <DayView date={currentDate} metrics={metrics} milestones={milestones} />}
        </CardContent>
      </Card>
    </div>
  )
}
