"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Calendar, Eye } from "lucide-react"

// Demo data for each user
const userData = {
  nate: {
    name: "Nate",
    totalGoals: 3,
    onTrack: 2,
    needsAttention: 1,
    avgProgress: 41,
    topGoals: [
      {
        id: "1",
        title: "Travel Out of Country",
        emoji: "✈️",
        category: "Travel",
        views: 45,
        interactions: 12,
        progress: 33,
        target: "Aug 30, 2026",
      },
      {
        id: "2",
        title: "Golf Simulator Done",
        emoji: "🏌️",
        category: "Home",
        views: 38,
        interactions: 8,
        progress: 50,
        target: "Mar 30, 2026",
      },
      {
        id: "3",
        title: "Reduce Phone Time",
        emoji: "📱",
        category: "Personal",
        views: 32,
        interactions: 15,
        progress: 40,
        target: "Dec 30, 2026",
      },
    ],
    underPerforming: [
      {
        id: "3",
        title: "Reduce Phone Time",
        emoji: "📱",
        category: "Personal",
        target: "< 2 hrs/day",
        current: "3.5 hrs/day",
        progress: 40,
      },
    ],
    bestPerformers: [
      {
        id: "2",
        title: "Golf Simulator Done",
        emoji: "🏌️",
        category: "Home",
        completion: 50,
        streak: 8,
      },
      {
        id: "1",
        title: "Travel Out of Country",
        emoji: "✈️",
        category: "Travel",
        completion: 33,
        streak: 3,
      },
    ],
  },
  dalton: {
    name: "Dalton",
    totalGoals: 3,
    onTrack: 3,
    needsAttention: 0,
    avgProgress: 50,
    topGoals: [
      {
        id: "1",
        title: "Hit 93 MPH",
        emoji: "⚾",
        category: "Athletic",
        views: 86,
        interactions: 24,
        progress: 33,
        target: "Dec 30, 2026",
      },
      {
        id: "2",
        title: "Straight A's Jr Year",
        emoji: "📚",
        category: "Academic",
        views: 52,
        interactions: 18,
        progress: 25,
        target: "May 31, 2026",
      },
      {
        id: "3",
        title: "Make Varsity",
        emoji: "🏆",
        category: "Athletic",
        views: 67,
        interactions: 31,
        progress: 60,
        target: "Dec 30, 2026",
      },
    ],
    underPerforming: [],
    bestPerformers: [
      {
        id: "3",
        title: "Make Varsity",
        emoji: "🏆",
        category: "Athletic",
        completion: 60,
        streak: 12,
      },
      {
        id: "1",
        title: "Hit 93 MPH",
        emoji: "⚾",
        category: "Athletic",
        completion: 33,
        streak: 6,
      },
    ],
  },
  mason: {
    name: "Mason",
    totalGoals: 3,
    onTrack: 2,
    needsAttention: 1,
    avgProgress: 45,
    topGoals: [
      {
        id: "1",
        title: "Mid/High 70s Velo",
        emoji: "⚾",
        category: "Athletic",
        views: 72,
        interactions: 19,
        progress: 40,
        target: "Dec 30, 2026",
      },
      {
        id: "2",
        title: "Be More Confident",
        emoji: "🎯",
        category: "Personal",
        views: 41,
        interactions: 14,
        progress: 38,
        target: "Dec 30, 2026",
      },
      {
        id: "3",
        title: "Sub 6 min Mile",
        emoji: "🏃",
        category: "Athletic",
        views: 58,
        interactions: 22,
        progress: 57,
        target: "Dec 30, 2026",
      },
    ],
    underPerforming: [
      {
        id: "2",
        title: "Be More Confident",
        emoji: "🎯",
        category: "Personal",
        target: "80% confidence",
        current: "50% confidence",
        progress: 38,
      },
    ],
    bestPerformers: [
      {
        id: "3",
        title: "Sub 6 min Mile",
        emoji: "🏃",
        category: "Athletic",
        completion: 57,
        streak: 10,
      },
      {
        id: "1",
        title: "Mid/High 70s Velo",
        emoji: "⚾",
        category: "Athletic",
        completion: 40,
        streak: 5,
      },
    ],
  },
}

export default function DemoGoalsPage() {
  const [selectedUser, setSelectedUser] = useState<"nate" | "dalton" | "mason">("dalton")
  const user = userData[selectedUser]

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Mode Banner */}
      <Card className="bg-amber-50 border-amber-200 mb-6">
        <CardContent className="pt-6">
          <p className="text-center text-amber-900">
            <strong>Demo Mode:</strong> Goal editing is disabled. Sign up to create and track your own goals!
          </p>
        </CardContent>
      </Card>

      {/* Header with User Selector */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">My Goals</h1>
            <p className="text-muted-foreground mt-1">Track your performance and progress</p>
          </div>
          <Select value={selectedUser} onValueChange={(value: any) => setSelectedUser(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nate">Nate (Parent)</SelectItem>
              <SelectItem value="dalton">Dalton (17)</SelectItem>
              <SelectItem value="mason">Mason (13)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{user.totalGoals}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">On Track</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-lime-green">{user.onTrack}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Needs Attention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{user.needsAttention}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-sky-blue">{user.avgProgress}%</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Top Goals */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Top Goals</h2>
          <Button variant="ghost" size="sm" className="text-sm">
            View All →
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {user.topGoals.map((goal) => (
            <Card key={goal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-blue to-navy-dark flex items-center justify-center text-4xl">
                    {goal.emoji}
                  </div>
                  <Badge variant="secondary" className="bg-lime-green/10 text-lime-green border-lime-green/20">
                    {goal.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl mb-2">{goal.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{goal.views}</span>
                    <span className="text-muted-foreground">views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{goal.interactions}</span>
                    <span className="text-muted-foreground">updates</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{goal.target}</span>
                  </div>
                  <Button size="sm" variant="default" className="bg-navy-dark hover:bg-navy-dark/90">
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Under Performing & Best Performers */}
      <div className="grid grid-cols-2 gap-6">
        {/* Under Performing */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Under Performing</h2>
          <div className="space-y-4">
            {user.underPerforming.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  All goals are on track! 🎉
                </CardContent>
              </Card>
            ) : (
              user.underPerforming.map((goal) => (
                <Card key={goal.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-2xl">
                        {goal.emoji}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{goal.title}</CardTitle>
                        <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                          {goal.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground mb-1">Target</div>
                        <div className="font-medium">{goal.target}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">Current</div>
                        <div className="font-medium text-orange-600">{goal.current}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Best Performers */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Best Performers</h2>
          <div className="grid grid-cols-2 gap-4">
            {user.bestPerformers.map((goal) => (
              <Card key={goal.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-lime-green to-green-600 flex items-center justify-center text-2xl mb-3">
                    {goal.emoji}
                  </div>
                  <CardTitle className="text-base mb-1">{goal.title}</CardTitle>
                  <Badge variant="secondary" className="bg-lime-green/10 text-lime-green border-lime-green/20 w-fit">
                    {goal.category}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Completion</span>
                      <span className="font-bold text-lime-green">{goal.completion}%</span>
                    </div>
                    <Progress value={goal.completion} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-lime-green" />
                      <span className="text-muted-foreground">{goal.streak} day streak</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
