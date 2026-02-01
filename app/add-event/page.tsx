"use client"

import { useState } from "react"
import { DEMO_USERS } from "@/lib/demo-data"

type Step = "select-person" | "enter-event" | "success"

export default function AddEventPage() {
  const [step, setStep] = useState<Step>("select-person")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [title, setTitle] = useState("")
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0])
  const [startTime, setStartTime] = useState("16:00")
  const [endTime, setEndTime] = useState("18:00")
  const [eventType, setEventType] = useState("practice")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const users = DEMO_USERS

  // User colors matching the TV display
  const userColors: Record<string, { bg: string; border: string; ring: string }> = {
    Nate: { bg: "bg-blue-500", border: "border-blue-400", ring: "ring-blue-400" },
    Dalton: { bg: "bg-green-500", border: "border-green-400", ring: "ring-green-400" },
    Mason: { bg: "bg-orange-500", border: "border-orange-400", ring: "ring-orange-400" },
  }

  // Event types with colors matching the calendar
  const eventTypes = [
    { value: "practice", label: "Practice", emoji: "⚾", color: "#22C55E" },
    { value: "game", label: "Game", emoji: "🏆", color: "#EF4444" },
    { value: "school", label: "School", emoji: "📚", color: "#3B82F6" },
    { value: "family", label: "Family", emoji: "👨‍👩‍👦‍👦", color: "#06B6D4" },
    { value: "other", label: "Other", emoji: "📅", color: "#8B5CF6" },
  ]

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleContinue = () => {
    if (selectedUsers.length > 0) {
      setStep("enter-event")
    }
  }

  // Save event to localStorage for demo mode
  const saveEventLocally = (event: {
    title: string
    start_time: string
    end_time: string
    color: string
    location: string | null
    description: string | null
    is_all_day: boolean
    recurrence_rule: string | null
  }) => {
    try {
      const stored = localStorage.getItem('fay-local-events')
      const events = stored ? JSON.parse(stored) : []
      const newEvent = {
        ...event,
        id: `local-${Date.now()}`,
        created_at: new Date().toISOString(),
      }
      events.push(newEvent)
      localStorage.setItem('fay-local-events', JSON.stringify(events))
      // Trigger storage event for other tabs
      window.dispatchEvent(new StorageEvent('storage', { key: 'fay-local-events' }))
    } catch (e) {
      console.error('Failed to save event locally:', e)
    }
  }

  const handleSubmit = async () => {
    if (!title.trim() || selectedUsers.length === 0) return

    setIsSubmitting(true)
    setError("")

    const selectedType = eventTypes.find(t => t.value === eventType)

    const eventData = {
      title: title.trim(),
      start_time: `${date}T${startTime}:00`,
      end_time: `${date}T${endTime}:00`,
      color: selectedType?.color || "#6B7280",
      location: null,
      description: null,
      is_all_day: false,
      recurrence_rule: null,
    }

    // Always save locally for demo mode
    saveEventLocally(eventData)

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...eventData,
          participant_ids: selectedUsers,
        }),
      })

      if (!response.ok) {
        console.warn("API failed, event saved locally for demo mode")
      }
    } catch (err) {
      console.warn("API error, event saved locally for demo mode:", err)
    }

    setStep("success")
    setIsSubmitting(false)
  }

  const handleAddAnother = () => {
    setTitle("")
    setDate(new Date().toISOString().split("T")[0])
    setStartTime("16:00")
    setEndTime("18:00")
    setEventType("practice")
    setStep("enter-event")
  }

  const handleStartOver = () => {
    setSelectedUsers([])
    setTitle("")
    setStep("select-person")
  }

  // Get names of selected users for display
  const selectedNames = users
    .filter(u => selectedUsers.includes(u.id))
    .map(u => u.name)
    .join(" & ")

  // Step 1: Select Person(s)
  if (step === "select-person") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex flex-col">
        <h1 className="text-3xl font-bold text-center mb-2">Add Event</h1>
        <p className="text-gray-400 text-center text-lg mb-8">Who's this event for?</p>

        <div className="flex-1 flex flex-col justify-center gap-4 max-w-sm mx-auto w-full">
          {users.map((user) => {
            const colors = userColors[user.name] || { bg: "bg-gray-500", border: "border-gray-400", ring: "ring-gray-400" }
            const isSelected = selectedUsers.includes(user.id)
            return (
              <button
                key={user.id}
                onClick={() => toggleUser(user.id)}
                className={`${isSelected ? colors.bg : "bg-gray-700"} ${colors.border} border-4 rounded-2xl p-5 flex items-center gap-5 transition-all active:scale-95 ${isSelected ? "ring-4 " + colors.ring : ""}`}
              >
                <div className={`w-16 h-16 rounded-full ${isSelected ? "bg-white/30" : "bg-white/10"} flex items-center justify-center text-3xl font-bold`}>
                  {user.name.charAt(0)}
                </div>
                <span className="text-2xl font-bold flex-1">{user.name}</span>
                <div className={`w-8 h-8 rounded-full border-2 ${isSelected ? "bg-white border-white" : "border-gray-500"} flex items-center justify-center`}>
                  {isSelected && <span className="text-gray-900 text-xl">✓</span>}
                </div>
              </button>
            )
          })}

          <p className="text-center text-gray-500 mt-2">
            Tap multiple people if needed
          </p>
        </div>

        <button
          onClick={handleContinue}
          disabled={selectedUsers.length === 0}
          className={`w-full py-5 rounded-xl text-2xl font-bold transition-all mt-6 ${
            selectedUsers.length === 0
              ? "bg-gray-700 text-gray-500"
              : "bg-blue-600 hover:bg-blue-500 active:scale-98"
          }`}
        >
          Continue →
        </button>

        <a href="/demo/tv" className="text-center text-gray-500 mt-6 text-lg">
          ← Back to TV
        </a>
      </div>
    )
  }

  // Step 2: Enter Event Details
  if (step === "enter-event") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={handleStartOver} className="text-gray-400 text-2xl">
            ←
          </button>
          <span className="text-2xl font-bold">Event for {selectedNames}</span>
        </div>

        {error && (
          <div className="bg-red-600/30 border border-red-500 text-red-300 px-4 py-3 rounded-xl mb-4 text-center text-lg">
            {error}
          </div>
        )}

        <div className="flex-1 flex flex-col gap-5">
          {/* Event Title */}
          <div>
            <label className="block text-xl font-medium mb-3">What's the event?</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Baseball Practice, Game vs Tigers"
              autoFocus
              className="w-full px-5 py-4 bg-gray-800 border-2 border-gray-600 rounded-xl text-xl focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-xl font-medium mb-3">Type</label>
            <div className="grid grid-cols-3 gap-2">
              {eventTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setEventType(type.value)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    eventType === type.value
                      ? "border-white"
                      : "border-gray-600"
                  }`}
                  style={{
                    backgroundColor: eventType === type.value ? type.color : "#1f2937"
                  }}
                >
                  <div className="text-2xl">{type.emoji}</div>
                  <div className="text-sm mt-1">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xl font-medium mb-3">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-4 bg-gray-800 border-2 border-gray-600 rounded-xl text-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Start & End Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xl font-medium mb-3">Start</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-4 bg-gray-800 border-2 border-gray-600 rounded-xl text-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xl font-medium mb-3">End</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-4 bg-gray-800 border-2 border-gray-600 rounded-xl text-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
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
          {isSubmitting ? "Saving..." : "Add to Calendar 📅"}
        </button>
      </div>
    )
  }

  // Step 3: Success
  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex flex-col items-center justify-center">
        <div className="text-8xl mb-6">📅</div>
        <h1 className="text-3xl font-bold text-center mb-2">Event Added!</h1>
        <p className="text-gray-400 text-center text-xl mb-2">"{title}"</p>
        <p className="text-gray-500 text-center text-lg mb-8">
          {new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          <br />
          {startTime} - {endTime}
        </p>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button
            onClick={handleAddAnother}
            className="bg-blue-600 w-full py-5 rounded-xl text-2xl font-bold transition-all active:scale-95"
          >
            Add Another Event
          </button>

          <button
            onClick={handleStartOver}
            className="bg-gray-700 w-full py-5 rounded-xl text-2xl font-bold transition-all active:scale-95"
          >
            Different People
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
