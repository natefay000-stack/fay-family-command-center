"use client"

import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"

interface AddCardProps {
  type: "goal" | "metric"
}

export function AddCard({ type }: AddCardProps) {
  const labels = {
    goal: "Add New Goal",
    metric: "Track New Metric",
  }

  return (
    <Link href={type === "goal" ? "/goals" : "/metrics"} className="block group">
      <Card className="bg-white rounded-3xl border-2 border-dashed border-gray-300 hover:border-navy-dark/50 hover:shadow-lg transition-all duration-300 min-h-[320px] lg:min-h-[400px] group-hover:scale-[1.02]">
        <div className="h-full flex flex-col items-center justify-center p-8 lg:p-12 gap-6">
          <div className="w-[120px] h-[120px] lg:w-[150px] lg:h-[150px] rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors flex items-center justify-center">
            <Plus
              className="h-16 w-16 lg:h-20 lg:w-20 text-gray-400 group-hover:text-navy-dark transition-colors"
              strokeWidth={2.5}
            />
          </div>

          <p className="text-xl lg:text-2xl font-bold text-gray-500 group-hover:text-navy-dark transition-colors text-center">
            {labels[type]}
          </p>
        </div>
      </Card>
    </Link>
  )
}
