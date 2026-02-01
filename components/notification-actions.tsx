"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function NotificationActions({ userId }: { userId: string }) {
  const router = useRouter()
  const supabase = createClient()

  const markAllAsRead = async () => {
    try {
      await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false)

      router.refresh()
    } catch (error) {
      console.error("[v0] Error marking all as read:", error)
    }
  }

  return (
    <Button onClick={markAllAsRead} variant="outline" size="sm">
      <CheckCircle2 className="mr-2 h-4 w-4" />
      Mark All as Read
    </Button>
  )
}
