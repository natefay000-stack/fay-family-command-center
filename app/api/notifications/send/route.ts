import { createClient } from "@/lib/supabase/server"
import { sendSMS } from "@/lib/twilio/client"
import { type NextRequest, NextResponse } from "next/server"

// Internal route for sending notifications
export async function POST(request: NextRequest) {
  try {
    // Verify internal request (you might want to add a secret header)
    const authHeader = request.headers.get("authorization")
    const internalSecret = process.env.INTERNAL_API_SECRET || "dev-secret"

    if (authHeader !== `Bearer ${internalSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user_id, notification_type, title, message, link, send_sms } = await request.json()

    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

    // Create in-app notification
    const { error: notifError } = await supabase.from("notifications").insert({
      user_id,
      type: notification_type,
      title,
      message,
      link,
      sent_via_sms: send_sms,
    })

    if (notifError) {
      console.error("[v0] Error creating notification:", notifError)
    }

    // Send SMS if requested
    if (send_sms) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("phone, phone_verified, notification_preferences")
        .eq("id", user_id)
        .single()

      if (profile?.phone_verified && profile.phone) {
        const preferences = profile.notification_preferences || {}

        // Check if user has this notification type enabled
        if (preferences[notification_type] !== false) {
          const smsMessage = `${title}\n\n${message}${link ? `\n\n${link}` : ""}`
          const result = await sendSMS(profile.phone, smsMessage)

          // Log SMS send
          await supabase.from("notification_sends").insert({
            user_id,
            notification_type,
            phone: profile.phone,
            status: result.success ? "sent" : "failed",
            twilio_sid: result.sid,
            error_message: result.error,
          })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
