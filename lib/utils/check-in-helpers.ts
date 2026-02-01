export function isTuesday(timezone = "America/New_York"): boolean {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "long",
  })
  const dayName = formatter.format(now)
  return dayName === "Tuesday"
}

export function getWeekStartDate(date = new Date()): string {
  // Get the Tuesday of the current week
  const day = date.getDay()
  const diff = day === 0 ? -5 : 2 - day // Tuesday is day 2
  const tuesday = new Date(date)
  tuesday.setDate(date.getDate() + diff)
  return tuesday.toISOString().split("T")[0]
}

export function calculatePace(
  currentValue: number,
  targetValue: number,
  startDate: string,
  targetDate: string,
): { status: "ahead" | "on-track" | "behind"; percentage: number } {
  const now = Date.now()
  const start = new Date(startDate).getTime()
  const end = new Date(targetDate).getTime()

  const totalTime = end - start
  const elapsedTime = now - start
  const expectedProgress = (elapsedTime / totalTime) * 100
  const actualProgress = (currentValue / targetValue) * 100

  const difference = actualProgress - expectedProgress

  if (difference > 10) return { status: "ahead", percentage: actualProgress }
  if (difference < -10) return { status: "behind", percentage: actualProgress }
  return { status: "on-track", percentage: actualProgress }
}
