"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

interface DataPoint {
  date: string
  value: number
  formattedDate: string
  isProjection?: boolean
}

interface MetricProjectionChartProps {
  data: DataPoint[]
  target?: number
  targetDate?: string
  unit: string
}

export function MetricProjectionChart({ data, target, targetDate, unit }: MetricProjectionChartProps) {
  // Calculate linear regression for trend line
  const calculateTrendLine = () => {
    if (data.length < 2) return []

    const actualData = data.filter((d) => !d.isProjection)
    const n = actualData.length
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumX2 = 0

    actualData.forEach((point, index) => {
      sumX += index
      sumY += point.value
      sumXY += index * point.value
      sumX2 += index * index
    })

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    // Generate projection points
    const lastDate = new Date(actualData[actualData.length - 1].date)
    const projectionDays = targetDate
      ? Math.ceil((new Date(targetDate).getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      : 90

    const projectionData = []
    for (let i = n; i < n + projectionDays; i += Math.max(1, Math.floor(projectionDays / 10))) {
      const futureDate = new Date(lastDate)
      futureDate.setDate(lastDate.getDate() + (i - n + 1))

      projectionData.push({
        date: futureDate.toISOString(),
        value: slope * i + intercept,
        formattedDate: futureDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        isProjection: true,
      })
    }

    return [...actualData, ...projectionData]
  }

  const trendData = calculateTrendLine()
  const projectedFinalValue = trendData[trendData.length - 1]?.value

  const projectionMessage =
    target && projectedFinalValue && targetDate
      ? `At this pace: ${projectedFinalValue.toFixed(1)} ${unit} by ${new Date(targetDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
      : null

  return (
    <div className="space-y-4">
      {projectionMessage && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium">{projectionMessage}</p>
          {target && projectedFinalValue && (
            <p className="text-xs text-muted-foreground mt-1">
              {projectedFinalValue >= target ? "On track to hit target!" : "Below target pace - increase effort"}
            </p>
          )}
        </div>
      )}

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="formattedDate" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
            formatter={(value: number) => [`${value.toFixed(1)} ${unit}`, "Value"]}
          />
          {target && <ReferenceLine y={target} stroke="hsl(var(--destructive))" strokeDasharray="5 5" label="Target" />}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#10b981"
            strokeWidth={2}
            dot={(props) => {
              const { cx, cy, payload } = props
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill={payload.isProjection ? "#94a3b8" : "#10b981"}
                  opacity={payload.isProjection ? 0.5 : 1}
                />
              )
            }}
            strokeDasharray={(props) => (props.isProjection ? "5 5" : "0")}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
