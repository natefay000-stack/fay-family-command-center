"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Filter, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Demo data for calendar events
const demoEvents = [
  // Nate's events
  {
    id: "1",
    person: "Nate",
    personId: "nate",
    title: "Throwing Session",
    date: "2026-01-15",
    type: "metric",
    category: "Athletic",
    icon: "⚾",
    color: "bg-sky-500",
  },
  {
    id: "checkin-group",
    person: "Family",
    personId: "all",
    title: "Weekly Check-in",
    date: "2026-01-19",
    type: "checkin",
    category: "Check-in",
    icon: "📋",
    color: "bg-lime-500",
    isGroup: true,
    participants: [
      { id: "nate", name: "Nate", initial: "N", color: "bg-sky-600" },
      { id: "dalton", name: "Dalton", initial: "D", color: "bg-navy-dark" },
      { id: "mason", name: "Mason", initial: "M", color: "bg-lime-600" },
    ],
  },
  {
    id: "3",
    person: "Nate",
    personId: "nate",
    title: "Exit Velo: 93 mph",
    date: "2026-01-22",
    type: "achievement",
    category: "Athletic",
    icon: "🎯",
    color: "bg-orange-500",
  },
  {
    id: "4",
    person: "Nate",
    personId: "nate",
    title: "Study Session",
    date: "2026-01-25",
    type: "metric",
    category: "Academic",
    icon: "📚",
    color: "bg-purple-500",
  },

  // Dalton's events
  {
    id: "5",
    person: "Dalton",
    personId: "dalton",
    title: "Practice Game",
    date: "2026-01-17",
    type: "metric",
    category: "Athletic",
    icon: "⚾",
    color: "bg-sky-500",
  },
  {
    id: "6",
    person: "Dalton",
    personId: "dalton",
    title: "GPA Check: 3.8",
    date: "2026-01-20",
    type: "achievement",
    category: "Academic",
    icon: "🎓",
    color: "bg-purple-500",
  },
  {
    id: "8",
    person: "Dalton",
    personId: "dalton",
    title: "Milestone: Varsity Tryout",
    date: "2026-01-28",
    type: "milestone",
    category: "Athletic",
    icon: "🏆",
    color: "bg-orange-500",
  },

  // Mason's events
  {
    id: "9",
    person: "Mason",
    personId: "mason",
    title: "Throwing Session",
    date: "2026-01-16",
    type: "metric",
    category: "Athletic",
    icon: "⚾",
    color: "bg-sky-500",
  },
  {
    id: "11",
    person: "Mason",
    personId: "mason",
    title: "Confidence Survey",
    date: "2026-01-23",
    type: "metric",
    category: "Health",
    icon: "💪",
    color: "bg-lime-500",
  },
  {
    id: "12",
    person: "Mason",
    personId: "mason",
    title: "Mile Time: 7:15",
    date: "2026-01-26",
    type: "achievement",
    category: "Athletic",
    icon: "🏃",
    color: "bg-orange-500",
  },
]

export default function DemoCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1))
  const [selectedPerson, setSelectedPerson] = useState<string>("all")
  const [view, setView] = useState<"day" | "week" | "month">("month")
  const [isTVMode, setIsTVMode] = useState(false)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return { firstDay, daysInMonth }
  }

  const goToPrevious = () => {
    const newDate = new Date(currentDate)
    if (view === "day") {
      newDate.setDate(newDate.getDate() - 1)
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
  }

  const goToNext = () => {
    const newDate = new Date(currentDate)
    if (view === "day") {
      newDate.setDate(newDate.getDate() + 1)
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date(2026, 0, 1))
  }

  const getEventsForDate = (day: number) => {
    const dateStr = `2026-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    let events = demoEvents.filter((e) => e.date === dateStr)

    if (selectedPerson !== "all") {
      events = events.filter((e) => {
        if (e.isGroup) {
          return e.participants?.some((p: any) => p.id === selectedPerson)
        }
        return e.personId === selectedPerson
      })
    }

    return events
  }

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day
    return new Date(d.setDate(diff))
  }

  const getWeekDays = () => {
    const start = getStartOfWeek(currentDate)
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      return day
    })
  }

  const getEventsForDay = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    let events = demoEvents.filter((e) => e.date === dateStr)

    if (selectedPerson !== "all") {
      events = events.filter((e) => {
        if (e.isGroup) {
          return e.participants?.some((p: any) => p.id === selectedPerson)
        }
        return e.personId === selectedPerson
      })
    }

    return events
  }

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstDay }, (_, i) => i)

  // Filter events for stats
  const filteredEvents =
    selectedPerson === "all"
      ? demoEvents
      : demoEvents.filter((e) => {
          if (e.isGroup) {
            return e.participants?.some((p: any) => p.id === selectedPerson)
          }
          return e.personId === selectedPerson
        })

  const totalEvents = filteredEvents.length
  const achievements = filteredEvents.filter((e) => e.type === "achievement").length
  const checkIns = filteredEvents.filter((e) => e.type === "checkin").length

  if (isTVMode) {
    return (
      <div className="fixed inset-0 bg-black text-white z-50 overflow-hidden">
        {/* Exit TV Mode Button */}
        <button
          onClick={() => setIsTVMode(false)}
          className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-xl font-bold z-10"
        >
          EXIT TV MODE
        </button>

        {/* Three Panel Layout */}
        <div className="h-screen flex gap-8 p-8">
          {/* Panel C: Supplemental Info (Left, 20%) */}
          <div className="w-[20%] space-y-8">
            {/* Current Weather */}
            <div className="bg-gray-900 rounded-2xl p-8">
              <h3 className="text-3xl font-bold mb-6 text-sky-400">WEATHER</h3>
              <div className="flex items-center justify-center flex-col">
                <div className="text-8xl mb-4">☀️</div>
                <div className="text-6xl font-bold">72°F</div>
                <div className="text-2xl text-gray-400 mt-2">Sunny</div>
              </div>
            </div>

            {/* Shared Notes */}
            <div className="bg-gray-900 rounded-2xl p-8 flex-1">
              <h3 className="text-3xl font-bold mb-6 text-lime-400">NOTES</h3>
              <div className="space-y-4">
                <div className="text-xl leading-relaxed">🎾 Mason's tennis match at 4pm</div>
                <div className="text-xl leading-relaxed">📚 Library books due Friday</div>
                <div className="text-xl leading-relaxed">🏥 Dentist appointment Thursday</div>
              </div>
            </div>

            {/* Tonight's Dinner */}
            <div className="bg-gray-900 rounded-2xl p-8">
              <h3 className="text-3xl font-bold mb-6 text-orange-400">DINNER</h3>
              <div className="text-center">
                <div className="text-6xl mb-4">🍝</div>
                <div className="text-2xl font-bold">Spaghetti & Meatballs</div>
                <div className="text-xl text-gray-400 mt-2">Ready at 6:30 PM</div>
              </div>
            </div>
          </div>

          {/* Panel A: Main Calendar (Center, 60%) */}
          <div className="w-[60%] bg-gray-900 rounded-2xl p-8">
            <h2 className="text-5xl font-bold mb-8 text-center">WEEK VIEW</h2>

            {/* Week Grid */}
            <div className="grid grid-cols-7 gap-4 h-[calc(100%-80px)]">
              {getWeekDays().map((day) => {
                const events = getEventsForDay(day)
                const isToday = day.toDateString() === new Date(2026, 0, 15).toDateString()

                return (
                  <div
                    key={day.toISOString()}
                    className={`rounded-xl p-4 ${isToday ? "bg-sky-900 border-4 border-sky-400" : "bg-gray-800"}`}
                  >
                    {/* Day Header */}
                    <div className="text-center mb-4 pb-4 border-b border-gray-700">
                      <div className="text-2xl font-bold text-gray-400">
                        {day.toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                      <div className={`text-5xl font-bold mt-2 ${isToday ? "text-sky-400" : "text-white"}`}>
                        {day.getDate()}
                      </div>
                    </div>

                    {/* Events */}
                    <div className="space-y-3">
                      {events.map((event) => {
                        let bgColor = "bg-blue-600"
                        if (event.personId === "nate") bgColor = "bg-blue-600"
                        else if (event.personId === "dalton") bgColor = "bg-green-600"
                        else if (event.personId === "mason") bgColor = "bg-yellow-600"
                        else if (event.isGroup) bgColor = "bg-purple-600"

                        return (
                          <div key={event.id} className={`${bgColor} rounded-lg p-3 text-center`}>
                            <div className="text-4xl mb-2">{event.icon}</div>
                            <div className="text-lg font-bold leading-tight">{event.title}</div>
                            {event.isGroup && event.participants ? (
                              <div className="flex gap-1 justify-center mt-2">
                                {event.participants.map((participant: any) => (
                                  <div
                                    key={participant.id}
                                    className={`w-8 h-8 rounded-full ${participant.color} text-white flex items-center justify-center text-sm font-bold border-2 border-white`}
                                  >
                                    {participant.initial}
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-8 mt-6 text-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-blue-600" />
                <span>Nate</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-green-600" />
                <span>Dalton</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-yellow-600" />
                <span>Mason</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-purple-600" />
                <span>Family</span>
              </div>
            </div>
          </div>

          {/* Panel B: Goals & Tasks (Right, 20%) */}
          <div className="w-[20%] space-y-8">
            {/* Weekly Goals */}
            <div className="bg-gray-900 rounded-2xl p-8">
              <h3 className="text-4xl font-bold mb-6 text-orange-400">THIS WEEK'S FOCUS</h3>
              <div className="space-y-4">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-8 h-8 mt-1 rounded border-2 border-gray-600 checked:bg-orange-500 checked:border-orange-500"
                  />
                  <span className="text-2xl leading-tight group-hover:text-orange-400 transition-colors">
                    Hit 93 MPH throwing velocity
                  </span>
                </label>
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-8 h-8 mt-1 rounded border-2 border-gray-600 checked:bg-orange-500 checked:border-orange-500"
                  />
                  <span className="text-2xl leading-tight group-hover:text-orange-400 transition-colors">
                    Complete all homework on time
                  </span>
                </label>
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-8 h-8 mt-1 rounded border-2 border-gray-600 checked:bg-orange-500 checked:border-orange-500"
                    defaultChecked
                  />
                  <span className="text-2xl leading-tight group-hover:text-orange-400 transition-colors line-through opacity-60">
                    Family check-in on Tuesday
                  </span>
                </label>
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-8 h-8 mt-1 rounded border-2 border-gray-600 checked:bg-orange-500 checked:border-orange-500"
                  />
                  <span className="text-2xl leading-tight group-hover:text-orange-400 transition-colors">
                    Practice confidence building
                  </span>
                </label>
              </div>
            </div>

            {/* Daily Habits */}
            <div className="bg-gray-900 rounded-2xl p-8 flex-1">
              <h3 className="text-4xl font-bold mb-6 text-lime-400">TODAY'S HABITS</h3>
              <div className="space-y-6">
                <label className="flex items-center gap-6 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-10 h-10 rounded-full border-2 border-gray-600 checked:bg-lime-500 checked:border-lime-500"
                    defaultChecked
                  />
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">💪</span>
                    <span className="text-2xl font-bold group-hover:text-lime-400 transition-colors">Workout</span>
                  </div>
                </label>
                <label className="flex items-center gap-6 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-10 h-10 rounded-full border-2 border-gray-600 checked:bg-lime-500 checked:border-lime-500"
                  />
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">📚</span>
                    <span className="text-2xl font-bold group-hover:text-lime-400 transition-colors">Study</span>
                  </div>
                </label>
                <label className="flex items-center gap-6 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-10 h-10 rounded-full border-2 border-gray-600 checked:bg-lime-500 checked:border-lime-500"
                    defaultChecked
                  />
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">⚾</span>
                    <span className="text-2xl font-bold group-hover:text-lime-400 transition-colors">Practice</span>
                  </div>
                </label>
                <label className="flex items-center gap-6 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-10 h-10 rounded-full border-2 border-gray-600 checked:bg-lime-500 checked:border-lime-500"
                  />
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">🧘</span>
                    <span className="text-2xl font-bold group-hover:text-lime-400 transition-colors">Mindfulness</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6">
          <p className="text-center text-amber-900">
            <strong>Demo Mode:</strong> You're viewing sample data. Sign up to create your own goals and track real
            progress!
          </p>
        </CardContent>
      </Card>

      {/* Header with Stats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-balance">Family Calendar</h1>
            <p className="text-lg text-muted-foreground mt-1">
              {totalEvents} events this month • {achievements} achievements • {checkIns} check-ins
            </p>
          </div>

          {/* View and Person Filters side by side */}
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <Select value={view} onValueChange={(v) => setView(v as "day" | "week" | "month")}>
              <SelectTrigger className="w-[140px] h-11 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>

            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select value={selectedPerson} onValueChange={setSelectedPerson}>
              <SelectTrigger className="w-[180px] h-11 text-base">
                <SelectValue placeholder="Filter by person" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Family Members</SelectItem>
                <SelectItem value="nate">Nate</SelectItem>
                <SelectItem value="dalton">Dalton</SelectItem>
                <SelectItem value="mason">Mason</SelectItem>
              </SelectContent>
            </Select>

            {/* TV MODE button */}
            <Button
              size="lg"
              onClick={() => setIsTVMode(true)}
              className="h-11 px-6 bg-orange-600 hover:bg-orange-700 text-white font-bold"
            >
              📺 TV MODE
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Card */}
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold">
              {view === "day" &&
                currentDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              {view === "week" &&
                `Week of ${getStartOfWeek(currentDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
              {view === "month" && currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </CardTitle>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="lg" onClick={goToPrevious} className="h-11 bg-transparent">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" onClick={goToToday} className="h-11 px-6 bg-transparent">
                Today
              </Button>
              <Button variant="outline" size="lg" onClick={goToNext} className="h-11 bg-transparent">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Day View */}
          {view === "day" && (
            <div className="space-y-4">
              <div className="text-center py-4 border-b">
                <h2 className="text-2xl font-bold">{currentDate.toLocaleDateString("en-US", { weekday: "long" })}</h2>
                <p className="text-lg text-muted-foreground">
                  {currentDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                </p>
              </div>

              <div className="space-y-3 min-h-[400px]">
                {getEventsForDay(currentDate).map((event) => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-lg ${event.color} flex items-center justify-center text-3xl`}>
                        {event.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{event.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {event.isGroup && event.participants ? (
                            <div className="flex items-center gap-1">
                              {event.participants.map((participant: any) => (
                                <div
                                  key={participant.id}
                                  className={`w-7 h-7 rounded-full ${participant.color} text-white flex items-center justify-center text-xs font-bold`}
                                  title={participant.name}
                                >
                                  {participant.initial}
                                </div>
                              ))}
                              <span className="text-base text-muted-foreground ml-1">• {event.category}</span>
                            </div>
                          ) : (
                            <p className="text-base text-muted-foreground">
                              {event.person} • {event.category}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button size="lg" className="bg-black text-white hover:bg-gray-800 h-11 px-6">
                        Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                {getEventsForDay(currentDate).length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <p className="text-xl">No events scheduled for this day</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Week View */}
          {view === "week" && (
            <div className="grid grid-cols-7 gap-3">
              {getWeekDays().map((day) => {
                const events = getEventsForDay(day)
                const isToday = day.toDateString() === new Date(2026, 0, 15).toDateString()

                return (
                  <div
                    key={day.toISOString()}
                    className={`border rounded-lg p-3 min-h-[300px] ${isToday ? "border-navy-dark border-2 bg-sky-50" : "border-gray-200"}`}
                  >
                    <div className="text-center mb-3">
                      <div className="text-sm font-semibold text-muted-foreground">
                        {day.toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                      <div className={`text-2xl font-bold mt-1 ${isToday ? "text-navy-dark" : "text-gray-700"}`}>
                        {day.getDate()}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {events.map((event) => (
                        <div key={event.id} className={`text-xs ${event.color} text-white rounded-lg p-2 space-y-1`}>
                          <div className="text-lg">{event.icon}</div>
                          <div className="font-semibold truncate" title={event.title}>
                            {event.title}
                          </div>
                          {event.isGroup && event.participants ? (
                            <div className="flex gap-0.5">
                              {event.participants.map((participant: any) => (
                                <div
                                  key={participant.id}
                                  className={`w-5 h-5 rounded-full ${participant.color} text-white flex items-center justify-center text-[10px] font-bold`}
                                  title={participant.name}
                                >
                                  {participant.initial}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs opacity-90">{event.person}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Month View */}
          {view === "month" && (
            <div className="grid grid-cols-7 gap-2">
              {/* Day Headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
                  {day}
                </div>
              ))}

              {/* Blank spaces before first day */}
              {blanks.map((blank) => (
                <div key={`blank-${blank}`} className="min-h-[120px]" />
              ))}

              {/* Calendar Days */}
              {days.map((day) => {
                const events = getEventsForDate(day)
                const isToday = day === 15 && currentDate.getMonth() === 0

                return (
                  <div
                    key={day}
                    className={`min-h-[120px] border rounded-lg p-2 hover:bg-gray-50 transition-colors ${
                      isToday ? "border-navy-dark border-2 bg-sky-50" : "border-gray-200"
                    }`}
                  >
                    <div className={`text-sm font-semibold mb-2 ${isToday ? "text-navy-dark" : "text-gray-700"}`}>
                      {day}
                    </div>

                    <div className="space-y-1">
                      {events.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs ${event.color} text-white rounded px-2 py-1 truncate`}
                          title={`${event.person}: ${event.title}`}
                        >
                          <div className="flex items-center gap-1">
                            <span className="text-sm">{event.icon}</span>
                            <span className="truncate font-medium flex-1">{event.title}</span>
                          </div>
                          {event.isGroup && event.participants ? (
                            <div className="flex gap-0.5 mt-1">
                              {event.participants.map((participant: any) => (
                                <div
                                  key={participant.id}
                                  className={`w-4 h-4 rounded-full ${participant.color} text-white flex items-center justify-center text-[9px] font-bold`}
                                  title={participant.name}
                                >
                                  {participant.initial}
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))}
                      {events.length > 3 && (
                        <div className="text-xs text-muted-foreground font-medium pl-2">+{events.length - 3} more</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-sky-500" />
              <span className="text-sm font-medium">Metrics</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-500" />
              <span className="text-sm font-medium">Achievements</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-lime-500" />
              <span className="text-sm font-medium">Check-ins</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-500" />
              <span className="text-sm font-medium">Academic</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
