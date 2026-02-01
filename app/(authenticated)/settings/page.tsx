import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarSettings } from "@/components/calendar-settings"
import { Settings, Bell, Calendar, User } from "lucide-react"
import Link from "next/link"

export default async function SettingsPage() {
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

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Settings className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="#profile">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>View and manage your profile information</CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/settings/notifications">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Configure SMS notifications and reminders</CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="#calendar">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Set up calendar subscription and sync</CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Profile Section */}
      <Card id="profile">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your basic account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <p className="text-lg">{profile.full_name}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <p className="text-lg">{profile.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Role</label>
            <p className="text-lg capitalize">{profile.role}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Timezone</label>
            <p className="text-lg">{profile.timezone || "America/New_York"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Settings */}
      <div id="calendar">
        <CalendarSettings userId={user.id} userName={profile.full_name} />
      </div>

      {/* Notification Settings Link */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/settings/notifications">
              <Bell className="mr-2 h-4 w-4" />
              Configure Notifications
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
