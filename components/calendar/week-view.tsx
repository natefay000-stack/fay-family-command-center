"use client"

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

interface WeekViewProps {
  date: Date
  metrics: Metric[]
  milestones: Milestone[]
}

export function WeekView({ date, metrics, milestones }: WeekViewProps) {
  const weekStart = new Date(date)
  weekStart.setDate(date.getDate() - date.getDay())

  const weekDays = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart)
    day.setDate(weekStart.getDate() + i)
    weekDays.push(day)
  }

  const getMetricsForDay = (dayDate: Date) => {
    const dateStr = dayDate.toISOString().split("T")[0]
    return metrics.filter((m) => m.date.startsWith(dateStr))
  }

  const getMilestonesForDay = (dayDate: Date) => {
    const dateStr = dayDate.toISOString().split("T")[0]
    return milestones.filter((m) => m.due_date.startsWith(dateStr))
  }

  const isTuesday = (dayDate: Date) => dayDate.getDay() === 2

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day) => {
          const dayMetrics = getMetricsForDay(day)
          const dayMilestones = getMilestonesForDay(day)
          const isTues = isTuesday(day)

          return (
            <div
              key={day.toISOString()}
              className={`border rounded-lg p-4 ${isTues ? "bg-blue-50 dark:bg-blue-950/20" : ""}`}
            >
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {day.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div className="text-2xl font-bold">{day.getDate()}</div>
                </div>

                {dayMetrics.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Metrics</div>
                    {dayMetrics.map((metric) => (
                      <div key={metric.id} className="text-xs">
                        <div className="font-medium">{metric.metric_name}</div>
                        <div className="text-muted-foreground">
                          {metric.metric_value} {metric.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {dayMilestones.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-orange-600 dark:text-orange-400">Milestones</div>
                    {dayMilestones.map((milestone) => (
                      <div key={milestone.id} className="text-xs">
                        <div className="font-medium line-clamp-2">{milestone.title}</div>
                      </div>
                    ))}
                  </div>
                )}

                {isTues && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-100 dark:bg-blue-900/20 rounded px-2 py-1">
                    Check-in Day
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
