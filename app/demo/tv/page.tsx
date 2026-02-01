"use client"

import { useState, useEffect, useCallback } from "react"
import { useTVData } from "@/hooks/use-data"

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM - Investment Command Center Style (POLISHED)
// ═══════════════════════════════════════════════════════════════════════════════

const COLORS = {
  bgPage: "#0B1120",
  bgCard: "#1E293B",
  bgCardHover: "#334155",
  bgInput: "#0F172A",
  borderSubtle: "rgba(255, 255, 255, 0.08)",
  borderCard: "rgba(255, 255, 255, 0.12)",
  textPrimary: "#F8FAFC",
  textSecondary: "#E2E8F0",
  textMuted: "#94A3B8",
  textDim: "#64748B",
  green: "#22C55E",
  greenDim: "rgba(34, 197, 94, 0.15)",
  greenGlow: "rgba(34, 197, 94, 0.3)",
  red: "#EF4444",
  redDim: "rgba(239, 68, 68, 0.15)",
  blue: "#3B82F6",
  blueGlow: "rgba(59, 130, 246, 0.3)",
  orange: "#F97316",
  cyan: "#06B6D4",
  yellow: "#EAB308",
  purple: "#A855F7",
  gold: "#F59E0B",
}

// Icon badge gradients
const BADGE_GRADIENTS = {
  weather: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
  countdown: "linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)",
  grocery: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
  calendar: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
  goals: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
  dodgers: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
  upcoming: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const COUNTDOWNS = [
  { name: "Presidents Day Tournament", date: "2026-02-13", emoji: "🏈", color: COLORS.blue },
  { name: "MLB Opening Day", date: "2026-03-26", emoji: "⚾", color: COLORS.red },
  { name: "Summer Break", date: "2026-05-29", emoji: "🌴", color: COLORS.orange },
]

const MOCK_EVENTS = [
  { id: "m1", title: "Meeting 10AM", startDate: "2026-01-30", endDate: "2026-01-30", color: COLORS.cyan, user: "Nate" },
  { id: "m2", title: "Mason 8AM", startDate: "2026-01-31", endDate: "2026-01-31", color: COLORS.orange, user: "Mason" },
  { id: "m3", title: "Dalton 4PM", startDate: "2026-01-31", endDate: "2026-01-31", color: COLORS.red, user: "Dalton" },
  { id: "m4", title: "🏈 TOURNAMENT", startDate: "2026-02-13", endDate: "2026-02-16", color: COLORS.blue, user: "Family" },
]

interface WeatherData {
  location: string
  current: { temp: number; condition: string; icon: string; humidity: number; wind_speed: number }
  hourly: Array<{ time: string; temp: number; icon: string }>
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function Card({ children, className = "", glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) {
  return (
    <div
      className={`rounded-xl p-4 transition-all ${className}`}
      style={{
        background: COLORS.bgCard,
        border: `1px solid ${COLORS.borderCard}`,
        boxShadow: glow ? `0 0 30px ${COLORS.greenGlow}` : 'none',
      }}
    >
      {children}
    </div>
  )
}

function IconBadge({ gradient, emoji, size = 40 }: { gradient: string; emoji: string; size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-xl"
      style={{
        width: size,
        height: size,
        background: gradient,
        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.3)`,
      }}
    >
      <span style={{ fontSize: size * 0.5 }}>{emoji}</span>
    </div>
  )
}

function CardHeader({ badge, title, subtitle, right }: { badge: { gradient: string; emoji: string }; title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <IconBadge gradient={badge.gradient} emoji={badge.emoji} />
        <div>
          <div className="text-lg font-bold tracking-wide" style={{ color: COLORS.textPrimary }}>{title}</div>
          {subtitle && <div className="text-xs font-medium" style={{ color: COLORS.textMuted }}>{subtitle}</div>}
        </div>
      </div>
      {right}
    </div>
  )
}

function GoalCard({ user, goals, color, initial }: {
  user: { name: string; id: string }
  goals: Array<{ id: string; title: string; current_value: number; target_value: number; is_completed: boolean; is_starred: boolean; deadline?: string; unit?: string }>
  color: string
  initial: string
}) {
  const completedCount = goals.filter(g => g.is_completed).length
  const pct = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0

  return (
    <Card className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: COLORS.borderSubtle }}>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
            style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)` }}
          >
            {initial}
          </div>
          <div>
            <div className="text-lg font-bold" style={{ color: COLORS.textPrimary }}>{user.name}</div>
            <div className="text-sm font-medium" style={{ color: COLORS.textMuted }}>{completedCount}/{goals.length} complete</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-extrabold tracking-tight" style={{ color }}>{pct}%</div>
          <div className="text-xs font-semibold" style={{ color: COLORS.green }}>+{Math.min(completedCount, 2)} this week</div>
        </div>
      </div>

      {/* Goals list */}
      <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
        {goals.length === 0 ? (
          <div className="text-base text-center py-6" style={{ color: COLORS.textDim }}>No goals yet</div>
        ) : (
          goals.map(goal => {
            const progress = goal.target_value ? Math.min(100, Math.round((goal.current_value / goal.target_value) * 100)) : (goal.is_completed ? 100 : 0)
            const progressColor = goal.is_completed ? COLORS.green : progress >= 60 ? COLORS.green : progress >= 30 ? COLORS.yellow : COLORS.red

            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 mt-0.5"
                    style={{ background: goal.is_completed ? COLORS.green : 'transparent', borderColor: goal.is_completed ? COLORS.green : COLORS.textDim }}
                  >
                    {goal.is_completed && <span className="text-xs font-bold text-white">✓</span>}
                  </div>
                  {goal.is_starred && <span className="text-lg" style={{ color: COLORS.gold }}>★</span>}
                  <span
                    className={`text-base font-semibold flex-1 ${goal.is_completed ? 'line-through' : ''}`}
                    style={{ color: goal.is_completed ? COLORS.textDim : COLORS.textSecondary }}
                  >
                    {goal.title}
                  </span>
                  <span className="text-base font-bold" style={{ color: progressColor }}>{progress}%</span>
                </div>
                <div className="flex items-center gap-3 pl-8">
                  <div
                    className="flex-1 h-2 rounded-full overflow-hidden"
                    style={{ background: COLORS.bgInput }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${progress}%`,
                        background: progressColor,
                        boxShadow: progress >= 60 ? `0 0 10px ${progressColor}` : 'none'
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pl-8 text-sm" style={{ color: COLORS.textDim }}>
                  {goal.target_value && (
                    <span>{goal.current_value}/{goal.target_value} {goal.unit || ''}</span>
                  )}
                  {goal.deadline && (
                    <>
                      <span>•</span>
                      <span>Due {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function TVPage() {
  const [tickerPosition, setTickerPosition] = useState(0)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [baseUrl, setBaseUrl] = useState("")
  const [calendarEvents] = useState(MOCK_EVENTS)

  useEffect(() => { setBaseUrl(window.location.origin) }, [])

  const { goalsByUser, groceryItems, toggleGroceryItem, events } = useTVData()

  const fetchWeather = useCallback(async () => {
    try {
      const r = await fetch("/api/weather")
      if (r.ok) setWeather(await r.json())
    } catch {}
  }, [])

  useEffect(() => { const t = setInterval(() => setCurrentTime(new Date()), 60000); return () => clearInterval(t) }, [])
  useEffect(() => { fetchWeather(); const i = setInterval(fetchWeather, 1800000); return () => clearInterval(i) }, [fetchWeather])
  useEffect(() => { const i = setInterval(() => setTickerPosition(p => p <= -2000 ? 0 : p - 0.5), 20); return () => clearInterval(i) }, [])

  // Calendar calculations
  const today = currentTime
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())

  const calendarWeeks: Date[][] = []
  for (let week = 0; week < 5; week++) {
    const weekDays: Date[] = []
    for (let day = 0; day < 7; day++) {
      const d = new Date(startOfWeek)
      d.setDate(startOfWeek.getDate() + (week * 7) + day)
      weekDays.push(d)
    }
    calendarWeeks.push(weekDays)
  }

  const toDateStr = (d: Date) => d.toISOString().split('T')[0]
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  const getEventsForDate = (date: Date) => {
    const dateStr = toDateStr(date)
    const dayOfWeek = date.getDay()
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5
    const result: Array<{ title: string; color: string }> = []

    if (isWeekday) result.push({ title: "Work", color: "#475569" })

    calendarEvents.filter(e => dateStr >= e.startDate && dateStr <= e.endDate).forEach(e => {
      result.push({ title: e.title, color: e.color })
    })

    events.filter(e => new Date(e.start_time).toDateString() === date.toDateString()).forEach(e => {
      result.push({ title: e.title, color: e.color || "#6B7280" })
    })

    return result.slice(0, 3)
  }

  const middleDate = calendarWeeks[2][3]

  // Calculate totals
  const totalGoals = goalsByUser.reduce((sum, { goals }) => sum + goals.length, 0)
  const totalCompleted = goalsByUser.reduce((sum, { goals }) => sum + goals.filter(g => g.is_completed).length, 0)
  const overallPct = totalGoals > 0 ? Math.round((totalCompleted / totalGoals) * 100) : 0

  const userColors: Record<string, string> = { Nate: COLORS.blue, Dalton: COLORS.red, Mason: COLORS.orange }

  // Weekly progress simulation (could be real data)
  const weekProgress = [12, 15, 18, 20, 22, 25, totalCompleted > 0 ? totalCompleted : 28]

  return (
    <div className="h-screen overflow-hidden flex flex-col" style={{ background: COLORS.bgPage, color: COLORS.textPrimary }}>

      {/* ═══════════════════ TOP TICKER ═══════════════════ */}
      <div className="h-10 flex items-center overflow-hidden border-b" style={{ background: "#070B14", borderColor: COLORS.borderSubtle }}>
        <div className="flex items-center gap-8 whitespace-nowrap text-sm font-semibold px-4" style={{ transform: `translateX(${tickerPosition}px)` }}>
          <span>🏈 <span style={{ color: COLORS.textMuted }}>NFL</span> Eagles <span style={{ color: COLORS.green }}>+24</span> vs Cowboys</span>
          <span style={{ color: COLORS.borderSubtle }}>│</span>
          <span>⚾ <span style={{ color: COLORS.textMuted }}>MLB</span> Dodgers <span style={{ color: COLORS.green }}>W 5-3</span></span>
          <span style={{ color: COLORS.borderSubtle }}>│</span>
          <span>🏀 <span style={{ color: COLORS.textMuted }}>NBA</span> Jazz <span style={{ color: COLORS.red }}>-3</span> vs Lakers</span>
          <span style={{ color: COLORS.borderSubtle }}>│</span>
          <span>❄️ <span style={{ color: COLORS.textMuted }}>{weather?.current.temp || 30}°F</span> Herriman</span>
          <span style={{ color: COLORS.borderSubtle }}>│</span>
          <span>📅 {today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          <span style={{ color: COLORS.borderSubtle }}>│</span>
          <span>🏈 <span style={{ color: COLORS.textMuted }}>NFL</span> Chiefs <span style={{ color: COLORS.green }}>+7</span> vs Bills</span>
          <span style={{ color: COLORS.borderSubtle }}>│</span>
          <span>⚾ <span style={{ color: COLORS.textMuted }}>Spring Training</span> <span style={{ color: COLORS.green }}>25 days</span></span>
        </div>
      </div>

      {/* ═══════════════════ HEADER BAR ═══════════════════ */}
      <div className="px-6 py-3 border-b flex items-center justify-between" style={{ borderColor: COLORS.borderSubtle }}>
        <div className="flex items-center gap-4">
          <span className="text-3xl">🏠</span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Fay Family Command Center</h1>
            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: COLORS.textMuted }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: COLORS.green, boxShadow: `0 0 8px ${COLORS.green}` }} />
              <span>All Systems Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-base font-medium" style={{ color: COLORS.textMuted }}>
            Today: {today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
          <button className="px-4 py-2 rounded-lg text-sm font-bold" style={{ background: COLORS.blue, color: 'white' }}>+ Add Event</button>
          <button className="px-4 py-2 rounded-lg text-sm font-bold" style={{ background: COLORS.bgCardHover, color: COLORS.textSecondary }}>+ Add Goal</button>
        </div>
      </div>

      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <div
        className="mx-6 mt-4 rounded-xl p-5"
        style={{
          background: `linear-gradient(135deg, ${COLORS.greenDim} 0%, transparent 50%), ${COLORS.bgCard}`,
          border: `1px solid rgba(34, 197, 94, 0.25)`,
          boxShadow: `0 0 40px ${COLORS.greenGlow}`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div>
              <div className="text-sm font-bold tracking-widest mb-1" style={{ color: COLORS.textMuted }}>FAMILY PROGRESS</div>
              <div className="flex items-baseline gap-3">
                <span
                  className="font-extrabold tracking-tighter"
                  style={{ fontSize: '56px', lineHeight: 1, color: COLORS.green, textShadow: `0 0 30px ${COLORS.green}` }}
                >
                  {totalCompleted}/{totalGoals || 15}
                </span>
                <span className="text-xl font-bold" style={{ color: COLORS.textMuted }}>GOALS COMPLETE</span>
              </div>
            </div>
            <div className="h-16 w-px" style={{ background: COLORS.borderSubtle }} />
            <div>
              <div
                className="text-2xl font-extrabold"
                style={{ color: COLORS.green }}
              >
                +{Math.max(2, Math.min(totalCompleted, 5))}
              </div>
              <div className="text-sm font-medium" style={{ color: COLORS.textMuted }}>this week</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm font-bold tracking-widest mb-1" style={{ color: COLORS.textMuted }}>THIS WEEK</div>
              <div className="flex items-center gap-2">
                <div className="flex items-end gap-1 h-10">
                  {weekProgress.map((val, i) => (
                    <div
                      key={i}
                      className="w-3 rounded-t"
                      style={{
                        height: `${(val / 30) * 40}px`,
                        background: i === weekProgress.length - 1 ? COLORS.green : COLORS.textDim,
                        opacity: i === weekProgress.length - 1 ? 1 : 0.5,
                      }}
                    />
                  ))}
                </div>
                <span className="text-3xl font-extrabold" style={{ color: COLORS.green }}>{overallPct}%</span>
              </div>
              <div className="text-xs font-medium mt-1" style={{ color: COLORS.green }}>↗ trending up</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ MAIN CONTENT ═══════════════════ */}
      <div className="flex-1 px-6 py-4 grid grid-cols-[20%_50%_30%] gap-4 min-h-0">

        {/* ═══════════ LEFT COLUMN ═══════════ */}
        <div className="flex flex-col gap-3 min-h-0">

          {/* Weather Card */}
          <Card>
            <CardHeader badge={{ gradient: BADGE_GRADIENTS.weather, emoji: "🌡️" }} title="WEATHER" subtitle="Herriman, UT" />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-5xl font-extrabold tracking-tight">{weather?.current.temp || 30}°<span className="text-2xl">F</span></div>
                <div className="text-base font-medium" style={{ color: COLORS.textSecondary }}>{weather?.current.condition || "Partly Cloudy"}</div>
                <div className="text-sm font-bold mt-1" style={{ color: COLORS.green }}>+2° from yesterday</div>
              </div>
              <span className="text-6xl">{weather?.current.icon || "⛅"}</span>
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t" style={{ borderColor: COLORS.borderSubtle }}>
              {(weather?.hourly || [
                { time: "6PM", temp: 29, icon: "🌤️" },
                { time: "9PM", temp: 27, icon: "☁️" },
                { time: "12AM", temp: 26, icon: "🌙" },
                { time: "3AM", temp: 25, icon: "🌙" },
              ]).slice(0, 4).map((h, i) => (
                <div key={i} className="text-center">
                  <div className="text-xs font-semibold" style={{ color: COLORS.textDim }}>{h.time}</div>
                  <div className="text-2xl my-1">{h.icon}</div>
                  <div className="text-lg font-bold">{h.temp}°</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Countdowns Card - DRAMATIC */}
          <Card className="flex-1 flex flex-col min-h-0">
            <CardHeader badge={{ gradient: BADGE_GRADIENTS.countdown, emoji: "🎯" }} title="COUNTDOWNS" subtitle="3 upcoming" />
            <div className="flex-1 space-y-3 overflow-y-auto">
              {COUNTDOWNS.map((c, i) => {
                const days = Math.max(0, Math.ceil((new Date(c.date).getTime() - Date.now()) / 86400000))
                const totalDays = 150
                const progress = Math.max(0, 100 - (days / totalDays) * 100)
                return (
                  <div key={i} className="p-4 rounded-xl" style={{ background: COLORS.bgInput }}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{c.emoji}</span>
                          <span className="text-base font-bold" style={{ color: COLORS.textPrimary }}>{c.name}</span>
                        </div>
                        <div className="text-sm font-medium mt-1" style={{ color: COLORS.textDim }}>
                          {new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className="font-extrabold tracking-tight"
                          style={{
                            fontSize: '42px',
                            lineHeight: 1,
                            color: c.color,
                            textShadow: `0 0 20px ${c.color}`,
                          }}
                        >
                          {days}
                        </div>
                        <div className="text-xs font-bold tracking-widest" style={{ color: COLORS.textDim }}>DAYS</div>
                      </div>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: COLORS.bgCard }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${progress}%`, background: c.color, boxShadow: `0 0 10px ${c.color}` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Grocery Card - COMPACT */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <IconBadge gradient={BADGE_GRADIENTS.grocery} emoji="🛒" size={36} />
                <div>
                  <span className="text-base font-bold">GROCERY</span>
                  <span className="ml-2 text-sm font-medium" style={{ color: COLORS.textMuted }}>{groceryItems.length} items</span>
                </div>
              </div>
              {baseUrl && (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=32x32&data=${encodeURIComponent(baseUrl + "/grocery")}&bgcolor=0F172A&color=94A3B8`}
                  alt="QR"
                  className="w-8 h-8 rounded"
                />
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {groceryItems.slice(0, 6).map(item => (
                <span
                  key={item.id}
                  onClick={() => toggleGroceryItem(item.id, !item.is_checked)}
                  className={`text-sm font-medium px-3 py-1.5 rounded-full cursor-pointer transition-all ${item.is_checked ? 'line-through' : ''}`}
                  style={{
                    background: item.is_checked ? COLORS.greenDim : COLORS.bgInput,
                    color: item.is_checked ? COLORS.textDim : COLORS.textSecondary,
                    border: item.is_checked ? `1px solid ${COLORS.green}` : `1px solid ${COLORS.borderSubtle}`,
                  }}
                >
                  {item.is_checked ? '✓ ' : '○ '}{item.name}
                </span>
              ))}
              {groceryItems.length > 6 && (
                <span className="text-sm font-medium px-3 py-1.5 rounded-full" style={{ background: COLORS.bgInput, color: COLORS.textDim }}>
                  +{groceryItems.length - 6} more
                </span>
              )}
            </div>
            <div className="text-xs mt-2 font-medium" style={{ color: COLORS.textDim }}>
              Scan QR to add →
            </div>
          </Card>
        </div>

        {/* ═══════════ CENTER COLUMN ═══════════ */}
        <div className="flex flex-col gap-3 min-h-0">

          {/* Monthly Calendar */}
          <Card className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <IconBadge gradient={BADGE_GRADIENTS.calendar} emoji="📅" />
                <div>
                  <div className="text-xl font-extrabold tracking-wide">{monthNames[middleDate.getMonth()].toUpperCase()} {middleDate.getFullYear()}</div>
                  <div className="text-sm font-medium" style={{ color: COLORS.textMuted }}>5 events this week</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 rounded-lg text-base font-bold" style={{ background: COLORS.bgInput, color: COLORS.textMuted }}>◀</button>
                <button className="px-4 py-2 rounded-lg text-base font-bold" style={{ background: COLORS.green, color: 'white' }}>TODAY</button>
                <button className="px-3 py-2 rounded-lg text-base font-bold" style={{ background: COLORS.bgInput, color: COLORS.textMuted }}>▶</button>
              </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-2">
              {dayNames.map((d, i) => (
                <div key={d} className="text-center text-sm font-bold py-2" style={{ color: i === 0 || i === 6 ? COLORS.textDim : COLORS.textMuted }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 flex flex-col" style={{ borderTop: `1px solid ${COLORS.borderSubtle}` }}>
              {calendarWeeks.map((week, wi) => (
                <div key={wi} className="flex-1 grid grid-cols-7" style={{ borderBottom: wi < 4 ? `1px solid ${COLORS.borderSubtle}` : 'none' }}>
                  {week.map((date, di) => {
                    const isToday = date.toDateString() === today.toDateString()
                    const dayEvents = getEventsForDate(date)
                    const isCurrentMonth = date.getMonth() === middleDate.getMonth()

                    return (
                      <div
                        key={di}
                        className="p-1.5 flex flex-col"
                        style={{
                          borderRight: di < 6 ? `1px solid ${COLORS.borderSubtle}` : 'none',
                          background: isToday ? COLORS.greenDim : 'transparent',
                          boxShadow: isToday ? `inset 0 0 0 2px ${COLORS.green}, 0 0 20px ${COLORS.greenGlow}` : 'none',
                          borderRadius: isToday ? '10px' : '0',
                        }}
                      >
                        <div
                          className="text-xl font-bold text-center"
                          style={{
                            color: isToday ? COLORS.green : !isCurrentMonth ? COLORS.textDim : COLORS.textSecondary,
                            textShadow: isToday ? `0 0 10px ${COLORS.green}` : 'none',
                          }}
                        >
                          {date.getDate()}
                        </div>
                        <div className="flex-1 space-y-0.5 overflow-hidden mt-1">
                          {dayEvents.map((evt, ei) => (
                            <div
                              key={ei}
                              className="text-xs font-semibold px-1.5 py-1 rounded truncate"
                              style={{ background: evt.color, color: 'white' }}
                            >
                              {evt.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </Card>

          {/* Bottom row: Upcoming + Dodgers */}
          <div className="flex gap-3">
            {/* Upcoming This Week */}
            <Card className="flex-1">
              <CardHeader badge={{ gradient: BADGE_GRADIENTS.upcoming, emoji: "⚡" }} title="UPCOMING" right={<span className="text-sm font-bold cursor-pointer" style={{ color: COLORS.blue }}>View All →</span>} />
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-bold mb-2" style={{ color: COLORS.green }}>TODAY Fri 31</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-base font-medium" style={{ color: COLORS.textSecondary }}>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#475569" }} />
                      Work 8-5 PM
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold mb-2" style={{ color: COLORS.textMuted }}>SAT 31</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-base font-medium" style={{ color: COLORS.textSecondary }}>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.orange }} />
                      Mason 8AM @ MW
                    </div>
                    <div className="flex items-center gap-2 text-base font-medium" style={{ color: COLORS.textSecondary }}>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.red }} />
                      Dalton 4PM @ MW
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Dodgers - SMALL THUMBNAIL */}
            <Card className="w-64">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <IconBadge gradient={BADGE_GRADIENTS.dodgers} emoji="⚾" size={32} />
                  <span className="text-base font-bold">DODGERS</span>
                </div>
                <span className="text-sm font-bold px-2 py-1 rounded" style={{ background: COLORS.bgInput, color: COLORS.textMuted }}>▶ PLAY</span>
              </div>
              <div className="relative rounded-lg overflow-hidden" style={{ background: COLORS.bgInput, aspectRatio: '16/9' }}>
                <img
                  src="https://img.youtube.com/vi/kXYiU_JCYtU/mqdefault.jpg"
                  alt="Dodgers Highlights"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.9)' }}>
                    <span className="text-2xl ml-1">▶</span>
                  </div>
                </div>
              </div>
              <div className="text-sm font-medium mt-2 truncate" style={{ color: COLORS.textMuted }}>
                Latest: Dodgers Spring Training 2026
              </div>
            </Card>
          </div>
        </div>

        {/* ═══════════ RIGHT COLUMN ═══════════ */}
        <div className="flex flex-col gap-3 min-h-0">
          {/* Goals Header */}
          <div className="flex items-center gap-3 px-2">
            <IconBadge gradient={BADGE_GRADIENTS.goals} emoji="🏆" size={36} />
            <span className="text-xl font-extrabold tracking-wide">2026 GOALS</span>
          </div>

          {goalsByUser.slice(0, 3).map(({ user, goals }) => (
            <GoalCard
              key={user.id}
              user={user}
              goals={goals}
              color={userColors[user.name] || COLORS.blue}
              initial={user.name[0]}
            />
          ))}

          {/* Quick Actions */}
          <Card>
            <div className="flex items-center justify-around">
              {baseUrl && (
                <>
                  <div className="flex flex-col items-center">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=${encodeURIComponent(baseUrl + "/goals/new")}&bgcolor=0F172A&color=94A3B8`} alt="QR" className="w-14 h-14 rounded-lg" />
                    <span className="text-sm font-bold mt-1.5" style={{ color: COLORS.textMuted }}>🎯 Goal</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=${encodeURIComponent(baseUrl + "/goals")}&bgcolor=0F172A&color=94A3B8`} alt="QR" className="w-14 h-14 rounded-lg" />
                    <span className="text-sm font-bold mt-1.5" style={{ color: COLORS.textMuted }}>📊 Log</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=${encodeURIComponent(baseUrl + "/events/new")}&bgcolor=0F172A&color=94A3B8`} alt="QR" className="w-14 h-14 rounded-lg" />
                    <span className="text-sm font-bold mt-1.5" style={{ color: COLORS.textMuted }}>📅 Event</span>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
