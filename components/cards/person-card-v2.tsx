"use client"

import { Card } from "@/components/ui/card"
import Link from "next/link"

interface PersonCardProps {
  id: string
  name: string
  role: string
  weekRating: number
  activeGoals: number
  streak: number
  logsToday: number
}

const roleColors: Record<string, string> = {
  parent: "bg-navy-dark",
  child: "bg-sky-blue",
}

export function PersonCard({ id, name, role, weekRating, activeGoals, streak }: PersonCardProps) {
  const bgColor = roleColors[role] || roleColors.child

  const ratingEmojis = ["😢", "😕", "😐", "😊", "🔥"]
  const ratingEmoji = ratingEmojis[weekRating - 1] || "😐"

  return (
    <Link href={`/family#${id}`} className="block group">
      <Card
        className={`${bgColor} rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:scale-[1.03] border-0 aspect-square`}
      >
        <div className="h-full flex flex-col p-8">
          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              <div className="w-[220px] h-[220px] rounded-full bg-white/20 flex items-center justify-center">
                <div style={{ fontSize: "180px", lineHeight: 1 }}>{ratingEmoji}</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-3xl font-black text-white leading-tight">{name}</h3>
            <div className="flex items-center gap-4">
              <p className="text-2xl font-bold text-white/90">{activeGoals} Goals</p>
              <p className="text-2xl font-bold text-white/90">{streak} 🔥</p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
