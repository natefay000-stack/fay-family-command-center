import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Target, Calendar } from "lucide-react"

const mockFamily = [
  { id: "1", name: "Alex Fay", role: "parent", goals: 5, avgProgress: 52, streak: 14 },
  { id: "2", name: "Jamie Fay", role: "parent", goals: 4, avgProgress: 68, streak: 21 },
  { id: "3", name: "Morgan Fay", role: "child", goals: 3, avgProgress: 45, streak: 7 },
  { id: "4", name: "Casey Fay", role: "child", goals: 2, avgProgress: 80, streak: 10 },
]

const mockFamilyGoals = [
  { title: "Family Vacation Fund", progress: 6500, target: 10000, unit: "dollars" },
  { title: "Family Game Nights", progress: 8, target: 52, unit: "nights" },
]

const mockRecentCheckIns = [
  { name: "Jamie Fay", mood: "great", date: "2026-01-15", highlight: "Completed a great workout!" },
  { name: "Alex Fay", mood: "good", date: "2026-01-15", highlight: "Finished reading a new book chapter" },
  { name: "Casey Fay", mood: "okay", date: "2026-01-14", highlight: "Practiced piano for 30 minutes" },
]

export default function DemoFamilyPage() {
  return (
    <div className="space-y-6">
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6">
          <p className="text-center text-amber-900">
            <strong>Demo Mode:</strong> Viewing sample family data. Sign up to track your real family's progress!
          </p>
        </CardContent>
      </Card>

      <div>
        <h1 className="text-3xl font-bold">Family Progress</h1>
        <p className="text-muted-foreground">See how everyone is doing with their goals</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Family Members
            </CardTitle>
            <CardDescription>Everyone's progress overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockFamily.map((member) => (
              <div key={member.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {member.goals} goals • {member.streak} day streak
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">{member.avgProgress}%</Badge>
                </div>
                <Progress value={member.avgProgress} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Family Goals
            </CardTitle>
            <CardDescription>Goals we're working on together</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockFamilyGoals.map((goal, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{goal.title}</div>
                  <span className="text-sm text-muted-foreground">
                    {goal.progress} / {goal.target}
                  </span>
                </div>
                <Progress value={(goal.progress / goal.target) * 100} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Check-ins
          </CardTitle>
          <CardDescription>Latest updates from the family</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockRecentCheckIns.map((checkIn, idx) => (
            <div key={idx} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {checkIn.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{checkIn.name}</span>
                  <span className="text-sm text-muted-foreground">{new Date(checkIn.date).toLocaleDateString()}</span>
                </div>
                <Badge variant="outline" className="capitalize">
                  {checkIn.mood}
                </Badge>
                <p className="text-sm text-muted-foreground">{checkIn.highlight}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
