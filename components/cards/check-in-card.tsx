"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface CheckInCardProps {
  isToday: boolean
  daysUntil: number
  familyMembers: Array<{
    id: string
    name: string
    completed: boolean
  }>
}

export function CheckInCard({ isToday, daysUntil, familyMembers }: CheckInCardProps) {
  const completedCount = familyMembers.filter((m) => m.completed).length
  const totalCount = familyMembers.length

  return (
    <Card className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 min-h-[320px] lg:min-h-[400px]">
      {/* Visual Area */}
      <div className="h-full flex flex-col p-8 lg:p-12">
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="text-[100px] lg:text-[120px] leading-none">📅</div>
          <div className="text-center">
            <p className="text-lg lg:text-xl text-gray-600 font-semibold">Tuesday Check-in</p>
            {isToday ? (
              <p className="text-4xl lg:text-5xl font-black text-navy-dark mt-2">Today!</p>
            ) : (
              <p className="text-2xl lg:text-3xl font-bold text-gray-700 mt-2">
                in {daysUntil} day{daysUntil !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-3">
          {/* Family Status */}
          <div className="flex items-center justify-between">
            <span className="text-base lg:text-lg text-gray-600 font-medium">Family Progress</span>
            <span className="text-xl lg:text-2xl font-bold text-navy-dark">
              {completedCount}/{totalCount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {familyMembers.map((member) => {
              const initials = member.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
              return (
                <div key={member.id} className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={member.completed ? "bg-accent-lime/20 text-foreground" : "bg-gray-100"}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {member.completed && (
                    <div className="absolute -bottom-1 -right-1 bg-accent-lime rounded-full p-0.5">
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <Button
            asChild
            className="w-full bg-navy-dark hover:bg-navy-dark/90 h-12 lg:h-14 text-base lg:text-lg font-semibold"
            size="lg"
          >
            <Link href="/check-in">{isToday ? "Start Check-in" : "View Check-ins"}</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
