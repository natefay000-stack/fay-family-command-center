"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, Minus } from "lucide-react"

interface GoalCardProps {
  goal: {
    id: number
    title: string
    progress: number
    target: number
    category: string
  }
  onUpdate: (progress: number) => void
}

export function GoalCard({ goal, onUpdate }: GoalCardProps) {
  const percentage = Math.round((goal.progress / goal.target) * 100)

  return (
    <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-balance">{goal.title}</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
              {goal.category}
            </span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{percentage}%</div>
          </div>
        </div>
      </div>

      <Progress value={percentage} className="h-2" />

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {goal.progress.toLocaleString()} / {goal.target.toLocaleString()}
        </span>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 bg-transparent"
            onClick={() => onUpdate(Math.max(0, goal.progress - 1))}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 bg-transparent"
            onClick={() => onUpdate(Math.min(goal.target, goal.progress + 1))}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
