// Twilio client setup
// Environment variables needed:
// - TWILIO_ACCOUNT_SID
// - TWILIO_AUTH_TOKEN
// - TWILIO_PHONE_NUMBER

export async function sendSMS(
  to: string,
  message: string,
): Promise<{ success: boolean; sid?: string; error?: string }> {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.TWILIO_PHONE_NUMBER

    if (!accountSid || !authToken || !fromNumber) {
      console.error("[v0] Twilio credentials not configured")
      return { success: false, error: "Twilio not configured" }
    }

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: to,
        From: fromNumber,
        Body: message,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("[v0] Twilio API error:", error)
      return { success: false, error: "Failed to send SMS" }
    }

    const data = await response.json()
    return { success: true, sid: data.sid }
  } catch (error) {
    console.error("[v0] Error sending SMS:", error)
    return { success: false, error: "Failed to send SMS" }
  }
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
