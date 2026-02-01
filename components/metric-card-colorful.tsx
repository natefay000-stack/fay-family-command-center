"use client"

import { Card, CardContent } from "@/components/ui/card"
import { getEmojiForMetric, getColorForIndex } from "@/lib/utils/emoji-helper"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import Link from "next/link"

interface MetricCardProps {
  metricName: string
  latestValue: number
  unit: string
  trend: "up" | "down" | "stable"
  count: number
  index: number
  metricId?: string
}

export function MetricCardColorful({ metricName, latestValue, unit, trend, count, index, metricId }: MetricCardProps) {
  const emoji = getEmojiForMetric(metricName)
  const color = getColorForIndex(index)

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus

  return (
    <Link href={metricId ? `/metrics/${metricId}` : "/metrics"}>
      <Card className={`${color.bg} border-none shadow-sm hover:shadow-md transition-all cursor-pointer`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="text-3xl">{emoji}</div>
            <TrendIcon
              className={`h-4 w-4 ${
                trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-400"
              }`}
            />
          </div>
          <h3 className="font-semibold text-base mb-1">{metricName}</h3>
          <div className="flex items-baseline gap-1 mb-1">
            <span className={`text-2xl font-bold ${color.text}`}>{latestValue}</span>
            <span className="text-sm text-muted-foreground">{unit}</span>
          </div>
          <p className="text-xs text-muted-foreground">{count} entries logged</p>
        </CardContent>
      </Card>
    </Link>
  )
}
