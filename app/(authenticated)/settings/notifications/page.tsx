import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PhoneVerification } from "@/components/phone-verification"
import { NotificationToggles } from "@/components/notification-toggles"
import { Bell } from "lucide-react"

export default async function NotificationSettingsPage() {
  const supabase = await createClient()

  if (!supabase) {
    redirect("/demo/dashboard")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("phone, phone_verified, notification_preferences")
    .eq("id", user.id)
    .single()

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Bell className="h-8 w-8" />
          Notification Settings
        </h1>
        <p className="text-muted-foreground">Manage your SMS notifications and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Phone Verification</CardTitle>
          <CardDescription>Verify your phone number to receive SMS notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <PhoneVerification
            currentPhone={profile?.phone || null}
            isVerified={profile?.phone_verified || false}
            userId={user.id}
          />
        </CardContent>
      </Card>

      {profile?.phone_verified && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose which notifications you want to receive via SMS</CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationToggles preferences={profile.notification_preferences || {}} userId={user.id} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
