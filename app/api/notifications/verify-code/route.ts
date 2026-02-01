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

    const { code, phone } = await request.json()

    if (!code || !phone) {
      return NextResponse.json({ error: "Code and phone required" }, { status: 400 })
    }

    // Find verification code
    const { data: verificationCode, error: findError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("user_id", user.id)
      .eq("phone", phone)
      .eq("code", code)
      .eq("verified", false)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (findError || !verificationCode) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 })
    }

    // Mark as verified
    const { error: updateCodeError } = await supabase
      .from("verification_codes")
      .update({ verified: true })
      .eq("id", verificationCode.id)

    if (updateCodeError) {
      console.error("[v0] Error updating verification code:", updateCodeError)
      return NextResponse.json({ error: "Failed to verify code" }, { status: 500 })
    }

    // Update user profile
    const { error: updateProfileError } = await supabase
      .from("profiles")
      .update({ phone, phone_verified: true })
      .eq("id", user.id)

    if (updateProfileError) {
      console.error("[v0] Error updating profile:", updateProfileError)
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
