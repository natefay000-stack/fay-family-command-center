"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, Trophy, Eye, EyeOff } from "lucide-react"
import { MetricSparkline } from "@/components/charts/metric-sparkline"

interface Metric {
  id: string
  metric_name: string
  metric_value: number
  unit: string
  date: string
}

interface FamilyGoal {
  id: string
  title: string
  current_value: number
  target_value: number
  profile: {
    full_name: string
  }
}

interface DashboardChartsProps {
  metrics: Metric[]
  familyGoals: FamilyGoal[]
}

export function DashboardCharts({ metrics, familyGoals }: DashboardChartsProps) {
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  // Group metrics by name and get top 3
  const metricsByName = metrics.reduce(
    (acc, metric) => {
      if (!acc[metric.metric_name]) {
        acc[metric.metric_name] = []
      }
      acc[metric.metric_name].push(metric)
      return acc
    },
    {} as Record<string, Metric[]>,
  )

  const topMetrics = Object.entries(metricsByName)
    .slice(0, 3)
    .map(([name, data]) => ({
      name,
      data: data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      latest: data[data.length - 1],
    }))

  // Calculate weekly trend (last 7 days vs previous 7 days)
  const now = new Date()
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const previous7Days = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

  const recentMetrics = metrics.filter((m) => new Date(m.date) >= last7Days)
  const previousMetrics = metrics.filter((m) => new Date(m.date) >= previous7Days && new Date(m.date) < last7Days)

  const weeklyTrendData = [
    { period: "Previous Week", count: previousMetrics.length },
    { period: "This Week", count: recentMetrics.length },
  ]

  // Calculate family leaderboard
  const leaderboard = familyGoals
    .map((goal) => ({
      name: goal.profile.full_name,
      progress: goal.target_value > 0 ? (goal.current_value / goal.target_value) * 100 : 0,
      title: goal.title,
    }))
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Progress Snapshot */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topMetrics.length > 0 ? (
            <div className="space-y-6">
              {topMetrics.map(({ name, data, latest }) => (
                <div key={name} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{name}</p>
                      <p className="text-sm text-muted-foreground">
                        Latest: {latest.metric_value} {latest.unit}
                      </p>
                    </div>
                  </div>
                  <MetricSparkline data={data.map((m) => ({ value: m.metric_value }))} height={50} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No metrics data yet</p>
              <p className="text-sm mt-1">Start tracking to see your progress!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Weekly Activity Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weeklyTrendData.some((d) => d.count > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {recentMetrics.length > previousMetrics.length
                    ? `Great job! You logged ${recentMetrics.length - previousMetrics.length} more metrics this week.`
                    : recentMetrics.length === previousMetrics.length
                      ? "You're maintaining consistent tracking. Keep it up!"
                      : "Try to log more metrics this week to track your progress better."}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <BarChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Not enough data yet</p>
              <p className="text-sm mt-1">Keep logging metrics to see trends!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Family Leaderboard */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Family Leaderboard
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowLeaderboard(!showLeaderboard)}>
              {showLeaderboard ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        {showLeaderboard && (
          <CardContent>
            {leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                        index === 0
                          ? "bg-yellow-500 text-yellow-950"
                          : index === 1
                            ? "bg-gray-400 text-gray-900"
                            : index === 2
                              ? "bg-orange-600 text-orange-50"
                              : "bg-muted-foreground/20 text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{item.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{Math.round(item.progress)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No family goals yet</p>
                <p className="text-sm mt-1">Start creating goals to see the leaderboard!</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}
