"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell, Search, ChevronLeft, ChevronRight, Calendar, TrendingUp, Target, Users } from "lucide-react"
import Link from "next/link"

export default function DemoPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2)) // March 2026

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" })

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-20 bg-[#1a1a1a] border-r border-gray-800 flex flex-col items-center py-6 gap-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center font-bold text-white">
          FG
        </div>
        <div className="flex flex-col gap-4">
          <button className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </button>
          <button className="w-10 h-10 rounded-lg hover:bg-gray-800 flex items-center justify-center text-gray-400">
            <Users className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-lg hover:bg-gray-800 flex items-center justify-center text-gray-400">
            <Target className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-lg hover:bg-gray-800 flex items-center justify-center text-gray-400">
            <TrendingUp className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-lg hover:bg-gray-800 flex items-center justify-center text-gray-400">
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-20 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Home</span>
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                className="w-80 bg-[#1a1a1a] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-gray-700"
              />
            </div>
            <button className="w-10 h-10 rounded-lg hover:bg-gray-800 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold">
              DU
            </button>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="flex items-start justify-between mb-8">
          <div className="bg-[#1a1a1a] rounded-xl p-6 flex-1 mr-4">
            <h1 className="text-3xl font-bold mb-2">Welcome back, Fay Family!</h1>
            <p className="text-gray-400">You have 9 active goals across 3 family members.</p>
            <Link href="/demo/dashboard" className="text-purple-400 text-sm hover:underline">
              View dashboard →
            </Link>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 w-96">
            <h3 className="text-lg font-semibold mb-2">Track Family Progress</h3>
            <p className="text-purple-100 text-sm mb-4">
              Stay connected with weekly check-ins and celebrate wins together!
            </p>
            <Button className="bg-white text-purple-600 hover:bg-gray-100">Get Started</Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Active Goals */}
          <div className="col-span-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Active Goals</h2>
              <Link href="/demo/goals" className="text-sm text-gray-400 hover:text-white">
                See all goals
              </Link>
            </div>

            <div className="space-y-4">
              {/* Goal Card 1 */}
              <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                    ⚾
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">Hit 93 MPH</h3>
                    <p className="text-sm text-gray-400 mb-2">by Dalton</p>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-[#1a1a1a] flex items-center justify-center text-xs">
                          D
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">+2 metrics</span>
                      <span className="w-1 h-1 rounded-full bg-gray-600" />
                      <span className="text-xs text-green-400">●</span>
                      <span className="text-xs text-gray-500">On track</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Goal Card 2 */}
              <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                    📚
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">Straight A's Jr Year</h3>
                    <p className="text-sm text-gray-400 mb-2">by Dalton</p>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-[#1a1a1a] flex items-center justify-center text-xs">
                          D
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">+1 metrics</span>
                      <span className="w-1 h-1 rounded-full bg-gray-600" />
                      <span className="text-xs text-yellow-400">●</span>
                      <span className="text-xs text-gray-500">Needs focus</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Goal Card 3 */}
              <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                    ⚾
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">Mid/High 70s Velo</h3>
                    <p className="text-sm text-gray-400 mb-2">by Mason</p>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-purple-500 border-2 border-[#1a1a1a] flex items-center justify-center text-xs">
                          M
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">+2 metrics</span>
                      <span className="w-1 h-1 rounded-full bg-gray-600" />
                      <span className="text-xs text-green-400">●</span>
                      <span className="text-xs text-gray-500">Improving</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Latest Achievement & Trending */}
          <div className="col-span-5">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-4">Latest Achievement</h2>
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 relative overflow-hidden h-56">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                  <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full" />
                  <div className="absolute bottom-10 right-10 w-20 h-20 bg-white/20 rounded-lg rotate-45" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4">
                    Golf Simulator
                    <br />
                    Completed! 🎉
                  </h3>
                  <p className="text-purple-100 mb-4">
                    Nate just finished his golf simulator project with 50% completion rate.
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
                      👤
                    </div>
                    <div>
                      <p className="font-semibold">Nate Fay</p>
                      <p className="text-sm text-purple-200">March 30, 2026</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Activities</h2>
                <Link href="#" className="text-sm text-gray-400 hover:text-white">
                  See all activities
                </Link>
              </div>

              <div className="space-y-3">
                {/* Activity 1 */}
                <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer flex gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Dalton hit 91 MPH velocity</h4>
                    <p className="text-sm text-gray-400">Updated: March 15, 2026</p>
                  </div>
                </div>

                {/* Activity 2 */}
                <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer flex gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-lg flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Mason improved confidence score</h4>
                    <p className="text-sm text-gray-400">Updated: March 12, 2026</p>
                  </div>
                </div>

                {/* Activity 3 */}
                <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer flex gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Nate reduced phone time to 2.5 hours</h4>
                    <p className="text-sm text-gray-400">Updated: March 10, 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Upcoming & Calendar */}
          <div className="col-span-3">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Upcoming</h2>
                <Link href="/demo/calendar" className="text-sm text-gray-400 hover:text-white">
                  See all
                </Link>
              </div>

              <div className="space-y-3">
                <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
                  <div className="flex gap-3">
                    <div className="text-center">
                      <div className="text-xs text-gray-400">MAR</div>
                      <div className="text-2xl font-bold">18</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">Weekly Family Check-in</h4>
                      <p className="text-xs text-gray-400">07:00 PM - 08:00 PM CET</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
                  <div className="flex gap-3">
                    <div className="text-center">
                      <div className="text-xs text-gray-400">MAR</div>
                      <div className="text-2xl font-bold">20</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">Dalton's Baseball Game</h4>
                      <p className="text-xs text-gray-400">03:00 PM - 05:00 PM CET</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
                  <div className="flex gap-3">
                    <div className="text-center">
                      <div className="text-xs text-gray-400">MAR</div>
                      <div className="text-2xl font-bold">25</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">Nate Travel Deadline</h4>
                      <p className="text-xs text-gray-400">All Day</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mini Calendar */}
            <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                >
                  <ChevronLeft className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
                <h3 className="font-semibold">{monthName}</h3>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                >
                  <ChevronRight className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                  <div key={day} className="text-gray-500 font-medium">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-8" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const isToday = day === 15
                  const hasEvent = [18, 20, 25].includes(day)
                  return (
                    <button
                      key={day}
                      className={`h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isToday
                          ? "bg-purple-600 text-white font-bold"
                          : hasEvent
                            ? "bg-gray-800 text-white hover:bg-gray-700"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Family Members */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Family</h2>
            <Link href="/demo/family" className="text-sm text-gray-400 hover:text-white">
              See all members
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Nate */}
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl mb-4 flex items-center justify-center text-4xl font-bold">
                  N
                </div>
                <h3 className="font-semibold text-lg mb-1">Nate Fay</h3>
                <p className="text-sm text-gray-400 mb-3">Parent</p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Goals</div>
                    <div className="font-semibold">3</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Progress</div>
                    <div className="font-semibold text-green-400">47%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dalton */}
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl mb-4 flex items-center justify-center text-4xl font-bold">
                  D
                </div>
                <h3 className="font-semibold text-lg mb-1">Dalton Fay</h3>
                <p className="text-sm text-gray-400 mb-3">Junior</p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Goals</div>
                    <div className="font-semibold">3</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Progress</div>
                    <div className="font-semibold text-yellow-400">29%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mason */}
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl mb-4 flex items-center justify-center text-4xl font-bold">
                  M
                </div>
                <h3 className="font-semibold text-lg mb-1">Mason Fay</h3>
                <p className="text-sm text-gray-400 mb-3">Freshman</p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Goals</div>
                    <div className="font-semibold">3</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Progress</div>
                    <div className="font-semibold text-green-400">39%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Microsoft/Stripe logos section */}
        <div className="mt-8 flex items-center gap-4 justify-center text-gray-600">
          <span className="text-sm">Powered by</span>
          <svg className="h-5" viewBox="0 0 108 23" fill="currentColor">
            <path d="M10.85 0H0v10.85h10.85V0zm12.15 0H12.15v10.85H23V0zM10.85 12.15H0V23h10.85V12.15zm12.15 0H12.15V23H23V12.15z" />
          </svg>
          <span className="text-gray-700">|</span>
          <span className="font-semibold">Supabase</span>
        </div>
      </div>
    </div>
  )
}
