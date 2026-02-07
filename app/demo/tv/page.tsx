"use client"

import { useState, useEffect, useCallback } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface WeatherData {
  location: string
  current: { temp: number; condition: string; icon: string; high: number; low: number }
  hourly: Array<{ time: string; temp: number; icon: string }>
}

interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  location?: string
  calendar: string
  color: string
}

interface Goal {
  id: string
  title: string
  current_value: number
  target_value: number
  unit?: string
  is_completed: boolean
  is_starred: boolean
}

interface GroceryItem {
  id: string
  name: string
  is_checked: boolean
}

// ═══════════════════════════════════════════════════════════════════════════════
// COLORS
// ═══════════════════════════════════════════════════════════════════════════════

const COLORS = {
  bg: "#0a0a0a",
  card: "#111111",
  cardBorder: "#222222",
  text: "#ffffff",
  textMuted: "#888888",
  textDim: "#555555",
  nate: "#3b82f6",
  dalton: "#ef4444",
  mason: "#f97316",
  family: "#22c55e",
  green: "#22c55e",
  yellow: "#eab308",
  red: "#ef4444",
}

const USER_COLORS: Record<string, string> = {
  nate: COLORS.nate,
  dalton: COLORS.dalton,
  mason: COLORS.mason,
  family: COLORS.family,
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA (will be replaced with real API calls)
// ═══════════════════════════════════════════════════════════════════════════════

const MOCK_GOALS: Record<string, Goal[]> = {
  nate: [
    { id: "n1", title: "Lose 7 lbs", current_value: 2, target_value: 7, unit: "lbs", is_completed: false, is_starred: false },
    { id: "n2", title: "Golf Simulator", current_value: 2, target_value: 4, unit: "milestones", is_completed: false, is_starred: false },
    { id: "n3", title: "Side Project", current_value: 5, target_value: 8, unit: "milestones", is_completed: false, is_starred: false },
  ],
  dalton: [
    { id: "d1", title: "Hit 93 MPH", current_value: 88, target_value: 93, unit: "mph", is_completed: false, is_starred: true },
    { id: "d2", title: "Straight A's", current_value: 93, target_value: 100, unit: "%", is_completed: false, is_starred: false },
    { id: "d3", title: "Make Varsity", current_value: 0, target_value: 1, is_completed: false, is_starred: true },
  ],
  mason: [
    { id: "m1", title: "Mid-70s Velo", current_value: 72, target_value: 77, unit: "mph", is_completed: false, is_starred: true },
    { id: "m2", title: "Sub 5:40 Mile", current_value: 342, target_value: 340, unit: "sec", is_completed: false, is_starred: false },
    { id: "m3", title: "Read 12 Books", current_value: 4, target_value: 12, unit: "books", is_completed: false, is_starred: false },
  ],
}

const COUNTDOWNS = [
  { name: "Presidents Day Tournament", date: "2026-02-14", emoji: "🏈", location: "stgeorge" },
  { name: "MLB Opening Day", date: "2026-03-26", emoji: "⚾" },
  { name: "Summer Break", date: "2026-05-29", emoji: "🌴" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

function formatDuration(start: string, end: string): string {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diffMs = endDate.getTime() - startDate.getTime()
  const diffHrs = Math.round(diffMs / (1000 * 60 * 60) * 10) / 10
  if (diffHrs < 1) return `${Math.round(diffMs / (1000 * 60))}m`
  return `${diffHrs}h`
}

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr)
  const now = new Date()
  target.setHours(0, 0, 0, 0)
  now.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function getCalendarColor(calendar: string): string {
  const cal = calendar.toLowerCase()
  if (cal.includes('nate')) return COLORS.nate
  if (cal.includes('dalton')) return COLORS.dalton
  if (cal.includes('mason')) return COLORS.mason
  return COLORS.family
}

function getUserFromCalendar(calendar: string): string {
  const cal = calendar.toLowerCase()
  if (cal.includes('nate')) return 'N'
  if (cal.includes('dalton')) return 'D'
  if (cal.includes('mason')) return 'M'
  return 'F'
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function Card({ children, className = "", accent }: { children: React.ReactNode; className?: string; accent?: string }) {
  return (
    <div
      className={`rounded-2xl p-4 ${className}`}
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.cardBorder}`,
        borderLeft: accent ? `4px solid ${accent}` : undefined,
      }}
    >
      {children}
    </div>
  )
}

function Avatar({ initial, color, size = 40 }: { initial: string; color: string; size?: number }) {
  return (
    <div
      className="rounded-lg flex items-center justify-center font-bold text-white"
      style={{ width: size, height: size, background: color, fontSize: size * 0.45 }}
    >
      {initial}
    </div>
  )
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="h-2 rounded-full overflow-hidden" style={{ background: COLORS.cardBorder }}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEFT COLUMN COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function WeatherCard({ weather, altWeather }: { weather: WeatherData | null; altWeather?: WeatherData | null }) {
  const [showAlt, setShowAlt] = useState(false)

  useEffect(() => {
    if (!altWeather) return
    const interval = setInterval(() => setShowAlt(s => !s), 10000)
    return () => clearInterval(interval)
  }, [altWeather])

  const data = showAlt && altWeather ? altWeather : weather
  if (!data) return <Card className="animate-pulse h-40" />

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-widest" style={{ color: COLORS.textMuted }}>
          {data.location}
        </span>
        {altWeather && (
          <div className="flex gap-1">
            <div className={`w-2 h-2 rounded-full ${!showAlt ? 'bg-white' : 'bg-gray-600'}`} />
            <div className={`w-2 h-2 rounded-full ${showAlt ? 'bg-white' : 'bg-gray-600'}`} />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-5xl font-light">{data.current.temp}°</div>
          <div className="text-sm mt-1" style={{ color: COLORS.textMuted }}>{data.current.condition}</div>
          <div className="text-xs mt-1" style={{ color: COLORS.textDim }}>
            H:{data.current.high}° L:{data.current.low}°
          </div>
        </div>
        <span className="text-6xl">{data.current.icon}</span>
      </div>
      {data.hourly.length > 0 && (
        <div className="flex justify-between mt-4 pt-3 border-t" style={{ borderColor: COLORS.cardBorder }}>
          {data.hourly.slice(0, 4).map((h, i) => (
            <div key={i} className="text-center">
              <div className="text-xs" style={{ color: COLORS.textDim }}>{h.time}</div>
              <div className="text-xl my-1">{h.icon}</div>
              <div className="text-sm font-medium">{h.temp}°</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

function CountdownsCard({ countdowns }: { countdowns: typeof COUNTDOWNS }) {
  return (
    <Card className="flex-1">
      <div className="text-xs uppercase tracking-widest mb-4" style={{ color: COLORS.textMuted }}>
        Countdowns
      </div>
      <div className="space-y-4">
        {countdowns.map((c, i) => {
          const days = getDaysUntil(c.date)
          const isNearest = i === 0
          return (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{c.emoji}</span>
                <div>
                  <div className={`font-medium ${isNearest ? 'text-white' : ''}`} style={{ color: isNearest ? undefined : COLORS.textMuted }}>
                    {c.name}
                  </div>
                  <div className="text-xs" style={{ color: COLORS.textDim }}>
                    {new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${isNearest ? '' : ''}`} style={{ color: isNearest ? COLORS.green : COLORS.textMuted }}>
                  {days}
                </div>
                <div className="text-xs uppercase" style={{ color: COLORS.textDim }}>days</div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function GroceryCard({ items }: { items: GroceryItem[] }) {
  const unchecked = items.filter(i => !i.is_checked)
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-widest" style={{ color: COLORS.textMuted }}>
          Grocery List
        </span>
        <span className="text-xs px-2 py-1 rounded-full" style={{ background: COLORS.cardBorder }}>
          {unchecked.length}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {unchecked.slice(0, 8).map(item => (
          <div key={item.id} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded border" style={{ borderColor: COLORS.textDim }} />
            <span style={{ color: COLORS.textMuted }}>{item.name}</span>
          </div>
        ))}
      </div>
      {unchecked.length > 8 && (
        <div className="text-xs mt-2" style={{ color: COLORS.textDim }}>+{unchecked.length - 8} more</div>
      )}
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CENTER COLUMN COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function TodaySection({ events, date }: { events: CalendarEvent[]; date: Date }) {
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
  const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

  return (
    <Card className="border-l-4" style={{ borderLeftColor: COLORS.green }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs uppercase tracking-widest" style={{ color: COLORS.green }}>Today</div>
          <div className="text-xl font-semibold">{dayName}, {monthDay}</div>
        </div>
        <div className="text-xs px-3 py-1 rounded-full" style={{ background: COLORS.green, color: 'black' }}>
          {events.length} events
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8" style={{ color: COLORS.textDim }}>No events today</div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {events.slice(0, 4).map(event => {
            const color = getCalendarColor(event.calendar)
            const initial = getUserFromCalendar(event.calendar)
            return (
              <div
                key={event.id}
                className="rounded-xl p-3"
                style={{ background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}` }}
              >
                <div className="flex items-start gap-3">
                  <Avatar initial={initial} color={color} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xl font-bold" style={{ color }}>{formatTime(event.start)}</div>
                    <div className="font-medium truncate">{event.title}</div>
                    {event.location && (
                      <div className="text-xs flex items-center gap-1 mt-1" style={{ color: COLORS.textDim }}>
                        📍 {event.location}
                      </div>
                    )}
                    <div className="text-xs mt-1" style={{ color: COLORS.textDim }}>
                      {formatDuration(event.start, event.end)}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

function WeekSection({ events, startDate }: { events: CalendarEvent[]; startDate: Date }) {
  const days: Date[] = []
  for (let i = 0; i < 6; i++) {
    const d = new Date(startDate)
    d.setDate(startDate.getDate() + i + 1) // Start from tomorrow
    days.push(d)
  }

  const getEventsForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(e => e.start.startsWith(dateStr))
  }

  return (
    <Card>
      <div className="text-xs uppercase tracking-widest mb-4" style={{ color: COLORS.textMuted }}>
        This Week
      </div>
      <div className="grid grid-cols-6 gap-2">
        {days.map((day, i) => {
          const dayEvents = getEventsForDay(day)
          const isWeekend = day.getDay() === 0 || day.getDay() === 6
          return (
            <div key={i}>
              <div className="text-center mb-2">
                <div className="text-xs" style={{ color: isWeekend ? COLORS.textDim : COLORS.textMuted }}>
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-lg font-medium">{day.getDate()}</div>
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 4).map(event => (
                  <div
                    key={event.id}
                    className="text-xs p-1.5 rounded truncate"
                    style={{
                      background: `${getCalendarColor(event.calendar)}22`,
                      borderLeft: `2px solid ${getCalendarColor(event.calendar)}`,
                      color: COLORS.textMuted,
                    }}
                  >
                    <div className="font-medium truncate" style={{ color: getCalendarColor(event.calendar) }}>
                      {formatTime(event.start).replace(':00', '')}
                    </div>
                    <div className="truncate">{event.title}</div>
                  </div>
                ))}
                {dayEvents.length > 4 && (
                  <div className="text-xs text-center" style={{ color: COLORS.textDim }}>
                    +{dayEvents.length - 4}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function MonthSection({ events, currentDate }: { events: CalendarEvent[]; currentDate: Date }) {
  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPadding = firstDay.getDay()

  const days: (Date | null)[] = []
  for (let i = 0; i < startPadding; i++) days.push(null)
  for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i))

  const weeks: (Date | null)[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  const getEventsForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(e => e.start.startsWith(dateStr))
  }

  const isToday = (date: Date) => date.toDateString() === today.toDateString()

  return (
    <Card className="flex-1">
      <div className="text-xs uppercase tracking-widest mb-3" style={{ color: COLORS.textMuted }}>
        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-xs text-center py-1" style={{ color: COLORS.textDim }}>{d}</div>
        ))}
      </div>

      <div className="space-y-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((date, di) => {
              if (!date) return <div key={di} />
              const dayEvents = getEventsForDay(date)
              const todayStyle = isToday(date)

              return (
                <div
                  key={di}
                  className="rounded-lg p-1 min-h-[60px]"
                  style={{
                    background: todayStyle ? `${COLORS.green}22` : 'transparent',
                    border: todayStyle ? `2px solid ${COLORS.green}` : `1px solid ${COLORS.cardBorder}`,
                  }}
                >
                  <div
                    className={`text-sm font-medium ${todayStyle ? '' : ''}`}
                    style={{ color: todayStyle ? COLORS.green : COLORS.textMuted }}
                  >
                    {date.getDate()}
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className="text-[10px] truncate px-1 rounded"
                        style={{ background: getCalendarColor(event.calendar), color: 'white' }}
                      >
                        {event.title.length > 12 ? event.title.slice(0, 10) + '..' : event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[10px] text-center" style={{ color: COLORS.textDim }}>
                        +{dayEvents.length - 2}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// RIGHT COLUMN COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function GoalsHeader({ goals }: { goals: Record<string, Goal[]> }) {
  const total = Object.values(goals).flat().length
  const completed = Object.values(goals).flat().filter(g => g.is_completed).length

  return (
    <Card style={{ background: `linear-gradient(135deg, ${COLORS.card} 0%, ${COLORS.green}11 100%)` }}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">🏆</span>
        <span className="text-xs uppercase tracking-widest" style={{ color: COLORS.textMuted }}>
          2026 Family Goals
        </span>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold" style={{ color: COLORS.green }}>
          {completed}/{total}
        </span>
        <span className="text-sm" style={{ color: COLORS.green }}>+2 this week</span>
      </div>
    </Card>
  )
}

function PersonGoalCard({ name, goals, color }: { name: string; goals: Goal[]; color: string }) {
  const total = goals.length
  const avgProgress = goals.reduce((sum, g) => {
    const pct = g.target_value ? (g.current_value / g.target_value) * 100 : (g.is_completed ? 100 : 0)
    return sum + Math.min(100, pct)
  }, 0) / total

  return (
    <Card accent={color} className="flex-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar initial={name[0]} color={color} />
          <span className="font-semibold text-lg">{name}</span>
        </div>
        <span className="text-2xl font-bold" style={{ color }}>{Math.round(avgProgress)}%</span>
      </div>

      <div className="space-y-3">
        {goals.slice(0, 3).map(goal => {
          const pct = goal.target_value
            ? Math.min(100, Math.round((goal.current_value / goal.target_value) * 100))
            : (goal.is_completed ? 100 : 0)
          const progressColor = pct >= 80 ? COLORS.green : pct >= 40 ? COLORS.yellow : color

          return (
            <div key={goal.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {goal.is_starred && <span style={{ color: COLORS.yellow }}>★</span>}
                  <span className="text-sm" style={{ color: COLORS.textMuted }}>{goal.title}</span>
                </div>
                <span className="text-xs font-medium" style={{ color: progressColor }}>{pct}%</span>
              </div>
              <ProgressBar value={goal.current_value} max={goal.target_value || 1} color={progressColor} />
              {goal.target_value && (
                <div className="text-xs mt-1" style={{ color: COLORS.textDim }}>
                  {goal.current_value}/{goal.target_value} {goal.unit}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function TVPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [altWeather, setAltWeather] = useState<WeatherData | null>(null)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())

  // Fetch weather
  const fetchWeather = useCallback(async () => {
    try {
      const res = await fetch('/api/weather')
      if (res.ok) setWeather(await res.json())

      // Check for tournament in next 7 days - fetch that location's weather too
      const upcomingTournament = COUNTDOWNS.find(c => {
        const days = getDaysUntil(c.date)
        return days <= 7 && days >= 0 && c.location
      })

      if (upcomingTournament?.location) {
        const altRes = await fetch(`/api/weather?location=${upcomingTournament.location}`)
        if (altRes.ok) setAltWeather(await altRes.json())
      }
    } catch (e) {
      console.error('Weather fetch error:', e)
    }
  }, [])

  // Fetch calendar events
  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch('/api/google-calendar')
      if (res.ok) {
        const data = await res.json()
        setEvents(data.events || [])
      }
    } catch (e) {
      console.error('Calendar fetch error:', e)
    }
  }, [])

  // Fetch grocery items
  const fetchGrocery = useCallback(async () => {
    try {
      const res = await fetch('/api/grocery')
      if (res.ok) {
        const data = await res.json()
        setGroceryItems(data || [])
      }
    } catch (e) {
      console.error('Grocery fetch error:', e)
    }
  }, [])

  // Initial fetch and intervals
  useEffect(() => {
    fetchWeather()
    fetchEvents()
    fetchGrocery()

    const weatherInterval = setInterval(fetchWeather, 30 * 60 * 1000) // 30 min
    const eventsInterval = setInterval(fetchEvents, 5 * 60 * 1000) // 5 min
    const groceryInterval = setInterval(fetchGrocery, 5 * 60 * 1000) // 5 min
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 60 * 1000) // 1 min

    return () => {
      clearInterval(weatherInterval)
      clearInterval(eventsInterval)
      clearInterval(groceryInterval)
      clearInterval(timeInterval)
    }
  }, [fetchWeather, fetchEvents, fetchGrocery])

  // Filter events for today
  const todayStr = currentTime.toISOString().split('T')[0]
  const todayEvents = events.filter(e => e.start.startsWith(todayStr))

  return (
    <div className="h-screen overflow-hidden flex flex-col" style={{ background: COLORS.bg, color: COLORS.text }}>

      {/* ═══════════ TOP TICKER ═══════════ */}
      <div
        className="h-10 flex items-center justify-between px-6 border-b"
        style={{ background: '#050505', borderColor: COLORS.cardBorder }}
      >
        <div className="flex items-center gap-6 text-sm">
          <span style={{ color: COLORS.textMuted }}>
            {weather?.current.icon} {weather?.current.temp}°F {weather?.location}
          </span>
          <span style={{ color: COLORS.textDim }}>|</span>
          <span style={{ color: COLORS.textMuted }}>⚾ Spring Training: {getDaysUntil('2026-02-20')} days</span>
        </div>
        <div className="text-sm font-medium">
          {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          <span className="ml-4" style={{ color: COLORS.textMuted }}>
            {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <div className="flex-1 p-4 grid grid-cols-[20%_50%_30%] gap-4 min-h-0">

        {/* ═══════════ LEFT COLUMN ═══════════ */}
        <div className="flex flex-col gap-4 min-h-0">
          <WeatherCard weather={weather} altWeather={altWeather} />
          <CountdownsCard countdowns={COUNTDOWNS} />
          <GroceryCard items={groceryItems} />
        </div>

        {/* ═══════════ CENTER COLUMN ═══════════ */}
        <div className="flex flex-col gap-4 min-h-0">
          <TodaySection events={todayEvents} date={currentTime} />
          <WeekSection events={events} startDate={currentTime} />
          <MonthSection events={events} currentDate={currentTime} />
        </div>

        {/* ═══════════ RIGHT COLUMN ═══════════ */}
        <div className="flex flex-col gap-4 min-h-0">
          <GoalsHeader goals={MOCK_GOALS} />
          <PersonGoalCard name="Nate" goals={MOCK_GOALS.nate} color={COLORS.nate} />
          <PersonGoalCard name="Dalton" goals={MOCK_GOALS.dalton} color={COLORS.dalton} />
          <PersonGoalCard name="Mason" goals={MOCK_GOALS.mason} color={COLORS.mason} />
        </div>
      </div>
    </div>
  )
}
