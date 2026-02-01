"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Clock, Award, TrendingUp, Calendar, Flame } from "lucide-react"

const NOTIFICATION_TYPES = [
  {
    key: "check_in_reminder",
    label: "Check-in Reminder",
    description: "Tuesday reminder to complete your weekly check-in",
    icon: Calendar,
    hasTime: true,
    timeKey: "check_in_time",
  },
  {
    key: "daily_log_reminder",
    label: "Daily Log Reminder",
    description: "Reminder to log your daily metrics",
    icon: Clock,
    hasTime: true,
    timeKey: "daily_log_time",
  },
  {
    key: "target_achieved",
    label: "Target Achieved",
    description: "Celebrate when you or a family member hits a goal",
    icon: Award,
    hasTime: false,
  },
  {
    key: "weekly_summary",
    label: "Weekly Summary",
    description: "Family check-in summary sent Wednesday morning",
    icon: TrendingUp,
    hasTime: false,
  },
  {
    key: "streak_alert",
    label: "Streak Alerts",
    description: "Celebrate milestone streaks (7, 14, 30+ days)",
    icon: Flame,
    hasTime: false,
  },
]

export function NotificationToggles({
  preferences,
  userId,
}: {
  preferences: Record<string, any>
  userId: string
}) {
  const [prefs, setPrefs] = useState(preferences)
  const [saving, setSaving] = useState(false)

  const handleToggle = (key: string, value: boolean) => {
    setPrefs({ ...prefs, [key]: value })
  }

  const handleTimeChange = (key: string, value: string) => {
    setPrefs({ ...prefs, [key]: value })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/notifications/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: prefs }),
      })

      if (!response.ok) throw new Error("Failed to save preferences")

      // Reload page to show updated preferences
      window.location.reload()
    } catch (error) {
      console.error("[v0] Error saving preferences:", error)
      alert("Failed to save preferences")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {NOTIFICATION_TYPES.map((type) => {
        const Icon = type.icon
        const isEnabled = prefs[type.key] !== false

        return (
          <Card key={type.key} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <Label htmlFor={type.key} className="text-base font-semibold cursor-pointer">
                    {type.label}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">{type.description}</p>

                  {type.hasTime && isEnabled && (
                    <div className="mt-3 flex items-center gap-2">
                      <Label htmlFor={`${type.key}-time`} className="text-sm">
                        Time:
                      </Label>
                      <Input
                        id={`${type.key}-time`}
                        type="time"
                        value={prefs[type.timeKey!] || "09:00"}
                        onChange={(e) => handleTimeChange(type.timeKey!, e.target.value)}
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              </div>
              <Switch id={type.key} checked={isEnabled} onCheckedChange={(value) => handleToggle(type.key, value)} />
            </div>
          </Card>
        )
      })}

      <div className="flex gap-3 pt-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  )
}
