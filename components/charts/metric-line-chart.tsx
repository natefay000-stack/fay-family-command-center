"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { Button } from "@/components/ui/button"

interface MetricDataPoint {
  date: string
  value: number
  formattedDate: string
}

interface MetricLineChartProps {
  data: MetricDataPoint[]
  target?: number
  unit: string
  color?: string
}

type TimeRange = "7d" | "30d" | "90d" | "6mo" | "1yr" | "all"

export function MetricLineChart({ data, target, unit, color = "#10b981" }: MetricLineChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d")

  const filterDataByRange = (range: TimeRange) => {
    if (range === "all") return data

    const now = new Date()
    const cutoffDate = new Date()

    switch (range) {
      case "7d":
        cutoffDate.setDate(now.getDate() - 7)
        break
      case "30d":
        cutoffDate.setDate(now.getDate() - 30)
        break
      case "90d":
        cutoffDate.setDate(now.getDate() - 90)
        break
      case "6mo":
        cutoffDate.setMonth(now.getMonth() - 6)
        break
      case "1yr":
        cutoffDate.setFullYear(now.getFullYear() - 1)
        break
    }

    return data.filter((d) => new Date(d.date) >= cutoffDate)
  }

  const filteredData = filterDataByRange(timeRange)

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {(["7d", "30d", "90d", "6mo", "1yr", "all"] as TimeRange[]).map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange(range)}
          >
            {range === "all" ? "All" : range.toUpperCase()}
          </Button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="formattedDate" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
            formatter={(value: number) => [`${value} ${unit}`, "Value"]}
          />
          {target && <ReferenceLine y={target} stroke="hsl(var(--destructive))" strokeDasharray="5 5" label="Target" />}
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ fill: color, r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
