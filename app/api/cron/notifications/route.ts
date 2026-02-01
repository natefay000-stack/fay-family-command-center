import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { isTuesday, getWeekStartDate } from "@/lib/utils/check-in-helpers"

// Cron job for sending scheduled notifications
// Secure with CRON_SECRET environment variable
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET || "dev-cron-secret"

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create admin Supabase client (bypasses RLS)
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { searchParams } = new URL(request.url)
    const jobType = searchParams.get("type") || "all"

    const results = {
      check_in_reminders: 0,
      daily_log_reminders: 0,
      weekly_summaries: 0,
    }

    const internalSecret = process.env.INTERNAL_API_SECRET || "dev-secret"

    // Tuesday Check-in Reminders
    if (jobType === "all" || jobType === "check_in") {
      const { data: profiles } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name, phone, phone_verified, notification_preferences, timezone")

      for (const profile of profiles || []) {
        if (!isTuesday(profile.timezone)) continue

        const prefs = profile.notification_preferences || {}
        if (prefs.check_in_reminder === false) continue

        // Check if already completed this week
        const weekStart = getWeekStartDate()
        const { data: session } = await supabaseAdmin
          .from("weekly_sessions")
          .select("id")
          .eq("week_start_date", weekStart)
          .single()

        if (session) {
          const { data: checkIn } = await supabaseAdmin
            .from("check_ins")
            .select("id")
            .eq("user_id", profile.id)
            .eq("session_id", session.id)
            .single()

          if (checkIn) continue // Already completed
        }

        // Send notification
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/notifications/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${internalSecret}`,
          },
          body: JSON.stringify({
            user_id: profile.id,
            notification_type: "check_in_reminder",
            title: "It's Check-in Day!",
            message: `Hey ${profile.full_name}! How was your week? Take a few minutes to complete your check-in.`,
            link: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/check-in`,
            send_sms: profile.phone_verified,
          }),
        })

        results.check_in_reminders++
      }
    }

    // Daily Log Reminders
    if (jobType === "all" || jobType === "daily_log") {
      const { data: profiles } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name, phone, phone_verified, notification_preferences")

      for (const profile of profiles || []) {
        const prefs = profile.notification_preferences || {}
        if (prefs.daily_log_reminder === false) continue

        // Check if user logged anything today
        const today = new Date().toISOString().split("T")[0]
        const { data: metrics } = await supabaseAdmin
          .from("metrics")
          .select("id")
          .eq("user_id", profile.id)
          .eq("date", today)
          .limit(1)

        if (metrics && metrics.length > 0) continue // Already logged today

        // Send notification
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/notifications/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${internalSecret}`,
          },
          body: JSON.stringify({
            user_id: profile.id,
            notification_type: "daily_log_reminder",
            title: "Don't Forget to Log Today!",
            message: "Take a moment to track your daily metrics and keep your progress on track.",
            link: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/metrics`,
            send_sms: profile.phone_verified,
          }),
        })

        results.daily_log_reminders++
      }
    }

    // Wednesday Weekly Summary
    if (jobType === "all" || jobType === "weekly_summary") {
      const now = new Date()
      const dayName = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(now)

      if (dayName === "Wednesday") {
        // Get last week's session
        const lastWeekStart = getWeekStartDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))

        const { data: session } = await supabaseAdmin
          .from("weekly_sessions")
          .select("*")
          .eq("week_start_date", lastWeekStart)
          .single()

        if (session) {
          // Get all check-ins for this session
          const { data: checkIns } = await supabaseAdmin
            .from("check_ins")
            .select("*, profile:profiles(full_name)")
            .eq("session_id", session.id)

          const averageRating =
            checkIns && checkIns.length > 0
              ? (checkIns.reduce((sum, c) => sum + c.overall_rating, 0) / checkIns.length).toFixed(1)
              : "0"

          // Count milestones (you might want to track this differently)
          const milestonesHit = 0 // Implement milestone counting logic

          // Send to all family members
          const { data: profiles } = await supabaseAdmin
            .from("profiles")
            .select("id, full_name, phone, phone_verified, notification_preferences")

          for (const profile of profiles || []) {
            const prefs = profile.notification_preferences || {}
            if (prefs.weekly_summary === false) continue

            await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/notifications/send`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${internalSecret}`,
              },
              body: JSON.stringify({
                user_id: profile.id,
                notification_type: "weekly_summary",
                title: "Family Check-in Complete!",
                message: `Fay family check-in summary: ${checkIns?.length || 0} members participated with an average rating of ${averageRating}/5. Great work!`,
                link: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/check-in/family`,
                send_sms: profile.phone_verified,
              }),
            })

            results.weekly_summaries++
          }
        }
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error("[v0] Cron job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
