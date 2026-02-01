"use client"

import { LineChart, Line, ResponsiveContainer } from "recharts"

interface SparklineProps {
  data: { value: number }[]
  color?: string
  height?: number
}

export function MetricSparkline({ data, color = "#10b981", height = 40 }: SparklineProps) {
  if (data.length < 2) return null

  const trend = data[data.length - 1].value > data[0].value ? "up" : "down"
  const trendColor = trend === "up" ? "#10b981" : "#ef4444"

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data.slice(-14)}>
        <Line type="monotone" dataKey="value" stroke={trendColor} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
