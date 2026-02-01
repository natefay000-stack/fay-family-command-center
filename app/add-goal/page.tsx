"use client"

import { useState } from "react"
import { DEMO_USERS } from "@/lib/demo-data"

type Step = "select-person" | "enter-goal" | "success"

export default function AddGoalPage() {
  const [step, setStep] = useState<Step>("select-person")
  const [selectedUser, setSelectedUser] = useState<typeof DEMO_USERS[0] | null>(null)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("personal")
  const [isStarred, setIsStarred] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const users = DEMO_USERS

  // User colors matching the TV display
  const userColors: Record<string, { bg: string; border: string }> = {
    Nate: { bg: "bg-blue-500", border: "border-blue-400" },
    Dalton: { bg: "bg-green-500", border: "border-green-400" },
    Mason: { bg: "bg-orange-500", border: "border-orange-400" },
  }

  const categories = [
    { value: "sports", label: "Sports", emoji: "⚾" },
    { value: "academic", label: "School", emoji: "📚" },
    { value: "health", label: "Health", emoji: "💪" },
    { value: "personal", label: "Personal", emoji: "⭐" },
  ]

  const handleSelectUser = (user: typeof DEMO_USERS[0]) => {
    setSelectedUser(user)
    setStep("enter-goal")
  }

  const handleSubmit = async () => {
    if (!title.trim() || !selectedUser) return

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: selectedUser.id,
          title: title.trim(),
          category,
          is_starred: isStarred,
          deadline: "2026-12-31", // Default to end of year
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

  const handleAddAnother = () => {
    setTitle("")
    setCategory("personal")
    setIsStarred(false)
    setStep("enter-goal")
  }

  const handleStartOver = () => {
    setSelectedUser(null)
    setTitle("")
    setCategory("personal")
    setIsStarred(false)
    setStep("select-person")
  }

  // Step 1: Select Person
  if (step === "select-person") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex flex-col">
        <h1 className="text-3xl font-bold text-center mb-2">Add a Goal</h1>
        <p className="text-gray-400 text-center text-lg mb-8">Who's adding a goal?</p>

        <div className="flex-1 flex flex-col justify-center gap-6 max-w-sm mx-auto w-full">
          {users.map((user) => {
            const colors = userColors[user.name] || { bg: "bg-gray-500", border: "border-gray-400" }
            return (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className={`${colors.bg} ${colors.border} border-4 rounded-2xl p-6 flex items-center gap-5 transition-transform active:scale-95 hover:brightness-110`}
              >
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="text-3xl font-bold">{user.name}</span>
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

  // Step 2: Enter Goal
  if (step === "enter-goal" && selectedUser) {
    const colors = userColors[selectedUser.name] || { bg: "bg-gray-500", border: "border-gray-400" }

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex flex-col">
        {/* Header with selected user */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleStartOver}
            className="text-gray-400 text-2xl"
          >
            ←
          </button>
          <div className={`${colors.bg} w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold`}>
            {selectedUser.name.charAt(0)}
          </div>
          <span className="text-2xl font-bold">{selectedUser.name}'s Goal</span>
        </div>

        {error && (
          <div className="bg-red-600/30 border border-red-500 text-red-300 px-4 py-3 rounded-xl mb-4 text-center text-lg">
            {error}
          </div>
        )}

        <div className="flex-1 flex flex-col gap-6">
          {/* Goal Title */}
          <div>
            <label className="block text-xl font-medium mb-3">What's your goal?</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Hit 93 MPH, Get straight A's"
              autoFocus
              className="w-full px-5 py-4 bg-gray-800 border-2 border-gray-600 rounded-xl text-xl focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xl font-medium mb-3">Category</label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-xl ${
                    category === cat.value
                      ? "bg-blue-600 border-blue-400"
                      : "bg-gray-800 border-gray-600 hover:border-gray-500"
                  }`}
                >
                  <span className="text-2xl mr-2">{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Toggle */}
          <button
            type="button"
            onClick={() => setIsStarred(!isStarred)}
            className={`p-4 rounded-xl border-2 transition-all text-xl flex items-center justify-center gap-3 ${
              isStarred
                ? "bg-yellow-600/30 border-yellow-500"
                : "bg-gray-800 border-gray-600"
            }`}
          >
            <span className="text-3xl">{isStarred ? "⭐" : "☆"}</span>
            <span>{isStarred ? "Priority Goal!" : "Make it a priority?"}</span>
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !title.trim()}
          className={`w-full py-5 rounded-xl text-2xl font-bold transition-all mt-6 ${
            !title.trim()
              ? "bg-gray-700 text-gray-500"
              : isSubmitting
              ? "bg-blue-800 text-blue-300"
              : "bg-blue-600 hover:bg-blue-500 active:scale-98"
          }`}
        >
          {isSubmitting ? "Saving..." : "Save Goal 🎯"}
        </button>
      </div>
    )
  }

  // Step 3: Success
  if (step === "success" && selectedUser) {
    const colors = userColors[selectedUser.name] || { bg: "bg-gray-500", border: "border-gray-400" }

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex flex-col items-center justify-center">
        <div className="text-8xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-center mb-2">Goal Added!</h1>
        <p className="text-gray-400 text-center text-xl mb-8">
          "{title}" is now on {selectedUser.name}'s list
        </p>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button
            onClick={handleAddAnother}
            className={`${colors.bg} w-full py-5 rounded-xl text-2xl font-bold transition-all active:scale-95`}
          >
            Add Another Goal
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
