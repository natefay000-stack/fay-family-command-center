import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar, Award, TrendingUp, Flame, MessageCircle } from "lucide-react"
import Link from "next/link"
import { NotificationActions } from "@/components/notification-actions"

const NOTIFICATION_ICONS = {
  check_in_reminder: Calendar,
  daily_log_reminder: Bell,
  target_achieved: Award,
  weekly_summary: TrendingUp,
  streak_alert: Flame,
  comment: MessageCircle,
}

export default async function NotificationsPage() {
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

  // Fetch all notifications
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const unreadCount = notifications?.filter((n) => !n.read).length || 0

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return "Just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Notifications
          </h1>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "You're all caught up!"}
          </p>
        </div>
        {unreadCount > 0 && <NotificationActions userId={user.id} />}
      </div>

      {notifications && notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = NOTIFICATION_ICONS[notification.type as keyof typeof NOTIFICATION_ICONS] || Bell

            return (
              <Card
                key={notification.id}
                className={`transition-colors ${!notification.read ? "border-primary/50 bg-primary/5" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${!notification.read ? "bg-primary/20" : "bg-muted"}`}>
                      <Icon className={`h-5 w-5 ${!notification.read ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-base">{notification.title}</h3>
                        {!notification.read && (
                          <Badge variant="default" className="flex-shrink-0">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{getTimeAgo(notification.created_at)}</span>
                        {notification.sent_via_sms && (
                          <Badge variant="outline" className="text-xs">
                            SMS Sent
                          </Badge>
                        )}
                      </div>
                      {notification.link && (
                        <Link
                          href={notification.link}
                          className="text-sm text-primary hover:underline mt-2 inline-block"
                        >
                          View Details →
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16">
            <div className="text-center text-muted-foreground">
              <Bell className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No notifications yet</p>
              <p className="text-sm">When you receive notifications, they'll appear here</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
