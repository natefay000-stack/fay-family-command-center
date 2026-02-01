"use client"

import { Card } from "@/components/ui/card"
import Link from "next/link"

interface MetricCardProps {
  id: string
  icon: string
  name: string
  currentValue: number
  targetValue?: number
  unit?: string
  sparklineData: number[]
  category: string
  onLog?: () => void
}

export function MetricCard({ id, icon, name, currentValue, targetValue, unit = "" }: MetricCardProps) {
  const progress = targetValue ? (currentValue / targetValue) * 100 : 0

  return (
    <Link href={`/metrics/${id}`} className="block group">
      <Card className="bg-white rounded-2xl border-none shadow-sm hover:shadow-md transition-all duration-200 h-full overflow-hidden">
        <div className="aspect-square bg-gray-50 flex flex-col items-center justify-center border-b gap-2">
          <div className="flex items-baseline gap-1">
            <span className="text-6xl md:text-7xl font-bold text-foreground">{currentValue}</span>
            {unit && <span className="text-2xl md:text-3xl text-muted-foreground">{unit}</span>}
          </div>
        </div>

        <div className="p-6 space-y-3">
          <h3 className="text-lg font-semibold text-foreground">{name}</h3>

          {targetValue && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Target: {targetValue}
                  {unit}
                </span>
                <span className="font-medium text-foreground">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-navy-dark transition-all rounded-full"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </>
          )}
        </div>
      </Card>
    </Link>
  )
}
