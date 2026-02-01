"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Copy, Check, RefreshCw, Calendar } from "lucide-react"

interface CalendarSettingsProps {
  userId: string
  userName: string
}

export function CalendarSettings({ userId, userName }: CalendarSettingsProps) {
  const [copied, setCopied] = useState(false)
  const [preferences, setPreferences] = useState({
    includeMilestones: true,
    includeGoalDeadlines: true,
    includeCheckIns: true,
  })

  const calendarUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/api/calendar/${userId}/feed.ics`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(calendarUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Calendar Subscription
        </CardTitle>
        <CardDescription>Subscribe to your Fay Goals calendar in any calendar app</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Calendar URL */}
        <div className="space-y-2">
          <Label>Your Calendar URL</Label>
          <div className="flex gap-2">
            <Input value={calendarUrl} readOnly className="font-mono text-sm" />
            <Button variant="outline" size="icon" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Use this URL to subscribe to your calendar in any calendar app
          </p>
        </div>

        {/* Setup Instructions */}
        <div className="space-y-3 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold text-sm">Setup Instructions</h4>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium mb-1">iPhone/iPad:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Open Settings and go to Calendar</li>
                <li>Tap Accounts, then Add Account</li>
                <li>Select Other, then Add Subscribed Calendar</li>
                <li>Paste your calendar URL and tap Next</li>
                <li>Tap Save to finish</li>
              </ol>
            </div>
            <div>
              <p className="font-medium mb-1">Google Calendar:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Open Google Calendar on your computer</li>
                <li>Click the + next to Other calendars</li>
                <li>Select From URL</li>
                <li>Paste your calendar URL and click Add calendar</li>
              </ol>
            </div>
            <div>
              <p className="font-medium mb-1">Apple Calendar (Mac):</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Open Calendar app</li>
                <li>Go to File and click New Calendar Subscription</li>
                <li>Paste your calendar URL and click Subscribe</li>
                <li>Choose update frequency and click OK</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Calendar Preferences */}
        <div className="space-y-4">
          <h4 className="font-semibold">What to Include</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="milestones"
                checked={preferences.includeMilestones}
                onCheckedChange={(checked) => setPreferences({ ...preferences, includeMilestones: checked as boolean })}
              />
              <Label htmlFor="milestones" className="cursor-pointer">
                Milestone due dates
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="goals"
                checked={preferences.includeGoalDeadlines}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, includeGoalDeadlines: checked as boolean })
                }
              />
              <Label htmlFor="goals" className="cursor-pointer">
                Goal target dates
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="checkins"
                checked={preferences.includeCheckIns}
                onCheckedChange={(checked) => setPreferences({ ...preferences, includeCheckIns: checked as boolean })}
              />
              <Label htmlFor="checkins" className="cursor-pointer">
                Weekly check-in reminders (Tuesdays)
              </Label>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Note: Preference changes will be applied in a future update. Currently all items are included.
          </p>
        </div>

        {/* Security */}
        <div className="pt-4 border-t">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-sm mb-1">Security</h4>
              <p className="text-xs text-muted-foreground">
                Your calendar URL is private. Anyone with this URL can view your goals and milestones.
              </p>
            </div>
            <Button variant="outline" size="sm" disabled>
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate URL
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
