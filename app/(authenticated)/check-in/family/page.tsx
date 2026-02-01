import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, TrendingUp, Users, MessageCircle } from "lucide-react"
import { getWeekStartDate } from "@/lib/utils/check-in-helpers"
import Link from "next/link"

const RATING_EMOJI = ["", "😓", "😕", "😊", "😄", "🔥"]

export default async function FamilyCheckInPage() {
  const supabase = await createClient()

  if (!supabase) {
    redirect("/demo/dashboard")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get this week's session
  const weekStart = getWeekStartDate()

  const { data: session } = await supabase.from("weekly_sessions").select("*").eq("week_start_date", weekStart).single()

  if (!session) {
    redirect("/dashboard")
  }

  // Check if current user completed check-in
  const { data: myCheckIn } = await supabase
    .from("check_ins")
    .select("*")
    .eq("user_id", user.id)
    .eq("session_id", session.id)
    .single()

  if (!myCheckIn) {
    redirect("/check-in")
  }

  // Get all family check-ins
  const { data: checkIns } = await supabase
    .from("check_ins")
    .select("*, profile:profiles(id, full_name, role)")
    .eq("session_id", session.id)
    .order("completed_at", { ascending: false })

  // Get comments for each check-in
  const { data: comments } = await supabase
    .from("check_in_comments")
    .select("*, profile:profiles(full_name)")
    .in("check_in_id", checkIns?.map((c) => c.id) || [])

  const commentsByCheckIn: Record<string, any[]> = {}
  comments?.forEach((comment) => {
    if (!commentsByCheckIn[comment.check_in_id]) {
      commentsByCheckIn[comment.check_in_id] = []
    }
    commentsByCheckIn[comment.check_in_id].push(comment)
  })

  const averageRating =
    checkIns && checkIns.length > 0
      ? (checkIns.reduce((sum, c) => sum + c.overall_rating, 0) / checkIns.length).toFixed(1)
      : "0"

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Family Check-ins</h1>
        <p className="text-muted-foreground">
          Week of {new Date(weekStart).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating} / 5</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checkIns?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Encouragements</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comments?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Check-ins */}
      <div className="space-y-6">
        {checkIns?.map((checkIn) => {
          const initials = checkIn.profile.full_name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()

          return (
            <Card key={checkIn.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{checkIn.profile.full_name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl">{RATING_EMOJI[checkIn.overall_rating]}</span>
                        <Badge variant="secondary" className="capitalize">
                          {checkIn.profile.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(checkIn.completed_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {checkIn.wins && (
                  <div>
                    <h4 className="text-sm font-semibold text-green-600 mb-1 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Wins
                    </h4>
                    <p className="text-sm">{checkIn.wins}</p>
                  </div>
                )}

                {checkIn.struggles && (
                  <div>
                    <h4 className="text-sm font-semibold text-orange-600 mb-1">Struggles</h4>
                    <p className="text-sm">{checkIn.struggles}</p>
                  </div>
                )}

                {checkIn.next_week_focus && (
                  <div>
                    <h4 className="text-sm font-semibold text-blue-600 mb-1">Next Week Focus</h4>
                    <p className="text-sm">{checkIn.next_week_focus}</p>
                  </div>
                )}

                {/* Comments section would go here */}
                {commentsByCheckIn[checkIn.id] && commentsByCheckIn[checkIn.id].length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-semibold mb-2">Encouragements</h4>
                    <div className="space-y-2">
                      {commentsByCheckIn[checkIn.id].map((comment) => (
                        <div key={comment.id} className="text-sm bg-muted p-3 rounded">
                          <p className="font-medium text-xs text-muted-foreground mb-1">{comment.profile.full_name}</p>
                          <p>{comment.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-center pt-4">
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
