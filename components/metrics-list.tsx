"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus } from "lucide-react"
import Link from "next/link"
import { MetricSparkline } from "@/components/charts/metric-sparkline"

interface Metric {
  id: string
  metric_name: string
  metric_value: number
  unit: string
  date: string
  notes?: string
}

interface MetricsListProps {
  metrics: Metric[]
  metricsByName: Record<string, Metric[]>
}

export function MetricsList({ metrics, metricsByName }: MetricsListProps) {
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null)

  const getMetricTrend = (metricData: Metric[]) => {
    if (metricData.length < 2) return null

    const sorted = [...metricData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const latest = sorted[0].metric_value
    const previous = sorted[1].metric_value

    if (latest > previous) return "up"
    if (latest < previous) return "down"
    return "stable"
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Metrics</h2>
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(metricsByName).map(([name, metricData]) => {
          const isExpanded = expandedMetric === name
          const sortedData = [...metricData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          const latestMetric = sortedData[0]
          const trend = getMetricTrend(sortedData)

          const sparklineData = sortedData
            .slice()
            .reverse()
            .map((m) => ({ value: m.metric_value }))

          return (
            <Card key={name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Link href={`/metrics/${latestMetric.id}`} className="hover:underline">
                    <CardTitle className="text-lg">{name}</CardTitle>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => setExpandedMetric(isExpanded ? null : name)}>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div>
                    <div className="text-2xl font-bold">
                      {latestMetric.metric_value} {latestMetric.unit}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(latestMetric.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  {trend && (
                    <Badge variant={trend === "up" ? "default" : trend === "down" ? "secondary" : "outline"}>
                      {trend === "up" && <TrendingUp className="h-3 w-3 mr-1" />}
                      {trend === "down" && <TrendingDown className="h-3 w-3 mr-1" />}
                      {trend === "stable" && <Minus className="h-3 w-3 mr-1" />}
                      {trend === "up" ? "Increasing" : trend === "down" ? "Decreasing" : "Stable"}
                    </Badge>
                  )}
                </div>
                <div className="mt-2">
                  <MetricSparkline data={sparklineData} />
                </div>
              </CardHeader>
              {isExpanded && (
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      History ({sortedData.length} entries)
                    </div>
                    {sortedData.map((metric) => (
                      <div key={metric.id} className="flex items-start justify-between py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium">
                            {metric.metric_value} {metric.unit}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(metric.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          {metric.notes && <p className="text-sm text-muted-foreground mt-1">{metric.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
