import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Target, TrendingUp } from "lucide-react"

export default async function FamilyPage() {
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

  // Fetch all family members
  const { data: familyMembers } = await supabase.from("profiles").select("*").order("created_at", { ascending: true })

  // Fetch all family goals with user info
  const { data: allGoals } = await supabase
    .from("goals")
    .select("*, profiles(full_name, role)")
    .eq("status", "active")
    .order("created_at", { ascending: false })

  // Fetch recent family check-ins
  const { data: recentCheckIns } = await supabase
    .from("check_ins")
    .select("*, profiles(full_name, role)")
    .order("date", { ascending: false })
    .limit(5)

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Family</h1>
        <p className="text-muted-foreground">See what everyone is working on and celebrate together</p>
      </div>

      {/* Family Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Family Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {familyMembers?.map((member) => {
              const memberGoals = allGoals?.filter((g) => g.user_id === member.id) || []
              const avgProgress =
                memberGoals.length > 0
                  ? Math.round(
                      memberGoals.reduce((acc, g) => {
                        if (g.target_value > 0) {
                          return acc + (g.current_value / g.target_value) * 100
                        }
                        return acc
                      }, 0) / memberGoals.length,
                    )
                  : 0

              const initials = member.full_name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()

              return (
                <Card key={member.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold">{member.full_name}</p>
                        <Badge variant="secondary" className="capitalize">
                          {member.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Active Goals</span>
                        <span className="font-medium">{memberGoals.length}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{avgProgress}%</span>
                        </div>
                        <Progress value={avgProgress} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* All Family Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Family Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allGoals && allGoals.length > 0 ? (
            <div className="space-y-4">
              {allGoals.map((goal) => {
                const progress = goal.target_value > 0 ? (goal.current_value / goal.target_value) * 100 : 0
                return (
                  <div key={goal.id} className="space-y-2 p-4 border rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{goal.title}</p>
                          <Badge variant="secondary" className="capitalize">
                            {goal.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {goal.profiles?.full_name} ({goal.profiles?.role})
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{Math.round(progress)}%</p>
                        <p className="text-xs text-muted-foreground">
                          {goal.current_value}/{goal.target_value} {goal.unit}
                        </p>
                      </div>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No family goals yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Check-ins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Check-ins
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentCheckIns && recentCheckIns.length > 0 ? (
            <div className="space-y-4">
              {recentCheckIns.map((checkIn) => (
                <div key={checkIn.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{checkIn.profiles?.full_name}</p>
                      <Badge
                        variant={
                          checkIn.mood === "great"
                            ? "default"
                            : checkIn.mood === "good"
                              ? "secondary"
                              : checkIn.mood === "okay"
                                ? "outline"
                                : "destructive"
                        }
                        className="capitalize"
                      >
                        {checkIn.mood}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(checkIn.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <p className="text-sm">{checkIn.content}</p>
                  {checkIn.highlights && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Highlights:</span> {checkIn.highlights}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No check-ins yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
