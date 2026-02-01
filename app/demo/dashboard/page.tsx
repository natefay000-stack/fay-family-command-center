"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { InteractiveGoalCard } from "@/components/interactive-goal-card"
import { GoalDialog } from "@/components/goal-dialog"
import { Toaster } from "sonner"
import type { Goal } from "@/lib/types"

// Demo users
const DEMO_USERS = [
  { id: "11111111-1111-1111-1111-111111111111", name: "Nate", color: "bg-blue-600" },
  { id: "22222222-2222-2222-2222-222222222222", name: "Dalton", color: "bg-red-600" },
  { id: "33333333-3333-3333-3333-333333333333", name: "Mason", color: "bg-green-600" },
]

// Initial demo goals
const INITIAL_GOALS: Goal[] = [
  // Nate's goals
  { id: "g1", user_id: "11111111-1111-1111-1111-111111111111", title: "Lose 7 lbs", description: "Get back to fighting weight", target_value: 7, current_value: 2, unit: "lbs", category: "health", deadline: "2026-06-01", is_completed: false, created_at: "2026-01-01", updated_at: "2026-01-01" },
  { id: "g2", user_id: "11111111-1111-1111-1111-111111111111", title: "Travel Out of Country", description: "International trip with family", target_value: 1, current_value: 0, unit: "trips", category: "travel", deadline: "2026-12-31", is_completed: false, created_at: "2026-01-01", updated_at: "2026-01-01" },
  { id: "g3", user_id: "11111111-1111-1111-1111-111111111111", title: "Golf Simulator Done", description: "Complete home golf simulator setup", target_value: 4, current_value: 2, unit: "milestones", category: "personal", deadline: "2026-03-31", is_completed: false, created_at: "2026-01-01", updated_at: "2026-01-01" },
  { id: "g4", user_id: "11111111-1111-1111-1111-111111111111", title: "Launch Side Project", description: "Ship the side project", target_value: 8, current_value: 5, unit: "milestones", category: "professional", deadline: "2026-05-01", is_completed: false, created_at: "2026-01-01", updated_at: "2026-01-01" },
  { id: "g5", user_id: "11111111-1111-1111-1111-111111111111", title: "Workout 5x/Week", description: "Consistent exercise routine", target_value: 5, current_value: 3, unit: "days", category: "health", deadline: "2026-12-31", is_completed: false, created_at: "2026-01-01", updated_at: "2026-01-01" },
  { id: "g6", user_id: "11111111-1111-1111-1111-111111111111", title: "Learn Spanish Basics", description: "Basic conversational Spanish", target_value: 10, current_value: 1, unit: "lessons", category: "personal", deadline: "2026-08-31", is_completed: false, created_at: "2026-01-01", updated_at: "2026-01-01" },

  // Dalton's goals
  { id: "g7", user_id: "22222222-2222-2222-2222-222222222222", title: "Hit 93 MPH", description: "Pitching velocity goal", target_value: 93, current_value: 88, unit: "mph", category: "sports", deadline: "2026-12-31", is_completed: false, created_at: "2026-01-01", updated_at: "2026-01-01" },
  { id: "g8", user_id: "22222222-2222-2222-2222-222222222222", title: "Straight A's Jr Year", description: "Academic excellence", target_value: 4.0, current_value: 3.7, unit: "gpa", category: "academic", deadline: "2026-06-01", is_completed: false, created_at: "2026-01-01", updated_at: "2026-01-01" },
  { id: "g9", user_id: "22222222-2222-2222-2222-222222222222", title: "Make Varsity Baseball", description: "Team roster goal", target_value: 1, current_value: 0, unit: "roster", category: "sports", deadline: "2026-03-01", is_completed: false, created_at: "2026-01-01", updated_at: "2026-01-01" },
  { id: "g10", user_id: "22222222-2222-2222-2222-222222222222", title: "Leadership Role", description: "Take on team leadership", target_value: 4, current_value: 2, unit: "milestones", category: "personal", deadline: "2026-09-01", is_completed: false, created_at: "2026-01-01", updated_at: "2026-01-01" },
  { id: "g11", user_id: "22222222-2222-2222-2222-222222222222", title: "College Visits", description: "Visit prospective colleges", target_value: 6, current_value: 1, unit: "visits", category: "academic", deadline: "2026-11-30", is_completed: false, created_at: "2026-01-01", updated_at: "2026-01-01" },
  { id: "g12", user_id: "22222222-2222-2222-2222-222222222222", title: "Build Highlights Reel", description: "Create recruiting video", target_value: 3, current_value: 0, unit: "milestones", category: "sports", deadline: "2026-07-31", is_completed: false, created_at: "2026-01-01", updated_at: "2026-01-01" },

  // Mason's goals
  { id: "g13", user_id: "33333333-3333-3333-3333-333333333333", title: "Mid/High 70s Velo", description: "Pitching velocity target", target_value: 77, current_value: 72, unit: "mph", category: "sports", deadline: "2026-12-31", is_completed: false, created_at: "2026-01-01", updated_at: "2026-01-01" },
  { id: "g14", user_id: "33333333-3333-3333-3333-333333333333", title: "Be More Confident", description: "Personal growth", target_value: 8, current_value: 3, unit: "milestones", category: "personal", deadline: "2026-12-31", is_completed: false, created_at: "2026-01-01", updated_at: "2026-01-01" },
  { id: "g15", user_id: "33333333-3333-3333-3333-333333333333", title: "Sub 5:40 Mile", description: "Running time goal", target_value: 340, current_value: 365, unit: "seconds", category: "sports", deadline: "2026-05-01", is_completed: false, created_at: "2026-01-01", updated_at: "2026-01-01" },
  { id: "g16", user_id: "33333333-3333-3333-3333-333333333333", title: "Read 12 Books", description: "Reading challenge", target_value: 12, current_value: 4, unit: "books", category: "personal", deadline: "2026-12-31", is_completed: false, created_at: "2026-01-01", updated_at: "2026-01-01" },
  { id: "g17", user_id: "33333333-3333-3333-3333-333333333333", title: "Join School Club", description: "Extracurricular involvement", target_value: 3, current_value: 2, unit: "milestones", category: "personal", deadline: "2026-02-28", is_completed: false, created_at: "2026-01-01", updated_at: "2026-01-01" },
  { id: "g18", user_id: "33333333-3333-3333-3333-333333333333", title: "Improve Grades", description: "Academic improvement", target_value: 3.5, current_value: 3.2, unit: "gpa", category: "academic", deadline: "2026-06-01", is_completed: false, created_at: "2026-01-01", updated_at: "2026-01-01" },
]

export default function DemoDashboard() {
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const handleUpdateGoal = (updatedGoal: Goal) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g))
    )
  }

  const handleDeleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId))
  }

  const handleAddGoal = (newGoal: Goal) => {
    setGoals((prev) => [newGoal, ...prev])
    setSelectedUserId(null)
  }

  const openAddDialog = (userId: string) => {
    setSelectedUserId(userId)
    setAddDialogOpen(true)
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8">
      <Toaster position="top-right" richColors />

      <div className="max-w-[1600px] mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Welcome back, Fay Family
          </h1>
          <p className="text-gray-600 text-lg">
            {goals.filter((g) => !g.is_completed).length} active goals •{" "}
            {goals.filter((g) => g.is_completed).length} completed •{" "}
            {DEMO_USERS.length} family members
          </p>
        </div>

        {/* Demo Mode Banner */}
        <div className="mb-8 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4">
          <p className="text-blue-900 text-center">
            <strong>Interactive Demo:</strong> Click on any goal card to log progress, or use the menu to edit/delete.
            Changes are saved locally during this session.
          </p>
        </div>

        {/* Family Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {DEMO_USERS.map((user) => {
            const userGoals = goals.filter((g) => g.user_id === user.id)
            const activeGoals = userGoals.filter((g) => !g.is_completed)
            const completedCount = userGoals.filter((g) => g.is_completed).length

            return (
              <div
                key={user.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
              >
                {/* User Header */}
                <div className="mb-6 pb-4 border-b-2 border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-full ${user.color} flex items-center justify-center`}
                      >
                        <span className="text-white text-xl font-bold">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                        <p className="text-sm text-gray-500">
                          {activeGoals.length} active • {completedCount} done
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openAddDialog(user.id)}
                      className="gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>

                {/* Goals Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {activeGoals.slice(0, 6).map((goal) => (
                    <InteractiveGoalCard
                      key={goal.id}
                      goal={goal}
                      userName={user.name}
                      onUpdate={handleUpdateGoal}
                      onDelete={handleDeleteGoal}
                      compact
                      isDemo
                    />
                  ))}

                  {/* Add Goal Card */}
                  {activeGoals.length < 6 && (
                    <button
                      onClick={() => openAddDialog(user.id)}
                      className="p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors flex flex-col items-center justify-center gap-1 min-h-[80px]"
                    >
                      <Plus className="h-5 w-5" />
                      <span className="text-xs">Add Goal</span>
                    </button>
                  )}
                </div>

                {/* Show more if needed */}
                {activeGoals.length > 6 && (
                  <p className="text-center text-sm text-gray-500 mt-4">
                    +{activeGoals.length - 6} more goals
                  </p>
                )}

                {/* Completed Goals Section */}
                {completedCount > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-500 mb-2">
                      Completed ({completedCount})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {userGoals
                        .filter((g) => g.is_completed)
                        .slice(0, 3)
                        .map((goal) => (
                          <span
                            key={goal.id}
                            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                          >
                            ✓ {goal.title}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border">
            <div className="text-3xl font-bold text-gray-900">
              {goals.filter((g) => !g.is_completed).length}
            </div>
            <div className="text-sm text-gray-500">Active Goals</div>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <div className="text-3xl font-bold text-green-600">
              {goals.filter((g) => g.is_completed).length}
            </div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <div className="text-3xl font-bold text-blue-600">
              {Math.round(
                goals
                  .filter((g) => g.target_value && !g.is_completed)
                  .reduce((sum, g) => sum + (g.current_value / g.target_value!) * 100, 0) /
                  Math.max(1, goals.filter((g) => g.target_value && !g.is_completed).length)
              )}%
            </div>
            <div className="text-sm text-gray-500">Avg Progress</div>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <div className="text-3xl font-bold text-purple-600">
              {goals.filter((g) => {
                if (!g.target_value) return false
                return (g.current_value / g.target_value) >= 0.75
              }).length}
            </div>
            <div className="text-sm text-gray-500">Almost Done</div>
          </div>
        </div>
      </div>

      {/* Add Goal Dialog */}
      {selectedUserId && (
        <GoalDialog
          open={addDialogOpen}
          onOpenChange={(open) => {
            setAddDialogOpen(open)
            if (!open) setSelectedUserId(null)
          }}
          userId={selectedUserId}
          userName={DEMO_USERS.find((u) => u.id === selectedUserId)?.name}
          onSave={handleAddGoal}
          isDemo
        />
      )}
    </main>
  )
}
