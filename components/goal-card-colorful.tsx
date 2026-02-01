"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ChevronRight, CheckCircle2 } from "lucide-react"
import { getEmojiForGoal, getColorForCategory } from "@/lib/utils/emoji-helper"
import Link from "next/link"

interface Goal {
  id: string
  title: string
  category: string
  current_value: number
  target_value: number
  unit: string
  status: string
  emoji?: string
}

export function GoalCardColorful({ goal }: { goal: Goal }) {
  const progress = goal.target_value > 0 ? (goal.current_value / goal.target_value) * 100 : 0
  const emoji = goal.emoji || getEmojiForGoal(goal.category)
  const color = getColorForCategory(goal.category)
  const isCompleted = goal.current_value >= goal.target_value && goal.target_value > 0

  return (
    <Card className={`${color.bg} border-none shadow-sm hover:shadow-md transition-all h-full`}>
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="text-4xl flex-shrink-0">{emoji}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-2 truncate">{goal.title}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-base font-semibold ${color.text}`}>
                  {goal.current_value} / {goal.target_value} {goal.unit}
                </span>
                {isCompleted && <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />}
              </div>
            </div>
          </div>
          <Link href={`/goals/${goal.id}`}>
            <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        <div className="mt-auto space-y-3">
          <Progress value={progress} className="h-2.5" />
          <div className="flex items-center justify-between text-sm">
            <span className="capitalize text-muted-foreground font-medium">{goal.category}</span>
            <span className={`font-semibold ${color.text}`}>{Math.round(progress)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
