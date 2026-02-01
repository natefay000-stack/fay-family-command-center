import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

// Cron job for checking achievements and streaks
// Run this frequently (e.g., every hour) to catch achievements
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET || "dev-cron-secret"

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create admin Supabase client
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const internalSecret = process.env.INTERNAL_API_SECRET || "dev-secret"
    const results = {
      target_achieved: 0,
      streak_alerts: 0,
    }

    // Check for newly achieved goals (in the last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    const { data: goals } = await supabaseAdmin
      .from("goals")
      .select("*, profile:profiles(id, full_name)")
      .gte("current_value", supabaseAdmin.rpc("target_value"))
      .gte("updated_at", oneHourAgo)

    for (const goal of goals || []) {
      // Check if we already sent a notification
      const { data: existingNotif } = await supabaseAdmin
        .from("notifications")
        .select("id")
        .eq("user_id", goal.user_id)
        .eq("type", "target_achieved")
        .ilike("message", `%${goal.title}%`)
        .gte("created_at", oneHourAgo)
        .single()

      if (existingNotif) continue

      // Notify all family members
      const { data: familyMembers } = await supabaseAdmin
        .from("profiles")
        .select("id, phone, phone_verified, notification_preferences")

      for (const member of familyMembers || []) {
        const prefs = member.notification_preferences || {}
        if (prefs.target_achieved === false) continue

        await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/notifications/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${internalSecret}`,
          },
          body: JSON.stringify({
            user_id: member.id,
            notification_type: "target_achieved",
            title: "Goal Achieved!",
            message: `${goal.profile.full_name} just hit their ${goal.title} goal of ${goal.target_value} ${goal.unit}!`,
            link: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/family`,
            send_sms: member.phone_verified,
          }),
        })

        results.target_achieved++
      }
    }

    // Check for streaks
    const { data: profiles } = await supabaseAdmin.from("profiles").select("id, full_name")

    for (const profile of profiles || []) {
      // Get unique metric names for this user
      const { data: metrics } = await supabaseAdmin
        .from("metrics")
        .select("metric_name")
        .eq("user_id", profile.id)
        .order("metric_name")

      const uniqueMetrics = [...new Set(metrics?.map((m) => m.metric_name) || [])]

      for (const metricName of uniqueMetrics) {
        // Count consecutive days
        const { data: recentMetrics } = await supabaseAdmin
          .from("metrics")
          .select("date")
          .eq("user_id", profile.id)
          .eq("metric_name", metricName)
          .order("date", { ascending: false })
          .limit(30)

        if (!recentMetrics || recentMetrics.length === 0) continue

        // Calculate streak
        let streak = 0
        const today = new Date().toISOString().split("T")[0]
        let currentDate = new Date(today)

        for (const metric of recentMetrics) {
          const metricDate = metric.date.split("T")[0]
          const expectedDate = currentDate.toISOString().split("T")[0]

          if (metricDate === expectedDate) {
            streak++
            currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000)
          } else {
            break
          }
        }

        // Check if this is a milestone streak (7, 14, 30, etc.)
        const milestones = [7, 14, 30, 60, 90, 180, 365]
        if (!milestones.includes(streak)) continue

        // Check if we already sent a notification for this streak
        const { data: existingNotif } = await supabaseAdmin
          .from("notifications")
          .select("id")
          .eq("user_id", profile.id)
          .eq("type", "streak_alert")
          .ilike("message", `%${streak}-day%`)
          .ilike("message", `%${metricName}%`)
          .gte("created_at", oneHourAgo)
          .single()

        if (existingNotif) continue

        // Notify all family members
        const { data: familyMembers } = await supabaseAdmin
          .from("profiles")
          .select("id, phone, phone_verified, notification_preferences")

        for (const member of familyMembers || []) {
          const prefs = member.notification_preferences || {}
          if (prefs.streak_alert === false) continue

          await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/notifications/send`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${internalSecret}`,
            },
            body: JSON.stringify({
              user_id: member.id,
              notification_type: "streak_alert",
              title: "Streak Milestone!",
              message: `${profile.full_name} is on a ${streak}-day ${metricName} streak! Keep it up!`,
              link: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/family`,
              send_sms: member.phone_verified,
            }),
          })

          results.streak_alerts++
        }
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error("[v0] Achievement cron error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
