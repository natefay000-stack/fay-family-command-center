import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle2, Circle, Sparkles } from "lucide-react"
import { isTuesday, getWeekStartDate } from "@/lib/utils/check-in-helpers"
import Link from "next/link"

export async function CheckInBanner() {
  const supabase = await createClient()

  if (!supabase) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get user's profile to check timezone
  const { data: profile } = await supabase.from("profiles").select("timezone").eq("id", user.id).single()

  const timezone = profile?.timezone || "America/New_York"

  if (!isTuesday(timezone)) return null

  // Get or create this week's session
  const weekStart = getWeekStartDate()

  let { data: session } = await supabase.from("weekly_sessions").select("*").eq("week_start_date", weekStart).single()

  if (!session) {
    const { data: newSession } = await supabase
      .from("weekly_sessions")
      .insert({ week_start_date: weekStart })
      .select()
      .single()
    session = newSession
  }

  if (!session) return null

  // Get all family members and their check-in status
  const { data: familyMembers } = await supabase.from("profiles").select("id, full_name")

  const { data: checkIns } = await supabase.from("check_ins").select("user_id").eq("session_id", session.id)

  const completedUserIds = new Set(checkIns?.map((c) => c.user_id) || [])
  const currentUserCompleted = completedUserIds.has(user.id)

  return (
    <Card className="bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 border-primary/30">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="p-3 rounded-full bg-primary/20">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-1">It's Check-in Day!</h3>
              <p className="text-muted-foreground mb-4">
                {currentUserCompleted
                  ? "Great job! You've completed your check-in. See how your family is doing."
                  : "How was your week? Take a few minutes to reflect and share with your family."}
              </p>

              {/* Family avatars */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium">Family Status:</span>
                <div className="flex gap-2">
                  {familyMembers?.map((member) => {
                    const completed = completedUserIds.has(member.id)
                    const initials = member.full_name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()

                    return (
                      <div key={member.id} className="relative group">
                        <Avatar className={completed ? "ring-2 ring-green-500" : "ring-2 ring-muted"}>
                          <AvatarFallback className={completed ? "bg-green-100" : "bg-muted"}>
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        {completed ? (
                          <CheckCircle2 className="absolute -top-1 -right-1 h-4 w-4 text-green-500 bg-background rounded-full" />
                        ) : (
                          <Circle className="absolute -top-1 -right-1 h-4 w-4 text-muted-foreground bg-background rounded-full" />
                        )}
                        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-md border">
                          {member.full_name}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {currentUserCompleted ? (
              <Button asChild variant="outline">
                <Link href="/check-in/family">View Family Check-ins</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/check-in">Start Check-in</Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
