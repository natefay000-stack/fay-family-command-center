"use client"

import { Card } from "@/components/ui/card"
import Link from "next/link"

interface MetricCardProps {
  id: string
  name: string
  currentValue: number
  targetValue?: number
  unit?: string
  category: string
  trend?: "up" | "down" | "stable"
}

const categoryConfig: Record<string, { gradient: string; icon: string; ringColor: string }> = {
  athletic: { gradient: "bg-energy-orange", icon: "⚡", ringColor: "#ff6b35" },
  academic: { gradient: "bg-energy-green", icon: "🎓", ringColor: "#22c55e" },
  health: { gradient: "bg-energy-blue", icon: "💪", ringColor: "#3b82f6" },
  digital: { gradient: "bg-energy-purple", icon: "📱", ringColor: "#8b5cf6" },
  financial: { gradient: "bg-energy-yellow", icon: "💰", ringColor: "#fbbf24" },
  default: { gradient: "bg-energy-blue", icon: "📊", ringColor: "#3b82f6" },
}

export function MetricCard({ id, name, currentValue, targetValue, unit = "", category }: MetricCardProps) {
  const config = categoryConfig[category] || categoryConfig.default
  const progress = targetValue ? Math.min((currentValue / targetValue) * 100, 100) : 0

  const radius = 90
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <Link href={`/metrics/${id}`} className="block group">
      <Card
        className={`${config.gradient} rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:scale-[1.03] border-0 aspect-square`}
      >
        <div className="h-full flex flex-col items-center justify-between p-8">
          <div className="relative flex-1 flex items-center justify-center w-full">
            {targetValue ? (
              <svg className="w-56 h-56">
                <circle cx="112" cy="112" r={radius} stroke="rgba(255,255,255,0.2)" strokeWidth="16" fill="none" />
                <circle
                  cx="112"
                  cy="112"
                  r={radius}
                  stroke="white"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
            ) : null}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-7xl mb-2">{config.icon}</div>
              <div className="flex items-baseline gap-2">
                <span className="font-black text-white leading-none tracking-tight" style={{ fontSize: "120px" }}>
                  {currentValue}
                </span>
                {unit && <span className="text-4xl font-bold text-white/90">{unit}</span>}
              </div>
              {targetValue && <span className="text-3xl font-bold text-white/90 mt-2">{Math.round(progress)}%</span>}
            </div>
          </div>

          <h3 className="text-2xl font-black text-white text-center leading-tight drop-shadow-md">{name}</h3>
        </div>
      </Card>
    </Link>
  )
}
