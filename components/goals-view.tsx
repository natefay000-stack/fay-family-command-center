"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Target } from "lucide-react"
import { AddGoalDialog } from "@/components/add-goal-dialog-full"
import { GoalCard } from "@/components/goal-card-full"

interface Goal {
  id: string
  title: string
  description?: string
  category: string
  target_value: number
  current_value: number
  unit?: string
  start_date: string
  end_date: string
  status: string
  milestones?: Milestone[]
}

interface Milestone {
  id: string
  goal_id: string
  title: string
  description?: string
  target_date?: string
  completed: boolean
  completed_at?: string
}

interface GoalsViewProps {
  initialGoals: Goal[]
}

export function GoalsView({ initialGoals }: GoalsViewProps) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedTab, setSelectedTab] = useState("active")

  const activeGoals = goals.filter((g) => g.status === "active")
  const completedGoals = goals.filter((g) => g.status === "completed")
  const archivedGoals = goals.filter((g) => g.status === "archived")

  const handleGoalAdded = (newGoal: Goal) => {
    setGoals([newGoal, ...goals])
    setShowAddDialog(false)
  }

  const handleGoalUpdated = (updatedGoal: Goal) => {
    setGoals(goals.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)))
  }

  const handleGoalDeleted = (goalId: string) => {
    setGoals(goals.filter((g) => g.id !== goalId))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Goals</h1>
          <p className="text-muted-foreground">Manage your personal goals and track milestones</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="active">
            Active <span className="ml-2 text-xs">({activeGoals.length})</span>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed <span className="ml-2 text-xs">({completedGoals.length})</span>
          </TabsTrigger>
          <TabsTrigger value="archived">
            Archived <span className="ml-2 text-xs">({archivedGoals.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activeGoals.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} onUpdate={handleGoalUpdated} onDelete={handleGoalDeleted} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No active goals</h3>
              <p className="text-muted-foreground mb-4">Start by creating your first goal!</p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Goal
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedGoals.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} onUpdate={handleGoalUpdated} onDelete={handleGoalDeleted} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No completed goals yet. Keep working toward your active goals!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived" className="mt-6">
          {archivedGoals.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {archivedGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} onUpdate={handleGoalUpdated} onDelete={handleGoalDeleted} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No archived goals.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AddGoalDialog open={showAddDialog} onOpenChange={setShowAddDialog} onGoalAdded={handleGoalAdded} />
    </div>
  )
}
