"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, Zap, Eye } from "lucide-react"

const allMetrics = {
  dalton: [
    {
      id: 1,
      name: "Throwing Velocity",
      icon: "⚡",
      category: "Athletic",
      current: 78,
      target: 93,
      unit: "mph",
      entries: 24,
      lastUpdate: "2 hours ago",
      trend: "up",
      change: 3,
      consistency: 88,
      views: 45,
    },
    {
      id: 2,
      name: "GPA",
      icon: "📚",
      category: "Academic",
      current: 3.7,
      target: 4.0,
      unit: "",
      entries: 18,
      lastUpdate: "1 day ago",
      trend: "up",
      change: 0.2,
      consistency: 92,
      views: 38,
    },
    {
      id: 3,
      name: "Exit Velocity",
      icon: "🎯",
      category: "Athletic",
      current: 85,
      target: 90,
      unit: "mph",
      entries: 32,
      lastUpdate: "3 hours ago",
      trend: "up",
      change: 2,
      consistency: 78,
      views: 52,
    },
    {
      id: 4,
      name: "60-Yard Dash",
      icon: "🏃",
      category: "Athletic",
      current: 7.2,
      target: 6.8,
      unit: "sec",
      entries: 15,
      lastUpdate: "5 days ago",
      trend: "down",
      change: -0.2,
      consistency: 65,
      views: 28,
    },
  ],
  mason: [
    {
      id: 5,
      name: "Throwing Velocity",
      icon: "⚡",
      category: "Athletic",
      current: 68,
      target: 75,
      unit: "mph",
      entries: 19,
      lastUpdate: "1 day ago",
      trend: "up",
      change: 2,
      consistency: 82,
      views: 34,
    },
    {
      id: 6,
      name: "Mile Time",
      icon: "⏱️",
      category: "Athletic",
      current: 7.5,
      target: 6.5,
      unit: "min",
      entries: 12,
      lastUpdate: "3 days ago",
      trend: "down",
      change: -0.3,
      consistency: 71,
      views: 22,
    },
    {
      id: 7,
      name: "Batting Average",
      icon: "⚾",
      category: "Athletic",
      current: 0.285,
      target: 0.35,
      unit: "",
      entries: 28,
      lastUpdate: "5 hours ago",
      trend: "up",
      change: 0.015,
      consistency: 88,
      views: 41,
    },
  ],
  nate: [
    {
      id: 8,
      name: "Phone Time",
      icon: "📱",
      category: "Personal",
      current: 4.2,
      target: 2.0,
      unit: "hrs/day",
      entries: 45,
      lastUpdate: "Today",
      trend: "down",
      change: -0.5,
      consistency: 76,
      views: 55,
    },
    {
      id: 9,
      name: "Workout Frequency",
      icon: "💪",
      category: "Home",
      current: 3,
      target: 5,
      unit: "days/week",
      entries: 22,
      lastUpdate: "Yesterday",
      trend: "up",
      change: 1,
      consistency: 68,
      views: 31,
    },
    {
      id: 10,
      name: "Weight",
      icon: "⚖️",
      category: "Home",
      current: 185,
      target: 175,
      unit: "lbs",
      entries: 38,
      lastUpdate: "Today",
      trend: "down",
      change: -2,
      consistency: 85,
      views: 42,
    },
  ],
}

export default function DemoMetricsPage() {
  const [selectedUser, setSelectedUser] = useState<"dalton" | "mason" | "nate">("dalton")

  const metrics = allMetrics[selectedUser]

  const topTracked = [...metrics].sort((a, b) => b.entries - a.entries).slice(0, 3)
  const needsAttention = metrics.filter((m) => {
    const progress = m.target > m.current ? (m.current / m.target) * 100 : ((2 * m.target - m.current) / m.target) * 100
    return progress < 70
  })
  const bestConsistency = [...metrics].sort((a, b) => b.consistency - a.consistency).slice(0, 6)

  const totalEntries = metrics.reduce((sum, m) => sum + m.entries, 0)
  const avgConsistency = Math.round(metrics.reduce((sum, m) => sum + m.consistency, 0) / metrics.length)
  const improving = metrics.filter((m) => m.trend === "up").length

  return (
    <div className="min-h-screen bg-gray-50">
      <Card className="bg-amber-50 border-amber-200 mb-6 rounded-none border-x-0 border-t-0">
        <CardContent className="pt-6">
          <p className="text-center text-amber-900">
            <strong>Demo Mode:</strong> Metric editing is disabled. Sign up to track your own metrics!
          </p>
        </CardContent>
      </Card>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-gray-900">Top Metrics</h1>
              <Badge className="bg-green-500 hover:bg-green-600">ACTIVE TRACKING</Badge>
            </div>
            <p className="text-gray-600">Performance analytics and tracking insights</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant={selectedUser === "dalton" ? "default" : "outline"}
              onClick={() => setSelectedUser("dalton")}
              className={selectedUser === "dalton" ? "bg-navy-600" : ""}
            >
              Dalton
            </Button>
            <Button
              variant={selectedUser === "mason" ? "default" : "outline"}
              onClick={() => setSelectedUser("mason")}
              className={selectedUser === "mason" ? "bg-navy-600" : ""}
            >
              Mason
            </Button>
            <Button
              variant={selectedUser === "nate" ? "default" : "outline"}
              onClick={() => setSelectedUser("nate")}
              className={selectedUser === "nate" ? "bg-navy-600" : ""}
            >
              Nate
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-gray-600 mb-1">Total Entries</div>
              <div className="text-3xl font-bold text-gray-900">{totalEntries}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-gray-600 mb-1">Tracked Metrics</div>
              <div className="text-3xl font-bold text-gray-900">{metrics.length}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-gray-600 mb-1">Improving</div>
              <div className="text-3xl font-bold text-green-600">{improving}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-gray-600 mb-1">Avg Consistency</div>
              <div className="text-3xl font-bold text-gray-900">{avgConsistency}%</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Most Tracked</h2>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {topTracked.map((metric, idx) => (
              <Card key={metric.id} className="shadow-sm hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl shadow-md">
                        {metric.icon}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{metric.name}</div>
                        <div className="text-xs text-gray-500">Version 2026.1</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      ✓
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Eye className="h-3 w-3" /> VIEWS
                      </span>
                      <span className="font-semibold text-gray-900">{metric.views}</span>
                      <span className="text-green-600 text-xs">▲</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Activity className="h-3 w-3" /> ENTRIES
                      </span>
                      <span className="font-semibold text-gray-900">{metric.entries}</span>
                      <span className="text-green-600 text-xs">▲</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Zap className="h-3 w-3" /> CONSISTENCY
                      </span>
                      <span className="font-semibold text-gray-900">{metric.consistency}%</span>
                      <span className="text-gray-400 text-xs">▼</span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-2 border-t">
                      <span className="text-gray-600">CURRENT</span>
                      <span className="font-bold text-gray-900">
                        {metric.current}
                        {metric.unit}
                      </span>
                    </div>
                    <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Needs Attention */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Needs Attention</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {needsAttention.map((metric) => (
                <Card key={metric.id} className="shadow-sm hover:shadow-md transition-all">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-2xl mb-3 shadow">
                        {metric.icon}
                      </div>
                      <div className="font-bold text-gray-900 mb-1">{metric.name}</div>
                      <div className="text-xs text-gray-500 mb-3">SKU: {metric.id}26</div>
                      <div className="w-full pt-3 border-t">
                        <div className="text-xs text-gray-600 mb-1">PROGRESS</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {Math.round((metric.current / metric.target) * 100)}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Best Consistency */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Best Consistency</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {bestConsistency.map((metric) => (
                <Card key={metric.id} className="shadow-sm hover:shadow-md transition-all">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-2xl mb-3 shadow">
                        {metric.icon}
                      </div>
                      <div className="font-bold text-gray-900 mb-1">{metric.name}</div>
                      <div className="text-xs text-gray-500 mb-3">SKU: {metric.id}26</div>
                      <div className="w-full pt-3 border-t">
                        <div className="text-xs text-gray-600 mb-1">CONSISTENCY</div>
                        <div className="text-2xl font-bold text-green-600">{metric.consistency}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
