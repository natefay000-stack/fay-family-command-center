import { createClient } from "@/lib/supabase/server"
import { CalendarView } from "@/components/calendar-view"

export default async function CalendarPage() {
  const supabase = await createClient()

  if (!supabase) {
    return null
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Fetch metrics for the year
  const { data: metrics } = await supabase
    .from("metrics")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", "2026-01-01")
    .lte("date", "2026-12-31")
    .order("date", { ascending: true })

  // Fetch milestones
  const { data: milestones } = await supabase
    .from("milestones")
    .select("*, goal:goals!inner(*)")
    .eq("goal.user_id", user.id)
    .gte("due_date", "2026-01-01")
    .lte("due_date", "2026-12-31")

  return (
    <div className="container mx-auto px-4 py-8">
      <CalendarView metrics={metrics || []} milestones={milestones || []} />
    </div>
  )
}
