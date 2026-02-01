"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1))

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i)

  const markedDays = [5, 8, 12, 15, 19, 22, 25, 28] // Example days with activity

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const newDate = new Date(currentDate)
              newDate.setMonth(newDate.getMonth() - 1)
              setCurrentDate(newDate)
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-semibold">
            {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const newDate = new Date(currentDate)
              newDate.setMonth(newDate.getMonth() + 1)
              setCurrentDate(newDate)
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div key={i} className="text-center text-xs font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
          {emptyDays.map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map((day) => {
            const isMarked = markedDays.includes(day)
            const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth()
            return (
              <button
                key={day}
                className={`
                  aspect-square p-2 text-sm rounded-lg transition-colors
                  hover:bg-accent hover:text-accent-foreground
                  ${isToday ? "bg-primary text-primary-foreground font-bold" : ""}
                  ${isMarked && !isToday ? "bg-accent/50 font-medium" : ""}
                `}
              >
                {day}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-accent/50" />
            <span>Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span>Today</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
