import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CheckInFlow } from "@/components/check-in-flow"
import { getWeekStartDate } from "@/lib/utils/check-in-helpers"

export default async function CheckInPage() {
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

  let { data: session } = await supabase.from("weekly_sessions").select("*").eq("week_start_date", weekStart).single()

  if (!session) {
    const { data: newSession } = await supabase
      .from("weekly_sessions")
      .insert({ week_start_date: weekStart })
      .select()
      .single()
    session = newSession
  }

  if (!session) {
    return <div>Error loading check-in session</div>
  }

  // Check if user already completed check-in
  const { data: existingCheckIn } = await supabase
    .from("check_ins")
    .select("*")
    .eq("user_id", user.id)
    .eq("session_id", session.id)
    .single()

  if (existingCheckIn) {
    redirect("/check-in/family")
  }

  // Fetch user's metrics for analysis
  const { data: goals } = await supabase.from("goals").select("*").eq("user_id", user.id).eq("status", "active")

  const { data: metrics } = await supabase
    .from("metrics")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order("date", { ascending: true })

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <CheckInFlow sessionId={session.id} userId={user.id} goals={goals || []} metrics={metrics || []} />
    </div>
  )
}
