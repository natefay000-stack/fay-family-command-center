// Server-side Supabase Query Utilities for Fay Goals
// Use these in Server Components and API routes
import { createClient } from './server'
import type {
  User,
  Goal,
  Metric,
  Event,
  GroceryItem,
  Quote,
  Photo,
  GoalWithMetrics,
  EventWithParticipants,
} from '../types'

// ============ USERS ============

export async function getUsers(): Promise<User[]> {
  const supabase = await createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching users:', error)
    return []
  }
  return data || []
}

export async function getUserById(id: string): Promise<User | null> {
  const supabase = await createClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }
  return data
}

// ============ GOALS ============

export async function getGoals(userId?: string): Promise<Goal[]> {
  const supabase = await createClient()
  if (!supabase) return []

  let query = supabase.from('goals').select('*').order('created_at', { ascending: false })

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching goals:', error)
    return []
  }
  return data || []
}

export async function getGoalById(id: string): Promise<Goal | null> {
  const supabase = await createClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching goal:', error)
    return null
  }
  return data
}

export async function getGoalWithMetrics(id: string): Promise<GoalWithMetrics | null> {
  const supabase = await createClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('goals')
    .select(`
      *,
      metrics (*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching goal with metrics:', error)
    return null
  }
  return data
}

export async function getGoalsWithUsers(): Promise<(Goal & { user: User })[]> {
  const supabase = await createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('goals')
    .select(`
      *,
      user:users (*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching goals with users:', error)
    return []
  }
  return data || []
}

export async function getGoalsByCategory(category: string): Promise<Goal[]> {
  const supabase = await createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching goals by category:', error)
    return []
  }
  return data || []
}

// ============ METRICS ============

export async function getMetrics(goalId?: string, userId?: string): Promise<Metric[]> {
  const supabase = await createClient()
  if (!supabase) return []

  let query = supabase.from('metrics').select('*').order('recorded_at', { ascending: false })

  if (goalId) {
    query = query.eq('goal_id', goalId)
  }
  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching metrics:', error)
    return []
  }
  return data || []
}

export async function getRecentMetrics(userId: string, days: number = 30): Promise<Metric[]> {
  const supabase = await createClient()
  if (!supabase) return []

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('metrics')
    .select('*')
    .eq('user_id', userId)
    .gte('recorded_at', startDate.toISOString().split('T')[0])
    .order('recorded_at', { ascending: false })

  if (error) {
    console.error('Error fetching recent metrics:', error)
    return []
  }
  return data || []
}

export async function getMetricsWithGoals(userId: string): Promise<(Metric & { goal: Goal })[]> {
  const supabase = await createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('metrics')
    .select(`
      *,
      goal:goals (*)
    `)
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })

  if (error) {
    console.error('Error fetching metrics with goals:', error)
    return []
  }
  return data || []
}

// ============ EVENTS ============

export async function getEvents(startDate?: Date, endDate?: Date): Promise<Event[]> {
  const supabase = await createClient()
  if (!supabase) return []

  let query = supabase.from('events').select('*').order('start_time')

  if (startDate) {
    query = query.gte('start_time', startDate.toISOString())
  }
  if (endDate) {
    query = query.lte('start_time', endDate.toISOString())
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }
  return data || []
}

export async function getEventsWithParticipants(startDate?: Date, endDate?: Date): Promise<EventWithParticipants[]> {
  const supabase = await createClient()
  if (!supabase) return []

  let query = supabase
    .from('events')
    .select(`
      *,
      participants:event_participants (
        user:users (*)
      )
    `)
    .order('start_time')

  if (startDate) {
    query = query.gte('start_time', startDate.toISOString())
  }
  if (endDate) {
    query = query.lte('start_time', endDate.toISOString())
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching events with participants:', error)
    return []
  }

  // Transform the nested participant structure
  return (data || []).map((event: any) => ({
    ...event,
    participants: event.participants?.map((p: any) => p.user).filter(Boolean) || [],
  }))
}

export async function getEventsByUser(userId: string, startDate?: Date, endDate?: Date): Promise<Event[]> {
  const supabase = await createClient()
  if (!supabase) return []

  let query = supabase
    .from('events')
    .select(`
      *,
      event_participants!inner (user_id)
    `)
    .eq('event_participants.user_id', userId)
    .order('start_time')

  if (startDate) {
    query = query.gte('start_time', startDate.toISOString())
  }
  if (endDate) {
    query = query.lte('start_time', endDate.toISOString())
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching user events:', error)
    return []
  }
  return data || []
}

export async function getUpcomingEvents(days: number = 7): Promise<EventWithParticipants[]> {
  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + days)

  return getEventsWithParticipants(startDate, endDate)
}

// ============ GROCERY ITEMS ============

export async function getGroceryItems(showChecked: boolean = false): Promise<GroceryItem[]> {
  const supabase = await createClient()
  if (!supabase) return []

  let query = supabase.from('grocery_items').select('*').order('created_at', { ascending: false })

  if (!showChecked) {
    query = query.eq('is_checked', false)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching grocery items:', error)
    return []
  }
  return data || []
}

export async function getGroceryItemsWithUsers(): Promise<(GroceryItem & { added_by_user: User | null })[]> {
  const supabase = await createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('grocery_items')
    .select(`
      *,
      added_by_user:users (*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching grocery items with users:', error)
    return []
  }
  return data || []
}

// ============ QUOTES ============

export async function getActiveQuotes(): Promise<Quote[]> {
  const supabase = await createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('is_active', true)

  if (error) {
    console.error('Error fetching quotes:', error)
    return []
  }
  return data || []
}

export async function getRandomQuote(): Promise<Quote | null> {
  const quotes = await getActiveQuotes()
  if (quotes.length === 0) return null
  return quotes[Math.floor(Math.random() * quotes.length)]
}

// ============ PHOTOS ============

export async function getPhotos(limit?: number): Promise<Photo[]> {
  const supabase = await createClient()
  if (!supabase) return []

  let query = supabase.from('photos').select('*').order('taken_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching photos:', error)
    return []
  }
  return data || []
}

export async function getOnThisDayPhotos(): Promise<Photo[]> {
  const supabase = await createClient()
  if (!supabase) return []

  const today = new Date()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  // Get photos from same month/day in previous years
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .like('taken_at', `%-${month}-${day}`)

  if (error) {
    console.error('Error fetching on this day photos:', error)
    return []
  }
  return data || []
}

// ============ DASHBOARD AGGREGATES ============

export async function getDashboardData() {
  const [users, goals, upcomingEvents, groceryItems, quote] = await Promise.all([
    getUsers(),
    getGoalsWithUsers(),
    getUpcomingEvents(7),
    getGroceryItems(),
    getRandomQuote(),
  ])

  // Group goals by user
  const goalsByUser = users.map((user) => ({
    user,
    goals: goals.filter((g) => g.user_id === user.id),
  }))

  // Calculate stats
  const totalGoals = goals.length
  const completedGoals = goals.filter((g) => g.is_completed).length
  const onTrackGoals = goals.filter((g) => {
    if (!g.target_value || g.is_completed) return false
    const progress = (g.current_value / g.target_value) * 100
    return progress >= 50
  }).length

  return {
    users,
    goalsByUser,
    upcomingEvents,
    groceryItems,
    quote,
    stats: {
      totalGoals,
      completedGoals,
      onTrackGoals,
      needsAttention: totalGoals - completedGoals - onTrackGoals,
    },
  }
}

// ============ TV DISPLAY DATA ============

export async function getTVDisplayData() {
  const [users, goals, events, groceryItems, quote] = await Promise.all([
    getUsers(),
    getGoals(),
    getUpcomingEvents(14),
    getGroceryItems(),
    getRandomQuote(),
  ])

  // Group goals by user with progress calculation
  const goalsByUser = users.map((user) => ({
    user,
    goals: goals
      .filter((g) => g.user_id === user.id && !g.is_completed)
      .slice(0, 4) // Top 4 goals per user for TV display
      .map((g) => ({
        ...g,
        progress: g.target_value ? Math.round((g.current_value / g.target_value) * 100) : 0,
      })),
  }))

  // Find next special event (like Hawaii trip)
  const specialEvent = events.find((e) => e.is_all_day && e.location)

  // Calculate countdown
  let countdown = null
  if (specialEvent) {
    const eventDate = new Date(specialEvent.start_time)
    const today = new Date()
    const diffTime = eventDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    countdown = {
      event: specialEvent,
      daysRemaining: diffDays,
    }
  }

  return {
    goalsByUser,
    events,
    groceryItems,
    quote,
    countdown,
  }
}
