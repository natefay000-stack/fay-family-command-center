"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Target, TrendingUp } from "lucide-react"

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

interface DayViewProps {
  date: Date
  metrics: Metric[]
  milestones: Milestone[]
}

export function DayView({ date, metrics, milestones }: DayViewProps) {
  const dateStr = date.toISOString().split("T")[0]
  const dayMetrics = metrics.filter((m) => m.date.startsWith(dateStr))
  const dayMilestones = milestones.filter((m) => m.due_date.startsWith(dateStr))
  const isTuesday = date.getDay() === 2

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">
          {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </h2>
        {isTuesday && (
          <Badge className="mt-2" variant="default">
            Check-in Day
          </Badge>
        )}
      </div>

      {/* Metrics */}
      {dayMetrics.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Metrics Logged
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dayMetrics.map((metric) => (
              <div key={metric.id} className="border-b last:border-0 pb-4 last:pb-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{metric.metric_name}</h3>
                    <p className="text-2xl font-bold mt-1">
                      {metric.metric_value} {metric.unit}
                    </p>
                    {metric.notes && <p className="text-sm text-muted-foreground mt-2">{metric.notes}</p>}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No metrics logged for this day</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Milestones */}
      {dayMilestones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Milestones Due
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dayMilestones.map((milestone) => (
              <div key={milestone.id} className="border-b last:border-0 pb-3 last:pb-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{milestone.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Goal: {milestone.goal.title}</p>
                  </div>
                  <Badge variant={milestone.completed ? "default" : "secondary"}>
                    {milestone.completed ? "Completed" : "Pending"}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty state for completely empty day */}
      {dayMetrics.length === 0 && dayMilestones.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Nothing scheduled for this day</h3>
              <p className="text-sm">No metrics or milestones recorded</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
