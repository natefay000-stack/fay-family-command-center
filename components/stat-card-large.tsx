"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardLargeProps {
  icon: LucideIcon
  label: string
  value: string | number
  subtitle?: string
  color: "pink" | "blue" | "green" | "yellow" | "purple" | "orange"
}

export function StatCardLarge({ icon: Icon, label, value, subtitle, color }: StatCardLargeProps) {
  const colorMap = {
    pink: "bg-pastel-pink text-pastel-pink",
    blue: "bg-pastel-blue text-pastel-blue",
    green: "bg-pastel-green text-pastel-green",
    yellow: "bg-pastel-yellow text-pastel-yellow",
    purple: "bg-pastel-purple text-pastel-purple",
    orange: "bg-pastel-orange text-pastel-orange",
  }

  const [bgClass, textClass] = colorMap[color].split(" ")

  return (
    <Card className={`${bgClass} border-none shadow-sm hover:shadow-md transition-shadow h-full`}>
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-xl bg-white/60 backdrop-blur-sm`}>
            <Icon className={`h-6 w-6 ${textClass}`} />
          </div>
          <p className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">{label}</p>
        </div>
        <div className="mt-auto">
          <div className={`text-5xl font-bold mb-2 ${textClass}`}>{value}</div>
          {subtitle && <p className="text-sm text-foreground/70 font-medium">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
