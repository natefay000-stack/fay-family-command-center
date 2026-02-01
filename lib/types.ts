// Database Types for Fay Goals

export type UserRole = 'parent' | 'child'

export type GoalCategory = 'health' | 'academic' | 'sports' | 'personal' | 'travel' | 'professional'

export type GoalStatus = 'on-track' | 'behind' | 'ahead' | 'not-started' | 'completed'

export interface User {
  id: string
  name: string
  role: UserRole
  avatar_url: string | null
  created_at: string
}

export interface Goal {
  id: string
  user_id: string
  title: string
  description: string | null
  target_value: number | null
  current_value: number
  unit: string | null
  category: GoalCategory
  deadline: string | null
  is_starred: boolean
  is_completed: boolean
  created_at: string
  updated_at: string
}

export interface Metric {
  id: string
  goal_id: string
  user_id: string
  value: number
  notes: string | null
  recorded_at: string
  created_at: string
}

export interface Event {
  id: string
  title: string
  description: string | null
  start_time: string
  end_time: string | null
  is_all_day: boolean
  recurrence_rule: string | null
  location: string | null
  color: string | null
  created_at: string
}

export interface EventParticipant {
  event_id: string
  user_id: string
}

export interface GroceryItem {
  id: string
  name: string
  quantity: number
  is_checked: boolean
  added_by: string | null
  created_at: string
}

export interface Quote {
  id: string
  text: string
  author: string | null
  is_active: boolean
}

export interface Photo {
  id: string
  url: string
  caption: string | null
  taken_at: string | null
  uploaded_by: string | null
  created_at: string
}

// Extended types with relations
export interface GoalWithUser extends Goal {
  user: User
}

export interface GoalWithMetrics extends Goal {
  metrics: Metric[]
}

export interface EventWithParticipants extends Event {
  participants: User[]
}

export interface MetricWithGoal extends Metric {
  goal: Goal
}

// API Response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

// Form input types
export interface CreateGoalInput {
  user_id: string
  title: string
  description?: string
  target_value?: number
  unit?: string
  category: GoalCategory
  deadline?: string
  is_starred?: boolean
}

export interface UpdateGoalInput {
  title?: string
  description?: string
  target_value?: number
  current_value?: number
  unit?: string
  category?: GoalCategory
  deadline?: string
  is_completed?: boolean
}

export interface CreateMetricInput {
  goal_id: string
  user_id: string
  value: number
  notes?: string
  recorded_at?: string
}

export interface CreateEventInput {
  title: string
  description?: string
  start_time: string
  end_time?: string
  is_all_day?: boolean
  recurrence_rule?: string
  location?: string
  color?: string
  participant_ids?: string[]
}

export interface CreateGroceryItemInput {
  name: string
  quantity?: number
  added_by?: string
}

// Utility types for calculating goal progress
export interface GoalProgress {
  goal: Goal
  percentage: number
  status: GoalStatus
  daysRemaining: number | null
  trend: 'up' | 'down' | 'stable'
}

// Weather types (for TV display)
export interface WeatherData {
  temperature: number
  condition: string
  icon: string
  location: string
}

// Calendar view types
export type CalendarView = 'day' | 'week' | 'month'

export interface CalendarFilter {
  userIds: string[]
  view: CalendarView
  date: Date
}
