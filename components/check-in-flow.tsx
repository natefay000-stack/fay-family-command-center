"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle2, Award, ArrowRight, ArrowLeft, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import confetti from "canvas-confetti"
import { calculatePace } from "@/lib/utils/check-in-helpers"

const RATING_OPTIONS = [
  { value: 1, label: "Rough", emoji: "😓" },
  { value: 2, label: "Below average", emoji: "😕" },
  { value: 3, label: "Solid", emoji: "😊" },
  { value: 4, label: "Good", emoji: "😄" },
  { value: 5, label: "Crushed it", emoji: "🔥" },
]

interface Goal {
  id: string
  title: string
  current_value: number
  target_value: number
  unit: string
  created_at: string
  target_date: string
}

interface Metric {
  id: string
  metric_name: string
  metric_value: number
  unit: string
  date: string
}

export function CheckInFlow({
  sessionId,
  userId,
  goals,
  metrics,
}: {
  sessionId: string
  userId: string
  goals: Goal[]
  metrics: Metric[]
}) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Form state
  const [overallRating, setOverallRating] = useState<number | null>(null)
  const [metricNotes, setMetricNotes] = useState<Record<string, string>>({})
  const [wins, setWins] = useState("")
  const [struggles, setStruggles] = useState("")
  const [nextWeekFocus, setNextWeekFocus] = useState("")
  const [priorityMetrics, setPriorityMetrics] = useState<string[]>([])

  // Analyze goals and metrics
  const analyzedGoals = goals.map((goal) => {
    const pace = calculatePace(goal.current_value, goal.target_value, goal.created_at, goal.target_date || "2026-12-31")

    // Check for recent activity
    const recentMetrics = metrics.filter((m) => m.metric_name.toLowerCase().includes(goal.title.toLowerCase()))
    const daysSinceLastLog =
      recentMetrics.length > 0
        ? Math.floor(
            (Date.now() - new Date(recentMetrics[recentMetrics.length - 1].date).getTime()) / (1000 * 60 * 60 * 24),
          )
        : 999

    return {
      ...goal,
      pace: pace.status,
      progress: pace.percentage,
      daysSinceLastLog,
      needsAttention: pace.status === "behind" || daysSinceLastLog > 7,
      isWin: pace.status === "ahead",
    }
  })

  const flaggedGoals = analyzedGoals.filter((g) => g.needsAttention)
  const winGoals = analyzedGoals.filter((g) => g.isWin)

  const handleSubmit = async () => {
    if (!overallRating) return

    setLoading(true)

    try {
      const flaggedMetrics: Record<string, any> = {}
      flaggedGoals.forEach((goal) => {
        if (goal.pace === "behind") {
          flaggedMetrics[goal.id] = {
            reason: "behind_pace",
            note: metricNotes[goal.id] || "",
          }
        } else if (goal.daysSinceLastLog > 7) {
          flaggedMetrics[goal.id] = {
            reason: "no_logs",
            note: metricNotes[goal.id] || "",
          }
        }
      })

      const response = await fetch("/api/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: userId,
          overall_rating: overallRating,
          wins,
          struggles,
          next_week_focus: nextWeekFocus,
          priority_metrics: priorityMetrics,
          flagged_metrics: flaggedMetrics,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit check-in")

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })

      // Redirect to family view
      setTimeout(() => {
        router.push("/check-in/family")
        router.refresh()
      }, 1000)
    } catch (error) {
      console.error("[v0] Error submitting check-in:", error)
      alert("Failed to submit check-in. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-4">
        {[1, 2, 3, 4, 5].map((num) => (
          <div key={num} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step >= num ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {num}
            </div>
            {num < 5 && <div className={`w-12 h-1 mx-1 ${step > num ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Overall Rating */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">How was your week?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {RATING_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={overallRating === option.value ? "default" : "outline"}
                  className="h-auto py-6 flex flex-col gap-2"
                  onClick={() => setOverallRating(option.value)}
                >
                  <span className="text-3xl">{option.emoji}</span>
                  <span className="text-sm font-medium">{option.label}</span>
                </Button>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={() => setStep(2)} disabled={!overallRating}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Auto-Surfaced Review */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Let's review your progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Wins */}
            {winGoals.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2 text-green-600">
                  <Award className="h-5 w-5" />
                  Wins This Week
                </h3>
                {winGoals.map((goal) => (
                  <Alert key={goal.id} className="border-green-200 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      <strong>{goal.title}</strong> is ahead of pace at {Math.round(goal.progress)}%
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            {/* Areas needing attention */}
            {flaggedGoals.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="h-5 w-5" />
                  Areas Needing Attention
                </h3>
                {flaggedGoals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <Alert className="border-orange-200 bg-orange-50">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <AlertDescription>
                        <strong>{goal.title}</strong>
                        {goal.pace === "behind" && ` is behind target pace (${Math.round(goal.progress)}%)`}
                        {goal.daysSinceLastLog > 7 && ` - No logs in ${goal.daysSinceLastLog} days`}
                      </AlertDescription>
                    </Alert>
                    <Textarea
                      placeholder="Add a note about what happened... (optional)"
                      value={metricNotes[goal.id] || ""}
                      onChange={(e) => setMetricNotes({ ...metricNotes, [goal.id]: e.target.value })}
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            )}

            {flaggedGoals.length === 0 && winGoals.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Everything looks good! Keep up the great work.</p>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={() => setStep(3)}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Wins & Struggles */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Wins & Struggles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">What went well this week?</label>
              <Textarea
                placeholder="Celebrate your wins, big or small..."
                value={wins}
                onChange={(e) => setWins(e.target.value)}
                rows={4}
              />
              {winGoals.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Hint: You made great progress on {winGoals.map((g) => g.title).join(", ")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">What was challenging?</label>
              <Textarea
                placeholder="It's okay to share what didn't go as planned..."
                value={struggles}
                onChange={(e) => setStruggles(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={() => setStep(4)}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Next Week Focus */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Focus for Next Week</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">What's your main focus for next week?</label>
              <Textarea
                placeholder="Set your intention for the week ahead..."
                value={nextWeekFocus}
                onChange={(e) => setNextWeekFocus(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority Goals (optional)</label>
              <p className="text-sm text-muted-foreground mb-2">Select 1-3 goals to highlight on your dashboard</p>
              <div className="flex flex-wrap gap-2">
                {goals.map((goal) => (
                  <Badge
                    key={goal.id}
                    variant={priorityMetrics.includes(goal.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (priorityMetrics.includes(goal.id)) {
                        setPriorityMetrics(priorityMetrics.filter((id) => id !== goal.id))
                      } else if (priorityMetrics.length < 3) {
                        setPriorityMetrics([...priorityMetrics, goal.id])
                      }
                    }}
                  >
                    {goal.title}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(3)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={() => setStep(5)}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Submit */}
      {step === 5 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Review Your Check-in</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b">
                <span className="text-4xl">{RATING_OPTIONS.find((o) => o.value === overallRating)?.emoji}</span>
                <div>
                  <p className="text-sm text-muted-foreground">Overall Rating</p>
                  <p className="font-semibold">{RATING_OPTIONS.find((o) => o.value === overallRating)?.label}</p>
                </div>
              </div>

              {wins && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Wins</p>
                  <p className="text-sm">{wins}</p>
                </div>
              )}

              {struggles && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Struggles</p>
                  <p className="text-sm">{struggles}</p>
                </div>
              )}

              {nextWeekFocus && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Next Week Focus</p>
                  <p className="text-sm">{nextWeekFocus}</p>
                </div>
              )}

              {priorityMetrics.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Priority Goals</p>
                  <div className="flex flex-wrap gap-2">
                    {priorityMetrics.map((id) => {
                      const goal = goals.find((g) => g.id === id)
                      return goal ? <Badge key={id}>{goal.title}</Badge> : null
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(4)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit Check-in"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
