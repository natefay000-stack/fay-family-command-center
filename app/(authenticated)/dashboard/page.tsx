"use client"

import { MetricCard } from "@/components/cards/metric-card-v2"
import { GoalCard } from "@/components/cards/goal-card-v2"
import { PersonCard } from "@/components/cards/person-card-v2"
import { CheckInCard } from "@/components/cards/check-in-card"
import { AddCard } from "@/components/cards/add-card"

// Demo data
const demoMetrics = [
  {
    id: "1",
    name: "Throwing Velo",
    currentValue: 78,
    targetValue: 85,
    unit: "mph",
    category: "athletic",
    trend: "up" as const,
  },
  {
    id: "2",
    name: "Screen Time",
    currentValue: 2.5,
    targetValue: 3,
    unit: "hrs",
    category: "digital",
    trend: "down" as const,
  },
  {
    id: "3",
    name: "GPA",
    currentValue: 3.4,
    targetValue: 3.8,
    unit: "",
    category: "academic",
    trend: "up" as const,
  },
  {
    id: "4",
    name: "Weight",
    currentValue: 185,
    targetValue: 180,
    unit: "lbs",
    category: "health",
    trend: "down" as const,
  },
  {
    id: "5",
    name: "60 Time",
    currentValue: 7.2,
    targetValue: 6.8,
    unit: "sec",
    category: "athletic",
    trend: "down" as const,
  },
  {
    id: "6",
    name: "Exit Velo",
    currentValue: 82,
    targetValue: 90,
    unit: "mph",
    category: "athletic",
    trend: "up" as const,
  },
]

const demoGoals = [
  {
    id: "1",
    title: "Make Varsity Baseball",
    milestonesCompleted: 3,
    milestonesTotal: 5,
    dueDate: "2026-03-15",
    category: "athletic",
    status: "on-track" as const,
  },
  {
    id: "2",
    title: "Read 20 Books",
    milestonesCompleted: 8,
    milestonesTotal: 20,
    dueDate: "2026-12-31",
    category: "personal",
    status: "on-track" as const,
  },
  {
    id: "3",
    title: "Save $5,000",
    milestonesCompleted: 2,
    milestonesTotal: 5,
    dueDate: "2026-12-31",
    category: "financial",
    status: "behind" as const,
  },
  {
    id: "4",
    title: "Get 3.8 GPA",
    milestonesCompleted: 1,
    milestonesTotal: 4,
    dueDate: "2026-06-01",
    category: "academic",
    status: "on-track" as const,
  },
]

const demoFamily = [
  {
    id: "1",
    name: "Nate",
    role: "parent" as const,
    weekRating: 4,
    activeGoals: 3,
    streak: 12,
    logsToday: 4,
  },
  {
    id: "2",
    name: "Dalton",
    role: "child" as const,
    weekRating: 4,
    activeGoals: 5,
    streak: 8,
    logsToday: 3,
  },
  {
    id: "3",
    name: "Mason",
    role: "child" as const,
    weekRating: 3,
    activeGoals: 4,
    streak: 5,
    logsToday: 2,
  },
]

export default function DemoDashboard() {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const isToday = dayOfWeek === 2
  const daysUntil = dayOfWeek <= 2 ? 2 - dayOfWeek : 9 - dayOfWeek

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 p-4 text-center shadow-lg">
          <p className="text-white text-base md:text-lg font-bold drop-shadow-sm">
            🎮 Demo Mode: Sign up to track your real goals!
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <CheckInCard
            isToday={isToday}
            daysUntil={daysUntil}
            familyMembers={demoFamily.map((f) => ({
              id: f.id,
              name: f.name,
              completed: false,
            }))}
          />
          <MetricCard {...demoMetrics[0]} />
          <GoalCard {...demoGoals[0]} />
          <PersonCard {...demoFamily[0]} />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <GoalCard {...demoGoals[1]} />
          <MetricCard {...demoMetrics[1]} />
          <PersonCard {...demoFamily[1]} />
          <GoalCard {...demoGoals[2]} />

          <MetricCard {...demoMetrics[2]} />
          <PersonCard {...demoFamily[2]} />
          <GoalCard {...demoGoals[3]} />
          <MetricCard {...demoMetrics[3]} />

          <MetricCard {...demoMetrics[4]} />
          <MetricCard {...demoMetrics[5]} />
          <AddCard type="goal" />
          <AddCard type="metric" />
        </div>
      </div>
    </main>
  )
}
