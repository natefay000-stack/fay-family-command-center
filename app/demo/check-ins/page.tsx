import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Smile, Calendar } from "lucide-react"

const mockCheckIns = [
  {
    id: "1",
    date: "2026-01-15",
    mood: "great",
    highlight: "Completed a great workout and hit a new personal record!",
    challenge: "Struggled to find time for reading",
  },
  {
    id: "2",
    date: "2026-01-14",
    mood: "good",
    highlight: "Had a productive work day and made progress on my project",
    challenge: "Felt a bit tired in the evening",
  },
  {
    id: "3",
    date: "2026-01-13",
    mood: "okay",
    highlight: "Spent quality time with family",
    challenge: "Didn't get as much exercise as planned",
  },
]

export default function DemoCheckInsPage() {
  return (
    <div className="space-y-6">
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6">
          <p className="text-center text-amber-900">
            <strong>Demo Mode:</strong> Check-in creation is disabled. Sign up to log your own daily reflections!
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Check-ins</h1>
          <p className="text-muted-foreground">Daily reflections and progress updates</p>
        </div>
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" />
          Add Check-in
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14 days</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Smile className="h-4 w-4" />
              Average Mood
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Good</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCheckIns.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {mockCheckIns.map((checkIn) => (
          <Card key={checkIn.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {new Date(checkIn.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardTitle>
                <Badge variant="outline" className="capitalize">
                  {checkIn.mood}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Highlight</h4>
                <p className="text-sm text-muted-foreground">{checkIn.highlight}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Challenge</h4>
                <p className="text-sm text-muted-foreground">{checkIn.challenge}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
