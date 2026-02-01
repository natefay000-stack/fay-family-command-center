import { createClient } from "@/lib/supabase/server"
import { CheckInsView } from "@/components/check-ins-view"

export default async function CheckInsPage() {
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

  // Fetch user's check-ins
  const { data: checkIns } = await supabase
    .from("check_ins")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <CheckInsView initialCheckIns={checkIns || []} />
    </div>
  )
}
