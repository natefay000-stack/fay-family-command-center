import { createClient } from "@/lib/supabase/server"
import { GoalsView } from "@/components/goals-view"

export default async function GoalsPage() {
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

  // Fetch user's goals with milestones
  const { data: goals } = await supabase
    .from("goals")
    .select("*, milestones(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <GoalsView initialGoals={goals || []} />
    </div>
  )
}
