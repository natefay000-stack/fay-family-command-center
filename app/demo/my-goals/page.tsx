"use client"

import { useState } from "react"
import { ChevronRight, TrendingUp, TrendingDown, Target, Calendar, Activity } from "lucide-react"

export default function MyGoalsPage() {
  const [selectedUser, setSelectedUser] = useState<"nate" | "dalton" | "mason">("nate")

  // Goal data organized by performance
  const goalsData = {
    nate: {
      topGoals: [
        {
          title: "Travel Out of Country",
          icon: "✈️",
          category: "Travel",
          views: 47,
          interactions: 23,
          progress: 33,
          daysLeft: 259,
          trend: "up",
        },
        {
          title: "Golf Simulator Done",
          icon: "🏠",
          category: "Home",
          views: 38,
          interactions: 19,
          progress: 50,
          daysLeft: 106,
          trend: "up",
        },
        {
          title: "Read 12 Books",
          icon: "📚",
          category: "Personal",
          views: 32,
          interactions: 15,
          progress: 25,
          daysLeft: 365,
          trend: "stable",
        },
      ],
      underPerforming: [
        {
          title: "Reduce Phone Time",
          icon: "📱",
          category: "Health",
          progress: 15,
          target: "2 hrs/day",
          current: "4.5 hrs/day",
          behindBy: "45%",
        },
        {
          title: "Learn Spanish",
          icon: "🇪🇸",
          category: "Personal",
          progress: 10,
          target: "Conversational",
          current: "Beginner",
          behindBy: "60%",
        },
      ],
      bestPerformers: [
        {
          title: "Golf Simulator Done",
          icon: "🏠",
          category: "Home",
          progress: 50,
          completionRate: "100%",
          streak: 12,
        },
        {
          title: "Workout 4x/Week",
          icon: "💪",
          category: "Fitness",
          progress: 42,
          completionRate: "85%",
          streak: 8,
        },
        {
          title: "Travel Out of Country",
          icon: "✈️",
          category: "Travel",
          progress: 33,
          completionRate: "67%",
          streak: 5,
        },
      ],
    },
    dalton: {
      topGoals: [
        {
          title: "Hit 93 MPH",
          icon: "⚾",
          category: "Athletic",
          views: 64,
          interactions: 38,
          progress: 33,
          daysLeft: 381,
          trend: "up",
        },
        {
          title: "Straight A's Jr Year",
          icon: "📚",
          category: "Academic",
          views: 52,
          interactions: 29,
          progress: 25,
          daysLeft: 168,
          trend: "up",
        },
        {
          title: "Squat 315 lbs",
          icon: "🏋️",
          category: "Fitness",
          views: 41,
          interactions: 24,
          progress: 60,
          daysLeft: 381,
          trend: "up",
        },
      ],
      underPerforming: [
        {
          title: "Read 20 Minutes Daily",
          icon: "📖",
          category: "Personal",
          progress: 18,
          target: "20 min/day",
          current: "8 min/day",
          behindBy: "60%",
        },
      ],
      bestPerformers: [
        {
          title: "Squat 315 lbs",
          icon: "🏋️",
          category: "Fitness",
          progress: 60,
          completionRate: "95%",
          streak: 15,
        },
        {
          title: "Hit 93 MPH",
          icon: "⚾",
          category: "Athletic",
          progress: 33,
          completionRate: "88%",
          streak: 12,
        },
        {
          title: "Maintain 4.0 GPA",
          icon: "🎓",
          category: "Academic",
          progress: 50,
          completionRate: "92%",
          streak: 9,
        },
      ],
    },
    mason: {
      topGoals: [
        {
          title: "Mid/High 70s Velo",
          icon: "⚾",
          category: "Athletic",
          views: 56,
          interactions: 31,
          progress: 40,
          daysLeft: 381,
          trend: "up",
        },
        {
          title: "Be More Confident",
          icon: "🎯",
          category: "Personal",
          views: 43,
          interactions: 22,
          progress: 38,
          daysLeft: 381,
          trend: "up",
        },
        {
          title: "Run Sub-7 Minute Mile",
          icon: "🏃",
          category: "Fitness",
          views: 39,
          interactions: 19,
          progress: 55,
          daysLeft: 381,
          trend: "up",
        },
      ],
      underPerforming: [
        {
          title: "Practice Guitar Weekly",
          icon: "🎸",
          category: "Personal",
          progress: 12,
          target: "3x/week",
          current: "1x/week",
          behindBy: "67%",
        },
      ],
      bestPerformers: [
        {
          title: "Run Sub-7 Minute Mile",
          icon: "🏃",
          category: "Fitness",
          progress: 55,
          completionRate: "92%",
          streak: 11,
        },
        {
          title: "Mid/High 70s Velo",
          icon: "⚾",
          category: "Athletic",
          progress: 40,
          completionRate: "85%",
          streak: 9,
        },
        {
          title: "Be More Confident",
          icon: "🎯",
          category: "Personal",
          progress: 38,
          completionRate: "76%",
          streak: 6,
        },
      ],
    },
  }

  const currentData = goalsData[selectedUser]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with user selector */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">My Goals</h1>
              <p className="text-gray-600 mt-1">Track your progress and performance</p>
            </div>

            {/* User Selector */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedUser("nate")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedUser === "nate" ? "bg-navy-dark text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Nate
              </button>
              <button
                onClick={() => setSelectedUser("dalton")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedUser === "dalton" ? "bg-navy-dark text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Dalton
              </button>
              <button
                onClick={() => setSelectedUser("mason")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedUser === "mason" ? "bg-navy-dark text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Mason
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="text-sm text-blue-800 font-medium">Total Goals</div>
              <div className="text-3xl font-bold text-blue-900 mt-1">
                {currentData.topGoals.length + currentData.underPerforming.length}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <div className="text-sm text-green-800 font-medium">On Track</div>
              <div className="text-3xl font-bold text-green-900 mt-1">{currentData.bestPerformers.length}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
              <div className="text-sm text-orange-800 font-medium">Need Attention</div>
              <div className="text-3xl font-bold text-orange-900 mt-1">{currentData.underPerforming.length}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <div className="text-sm text-purple-800 font-medium">Avg Progress</div>
              <div className="text-3xl font-bold text-purple-900 mt-1">
                {Math.round(currentData.topGoals.reduce((acc, g) => acc + g.progress, 0) / currentData.topGoals.length)}
                %
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Top Goals Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-6 h-6 text-navy-dark" />
                Top Goals
              </h2>
              <p className="text-gray-600 text-sm mt-1">Most engaged with goals</p>
            </div>
            <button className="text-navy-dark hover:text-navy-dark/80 font-medium flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {currentData.topGoals.map((goal, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-3xl">
                      {goal.icon}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{goal.title}</div>
                      <div className="text-sm text-gray-500">{goal.category}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Activity className="w-4 h-4" /> Views
                    </span>
                    <span className="font-bold text-gray-900">{goal.views}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Target className="w-4 h-4" /> Progress
                    </span>
                    <span className="font-bold text-gray-900">{goal.progress}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Days Left
                    </span>
                    <span className="font-bold text-gray-900">{goal.daysLeft}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Interactions</span>
                    <span className="font-bold text-gray-900">{goal.interactions}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>

                {/* Trend indicator */}
                <div className="mt-3 flex items-center justify-end">
                  {goal.trend === "up" && (
                    <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" /> Trending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Two Column Layout for Under Performing and Best Performers */}
        <div className="grid grid-cols-2 gap-8">
          {/* Under Performing Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingDown className="w-6 h-6 text-orange-600" />
                  Under Performing
                </h2>
                <p className="text-gray-600 text-sm mt-1">Goals needing attention</p>
              </div>
            </div>

            <div className="space-y-4">
              {currentData.underPerforming.map((goal, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 border border-orange-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-2xl">
                      {goal.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{goal.title}</div>
                      <div className="text-sm text-gray-500">{goal.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">{goal.progress}%</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target:</span>
                      <span className="font-medium text-gray-900">{goal.target}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current:</span>
                      <span className="font-medium text-gray-900">{goal.current}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Behind By:</span>
                      <span className="font-bold text-orange-600">{goal.behindBy}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Best Performers Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  Best Performers
                </h2>
                <p className="text-gray-600 text-sm mt-1">Goals exceeding expectations</p>
              </div>
            </div>

            <div className="space-y-4">
              {currentData.bestPerformers.map((goal, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 border border-green-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center text-2xl">
                      {goal.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{goal.title}</div>
                      <div className="text-sm text-gray-500">{goal.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{goal.progress}%</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-gray-600 mb-1">Completion Rate</div>
                      <div className="text-lg font-bold text-green-700">{goal.completionRate}</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-gray-600 mb-1">Day Streak</div>
                      <div className="text-lg font-bold text-green-700">{goal.streak} days</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-emerald-600 h-2 rounded-full"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
