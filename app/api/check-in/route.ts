import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { session_id, user_id, overall_rating, wins, struggles, next_week_focus, priority_metrics, flagged_metrics } =
      body

    // Verify user_id matches authenticated user
    if (user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Insert check-in
    const { data: checkIn, error } = await supabase
      .from("check_ins")
      .insert({
        user_id,
        session_id,
        overall_rating,
        wins,
        struggles,
        next_week_focus,
        priority_metrics,
        flagged_metrics,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating check-in:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, checkIn })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
