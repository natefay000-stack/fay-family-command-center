"use client"

interface Metric {
  id: string
  metric_name: string
  metric_value: number
  unit: string
  date: string
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

interface MonthViewProps {
  date: Date
  metrics: Metric[]
  milestones: Milestone[]
}

export function MonthView({ date, metrics, milestones }: MonthViewProps) {
  const year = date.getFullYear()
  const month = date.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const days = []
  const today = new Date()

  // Pad empty cells
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }

  // Fill in days
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day))
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

  const isToday = (dayDate: Date) =>
    dayDate.getDate() === today.getDate() &&
    dayDate.getMonth() === today.getMonth() &&
    dayDate.getFullYear() === today.getFullYear()

  return (
    <div className="w-full">
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} className="aspect-square" />
          }

          const dayMetrics = getMetricsForDay(day)
          const dayMilestones = getMilestonesForDay(day)
          const isTues = isTuesday(day)
          const isCurrentDay = isToday(day)

          return (
            <div
              key={idx}
              className={`aspect-square border rounded-lg p-2 hover:bg-accent transition-colors cursor-pointer ${
                isCurrentDay ? "border-primary border-2" : ""
              } ${isTues ? "bg-blue-50 dark:bg-blue-950/20" : ""}`}
            >
              <div className="flex flex-col h-full">
                <div className="text-sm font-medium mb-1">{day.getDate()}</div>
                <div className="flex-1 space-y-1">
                  {dayMetrics.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {dayMetrics.slice(0, 3).map((metric) => (
                        <div
                          key={metric.id}
                          className="w-2 h-2 rounded-full bg-primary"
                          title={`${metric.metric_name}: ${metric.metric_value} ${metric.unit}`}
                        />
                      ))}
                      {dayMetrics.length > 3 && (
                        <div className="text-xs text-muted-foreground">+{dayMetrics.length - 3}</div>
                      )}
                    </div>
                  )}
                  {dayMilestones.length > 0 && (
                    <div className="text-xs text-orange-600 dark:text-orange-400">
                      {dayMilestones.length} milestone{dayMilestones.length > 1 ? "s" : ""}
                    </div>
                  )}
                  {isTues && <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Check-in</div>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
