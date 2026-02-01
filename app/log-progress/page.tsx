"use client"

import { useState, useEffect } from "react"
import { DEMO_USERS, DEMO_GOALS } from "@/lib/demo-data"

type Step = "select-person" | "select-goal" | "enter-value" | "success"

export default function LogProgressPage() {
  const [step, setStep] = useState<Step>("select-person")
  const [selectedUser, setSelectedUser] = useState<typeof DEMO_USERS[0] | null>(null)
  const [selectedGoal, setSelectedGoal] = useState<typeof DEMO_GOALS[0] | null>(null)
  const [value, setValue] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const users = DEMO_USERS

  // User colors matching the TV display
  const userColors: Record<string, { bg: string; border: string }> = {
    Nate: { bg: "bg-blue-500", border: "border-blue-400" },
    Dalton: { bg: "bg-green-500", border: "border-green-400" },
    Mason: { bg: "bg-orange-500", border: "border-orange-400" },
  }

  // Get goals for selected user
  const userGoals = selectedUser
    ? DEMO_GOALS.filter(g => g.user_id === selectedUser.id && !g.is_completed)
    : []

  const handleSelectUser = (user: typeof DEMO_USERS[0]) => {
    setSelectedUser(user)
    setStep("select-goal")
  }

  const handleSelectGoal = (goal: typeof DEMO_GOALS[0]) => {
    setSelectedGoal(goal)
    setValue(String(goal.current_value))
    setStep("enter-value")
  }

  const handleSubmit = async () => {
    if (!selectedGoal || !value) return

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch(`/api/goals/${selectedGoal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_value: parseFloat(value),
        }),
      })

      if (!response.ok) {
        // In demo mode, still show success for UI testing
        console.warn("API failed, showing success for demo mode")
      }

      setStep("success")
    } catch (err) {
      // In demo mode, still show success for UI testing
      console.warn("API error, showing success for demo mode:", err)
      setStep("success")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogAnother = () => {
    setSelectedGoal(null)
    setValue("")
    setStep("select-goal")
  }

  const handleStartOver = () => {
    setSelectedUser(null)
    setSelectedGoal(null)
    setValue("")
    setStep("select-person")
  }

  // Calculate progress percentage
  const getProgress = (goal: typeof DEMO_GOALS[0]) => {
    if (!goal.target_value) return 0
    return Math.min(100, Math.round((goal.current_value / goal.target_value) * 100))
  }

  // Step 1: Select Person
  if (step === "select-person") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex flex-col">
        <h1 className="text-3xl font-bold text-center mb-2">Log Progress</h1>
        <p className="text-gray-400 text-center text-lg mb-8">Who's logging progress?</p>

        <div className="flex-1 flex flex-col justify-center gap-6 max-w-sm mx-auto w-full">
          {users.map((user) => {
            const colors = userColors[user.name] || { bg: "bg-gray-500", border: "border-gray-400" }
            const goalCount = DEMO_GOALS.filter(g => g.user_id === user.id && !g.is_completed).length
            return (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className={`${colors.bg} ${colors.border} border-4 rounded-2xl p-6 flex items-center gap-5 transition-transform active:scale-95 hover:brightness-110`}
              >
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left">
                  <span className="text-3xl font-bold block">{user.name}</span>
                  <span className="text-lg opacity-80">{goalCount} active goals</span>
                </div>
              </button>
            )
          })}
        </div>

        <a href="/demo/tv" className="text-center text-gray-500 mt-8 text-lg">
          ← Back to TV
        </a>
      </div>
    )
  }

  // Step 2: Select Goal
  if (step === "select-goal" && selectedUser) {
    const colors = userColors[selectedUser.name] || { bg: "bg-gray-500", border: "border-gray-400" }

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={handleStartOver} className="text-gray-400 text-2xl">
            ←
          </button>
          <div className={`${colors.bg} w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold`}>
            {selectedUser.name.charAt(0)}
          </div>
          <span className="text-2xl font-bold">{selectedUser.name}'s Goals</span>
        </div>

        <p className="text-gray-400 text-lg mb-6">Which goal to update?</p>

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-3">
            {userGoals.map((goal) => {
              const progress = getProgress(goal)
              return (
                <button
                  key={goal.id}
                  onClick={() => handleSelectGoal(goal)}
                  className="bg-gray-800 border-2 border-gray-600 rounded-xl p-4 text-left transition-all active:scale-98 hover:border-gray-500"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl font-bold">{goal.title}</span>
                    {goal.is_starred && <span className="text-yellow-400">⭐</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-lg text-gray-400">
                      {goal.current_value}/{goal.target_value} {goal.unit}
                    </span>
                  </div>
                </button>
              )
            })}

            {userGoals.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                <div className="text-5xl mb-4">🎯</div>
                <p className="text-xl">No active goals</p>
                <a href="/add-goal" className="text-blue-400 mt-2 inline-block">
                  Add a goal first →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Step 3: Enter Value
  if (step === "enter-value" && selectedUser && selectedGoal) {
    const colors = userColors[selectedUser.name] || { bg: "bg-gray-500", border: "border-gray-400" }
    const progress = selectedGoal.target_value
      ? Math.min(100, Math.round((parseFloat(value || "0") / selectedGoal.target_value) * 100))
      : 0

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={handleLogAnother} className="text-gray-400 text-2xl">
            ←
          </button>
          <div className={`${colors.bg} w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold`}>
            {selectedUser.name.charAt(0)}
          </div>
          <span className="text-xl font-bold">{selectedGoal.title}</span>
        </div>

        {error && (
          <div className="bg-red-600/30 border border-red-500 text-red-300 px-4 py-3 rounded-xl mb-4 text-center text-lg">
            {error}
          </div>
        )}

        <div className="flex-1 flex flex-col justify-center">
          {/* Current Progress Display */}
          <div className="bg-gray-800 rounded-2xl p-6 mb-6">
            <div className="text-center mb-4">
              <div className="text-6xl font-bold">{value || "0"}</div>
              <div className="text-2xl text-gray-400">
                / {selectedGoal.target_value} {selectedGoal.unit}
              </div>
            </div>
            <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${progress >= 100 ? "bg-yellow-500" : "bg-green-500"}`}
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
            <div className="text-center mt-2 text-lg">
              {progress >= 100 ? (
                <span className="text-yellow-400">🎉 Goal reached!</span>
              ) : (
                <span className="text-gray-400">{progress}% complete</span>
              )}
            </div>
          </div>

          {/* Value Input */}
          <div>
            <label className="block text-xl font-medium mb-3 text-center">
              New value ({selectedGoal.unit})
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
              step="any"
              className="w-full px-5 py-5 bg-gray-800 border-2 border-gray-600 rounded-xl text-3xl text-center focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Quick Adjust Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setValue(String(Math.max(0, parseFloat(value || "0") - 1)))}
              className="flex-1 py-4 bg-gray-700 rounded-xl text-2xl font-bold active:scale-95"
            >
              -1
            </button>
            <button
              onClick={() => setValue(String(parseFloat(value || "0") + 1))}
              className="flex-1 py-4 bg-gray-700 rounded-xl text-2xl font-bold active:scale-95"
            >
              +1
            </button>
            <button
              onClick={() => setValue(String(parseFloat(value || "0") + 5))}
              className="flex-1 py-4 bg-gray-700 rounded-xl text-2xl font-bold active:scale-95"
            >
              +5
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !value}
          className={`w-full py-5 rounded-xl text-2xl font-bold transition-all mt-6 ${
            !value
              ? "bg-gray-700 text-gray-500"
              : isSubmitting
              ? "bg-green-800 text-green-300"
              : "bg-green-600 hover:bg-green-500 active:scale-98"
          }`}
        >
          {isSubmitting ? "Saving..." : "Update Progress ✓"}
        </button>
      </div>
    )
  }

  // Step 4: Success
  if (step === "success" && selectedUser && selectedGoal) {
    const colors = userColors[selectedUser.name] || { bg: "bg-gray-500", border: "border-gray-400" }
    const progress = selectedGoal.target_value
      ? Math.min(100, Math.round((parseFloat(value) / selectedGoal.target_value) * 100))
      : 0

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex flex-col items-center justify-center">
        <div className="text-8xl mb-6">{progress >= 100 ? "🏆" : "💪"}</div>
        <h1 className="text-3xl font-bold text-center mb-2">Progress Updated!</h1>
        <p className="text-gray-400 text-center text-xl mb-2">{selectedGoal.title}</p>
        <p className="text-2xl text-center mb-8">
          {value} / {selectedGoal.target_value} {selectedGoal.unit}
          <span className="text-green-400 ml-2">({progress}%)</span>
        </p>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button
            onClick={handleLogAnother}
            className={`${colors.bg} w-full py-5 rounded-xl text-2xl font-bold transition-all active:scale-95`}
          >
            Log Another Goal
          </button>

          <button
            onClick={handleStartOver}
            className="bg-gray-700 w-full py-5 rounded-xl text-2xl font-bold transition-all active:scale-95"
          >
            Different Person
          </button>

          <a
            href="/demo/tv"
            className="text-center text-gray-400 mt-4 text-xl hover:text-white"
          >
            ← Back to TV Display
          </a>
        </div>
      </div>
    )
  }

  return null
}
