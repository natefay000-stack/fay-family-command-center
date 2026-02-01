import { createClient } from "@/lib/supabase/server"
import { sendSMS, generateVerificationCode } from "@/lib/twilio/client"
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

    const { phone } = await request.json()

    if (!phone || !/^\+?[1-9]\d{1,14}$/.test(phone.replace(/\s/g, ""))) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 })
    }

    // Generate verification code
    const code = generateVerificationCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Save verification code to database
    const { error: dbError } = await supabase.from("verification_codes").insert({
      user_id: user.id,
      phone,
      code,
      expires_at: expiresAt.toISOString(),
    })

    if (dbError) {
      console.error("[v0] Error saving verification code:", dbError)
      return NextResponse.json({ error: "Failed to create verification code" }, { status: 500 })
    }

    // Send SMS
    const result = await sendSMS(phone, `Your Fay Goals verification code is: ${code}. Valid for 10 minutes.`)

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to send SMS" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
