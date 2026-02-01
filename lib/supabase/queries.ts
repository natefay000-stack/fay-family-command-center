// Supabase Query Utilities for Fay Goals
import { createClient } from './client'
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
  CreateGoalInput,
  UpdateGoalInput,
  CreateMetricInput,
  CreateEventInput,
  CreateGroceryItemInput,
} from '../types'

// Get the Supabase client (returns null in demo mode)
function getClient() {
  const client = createClient()
  if (!client) {
    console.warn('[Queries] Supabase client not available - using demo mode')
  }
  return client
}

// ============ USERS ============

export async function getUsers(): Promise<User[]> {
  const supabase = getClient()
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
  const supabase = getClient()
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
  const supabase = getClient()
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
  const supabase = getClient()
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
  const supabase = getClient()
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
  const supabase = getClient()
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

export async function createGoal(input: CreateGoalInput): Promise<Goal | null> {
  const supabase = getClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('goals')
    .insert(input)
    .select()
    .single()

  if (error) {
    console.error('Error creating goal:', error)
    return null
  }
  return data
}

export async function updateGoal(id: string, input: UpdateGoalInput): Promise<Goal | null> {
  const supabase = getClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('goals')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating goal:', error)
    return null
  }
  return data
}

export async function deleteGoal(id: string): Promise<boolean> {
  const supabase = getClient()
  if (!supabase) return false

  const { error } = await supabase.from('goals').delete().eq('id', id)

  if (error) {
    console.error('Error deleting goal:', error)
    return false
  }
  return true
}

// ============ METRICS ============

export async function getMetrics(goalId?: string, userId?: string): Promise<Metric[]> {
  const supabase = getClient()
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
  const supabase = getClient()
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

export async function createMetric(input: CreateMetricInput): Promise<Metric | null> {
  const supabase = getClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('metrics')
    .insert(input)
    .select()
    .single()

  if (error) {
    console.error('Error creating metric:', error)
    return null
  }

  // Also update the current_value on the goal
  if (data) {
    await supabase
      .from('goals')
      .update({ current_value: input.value })
      .eq('id', input.goal_id)
  }

  return data
}

export async function deleteMetric(id: string): Promise<boolean> {
  const supabase = getClient()
  if (!supabase) return false

  const { error } = await supabase.from('metrics').delete().eq('id', id)

  if (error) {
    console.error('Error deleting metric:', error)
    return false
  }
  return true
}

// ============ EVENTS ============

export async function getEvents(startDate?: Date, endDate?: Date): Promise<Event[]> {
  const supabase = getClient()
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
  const supabase = getClient()
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
  const supabase = getClient()
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

export async function createEvent(input: CreateEventInput): Promise<Event | null> {
  const supabase = getClient()
  if (!supabase) return null

  const { participant_ids, ...eventData } = input

  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .select()
    .single()

  if (error) {
    console.error('Error creating event:', error)
    return null
  }

  // Add participants if provided
  if (data && participant_ids && participant_ids.length > 0) {
    const participants = participant_ids.map((userId) => ({
      event_id: data.id,
      user_id: userId,
    }))

    await supabase.from('event_participants').insert(participants)
  }

  return data
}

export async function deleteEvent(id: string): Promise<boolean> {
  const supabase = getClient()
  if (!supabase) return false

  const { error } = await supabase.from('events').delete().eq('id', id)

  if (error) {
    console.error('Error deleting event:', error)
    return false
  }
  return true
}

// ============ GROCERY ITEMS ============

export async function getGroceryItems(showChecked: boolean = false): Promise<GroceryItem[]> {
  const supabase = getClient()
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

export async function createGroceryItem(input: CreateGroceryItemInput): Promise<GroceryItem | null> {
  const supabase = getClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('grocery_items')
    .insert(input)
    .select()
    .single()

  if (error) {
    console.error('Error creating grocery item:', error)
    return null
  }
  return data
}

export async function toggleGroceryItem(id: string, isChecked: boolean): Promise<boolean> {
  const supabase = getClient()
  if (!supabase) return false

  const { error } = await supabase
    .from('grocery_items')
    .update({ is_checked: isChecked })
    .eq('id', id)

  if (error) {
    console.error('Error toggling grocery item:', error)
    return false
  }
  return true
}

export async function deleteGroceryItem(id: string): Promise<boolean> {
  const supabase = getClient()
  if (!supabase) return false

  const { error } = await supabase.from('grocery_items').delete().eq('id', id)

  if (error) {
    console.error('Error deleting grocery item:', error)
    return false
  }
  return true
}

export async function clearCheckedGroceryItems(): Promise<boolean> {
  const supabase = getClient()
  if (!supabase) return false

  const { error } = await supabase.from('grocery_items').delete().eq('is_checked', true)

  if (error) {
    console.error('Error clearing checked grocery items:', error)
    return false
  }
  return true
}

// ============ QUOTES ============

export async function getActiveQuotes(): Promise<Quote[]> {
  const supabase = getClient()
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
  const supabase = getClient()
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
  const supabase = getClient()
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

// ============ REAL-TIME SUBSCRIPTIONS ============

export function subscribeToGoals(callback: (goals: Goal[]) => void) {
  const supabase = getClient()
  if (!supabase) return () => {}

  const subscription = supabase
    .channel('goals-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'goals' }, async () => {
      const goals = await getGoals()
      callback(goals)
    })
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}

export function subscribeToGroceryItems(callback: (items: GroceryItem[]) => void) {
  const supabase = getClient()
  if (!supabase) return () => {}

  const subscription = supabase
    .channel('grocery-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'grocery_items' }, async () => {
      const items = await getGroceryItems(true)
      callback(items)
    })
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}

export function subscribeToEvents(callback: (events: Event[]) => void) {
  const supabase = getClient()
  if (!supabase) return () => {}

  const subscription = supabase
    .channel('events-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, async () => {
      const events = await getEvents()
      callback(events)
    })
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}
