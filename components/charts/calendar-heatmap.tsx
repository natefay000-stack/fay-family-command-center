"use client"

interface CalendarHeatmapProps {
  data: { date: string; value: boolean }[]
  year?: number
}

export function CalendarHeatmap({ data, year = 2026 }: CalendarHeatmapProps) {
  const startDate = new Date(year, 0, 1)
  const endDate = new Date(year, 11, 31)

  // Generate all days of the year
  const allDays: { date: Date; value: boolean }[] = []
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0]
    const dataPoint = data.find((dp) => dp.date.startsWith(dateStr))
    allDays.push({
      date: new Date(d),
      value: dataPoint?.value || false,
    })
  }

  // Group by weeks
  const weeks: (typeof allDays)[] = []
  let currentWeek: typeof allDays = []

  // Pad the first week to start on Sunday
  const firstDay = allDays[0].date.getDay()
  for (let i = 0; i < firstDay; i++) {
    currentWeek.push({ date: new Date(0), value: false })
  }

  allDays.forEach((day) => {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: new Date(0), value: false })
    }
    weeks.push(currentWeek)
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        <div className="w-8" />
        <div className="flex-1 flex justify-between text-xs text-muted-foreground">
          {months.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </div>
      <div className="flex gap-1">
        <div className="w-8 flex flex-col justify-around text-xs text-muted-foreground">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>
        <div className="flex-1 grid gap-1" style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}>
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-rows-7 gap-1">
              {week.map((day, dayIdx) => {
                const isEmpty = day.date.getTime() === 0
                return (
                  <div
                    key={dayIdx}
                    className={`aspect-square rounded-sm ${
                      isEmpty
                        ? "bg-transparent"
                        : day.value
                          ? "bg-primary hover:opacity-80"
                          : "bg-muted hover:bg-muted/70"
                    } transition-colors cursor-pointer`}
                    title={isEmpty ? "" : `${day.date.toLocaleDateString()}: ${day.value ? "Done" : "Not done"}`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
