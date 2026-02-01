'use client'

import { useState, useEffect, useCallback } from 'react'
import type { User, Goal, Event, GroceryItem, Quote } from '@/lib/types'
import type { GoogleCalendarEvent } from '@/lib/google-calendar'
import {
  DEMO_USERS,
  DEMO_GOALS,
  DEMO_EVENTS,
  DEMO_GROCERY,
  DEMO_QUOTES,
  getRandomDemoQuote,
} from '@/lib/demo-data'

// Check if we're in demo mode (no Supabase configured)
const isDemoMode = () => {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

// Generic fetch wrapper with demo fallback
async function fetchWithFallback<T>(url: string, fallbackData: T): Promise<T> {
  if (isDemoMode()) {
    return fallbackData
  }

  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.warn(`API request failed: ${url}`, response.status)
      return fallbackData
    }
    return await response.json()
  } catch (error) {
    console.warn(`API request failed: ${url}`, error)
    return fallbackData
  }
}

// Hook for fetching users
export function useUsers() {
  const [users, setUsers] = useState<User[]>(DEMO_USERS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWithFallback<User[]>('/api/users', DEMO_USERS)
      .then(setUsers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { users, loading, error, isDemo: isDemoMode() }
}

// Hook for fetching goals
export function useGoals(userId?: string) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGoals = useCallback(async () => {
    setLoading(true)
    const url = userId ? `/api/goals?user_id=${userId}` : '/api/goals'
    const fallback = userId
      ? DEMO_GOALS.filter((g) => g.user_id === userId)
      : DEMO_GOALS

    try {
      const data = await fetchWithFallback<Goal[]>(url, fallback)
      setGoals(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  const refetch = useCallback(() => {
    fetchGoals()
  }, [fetchGoals])

  return { goals, loading, error, refetch, isDemo: isDemoMode() }
}

// Helper to get locally stored events
function getLocalEvents(): Event[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem('fay-local-events')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Helper to save events to localStorage
function saveLocalEvents(events: Event[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('fay-local-events', JSON.stringify(events))
  } catch (e) {
    console.error('Failed to save events:', e)
  }
}

// Hook for fetching events
export function useEvents(startDate?: string, endDate?: string, userId?: string) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (startDate) params.set('start_date', startDate)
    if (endDate) params.set('end_date', endDate)
    if (userId) params.set('user_id', userId)

    const url = `/api/events?${params.toString()}`

    try {
      const apiEvents = await fetchWithFallback<Event[]>(url, DEMO_EVENTS)
      // Merge API/demo events with locally stored events
      const localEvents = getLocalEvents()
      const allEvents = [...apiEvents, ...localEvents].sort(
        (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      )
      setEvents(allEvents)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate, userId])

  // Add a new event locally
  const addEvent = useCallback((event: Omit<Event, 'id' | 'created_at'>) => {
    const newEvent: Event = {
      ...event,
      id: `local-${Date.now()}`,
      created_at: new Date().toISOString(),
    }
    const localEvents = getLocalEvents()
    const updatedEvents = [...localEvents, newEvent]
    saveLocalEvents(updatedEvents)
    // Refresh the events list
    setEvents(prev => [...prev, newEvent].sort(
      (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    ))
    return newEvent
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  // Listen for storage changes from other tabs/pages
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'fay-local-events') {
        fetchEvents()
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [fetchEvents])

  return { events, loading, error, refetch: fetchEvents, addEvent, isDemo: isDemoMode() }
}

// Hook for fetching grocery items
export function useGrocery(showChecked = false) {
  const [items, setItems] = useState<GroceryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const url = `/api/grocery?show_checked=${showChecked}`
    const fallback = showChecked
      ? DEMO_GROCERY
      : DEMO_GROCERY.filter((g) => !g.is_checked)

    try {
      const data = await fetchWithFallback<GroceryItem[]>(url, fallback)
      setItems(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [showChecked])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const toggleItem = async (id: string, isChecked: boolean) => {
    if (isDemoMode()) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_checked: isChecked } : item
        )
      )
      return
    }

    try {
      await fetch(`/api/grocery/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_checked: isChecked }),
      })
      fetchItems()
    } catch (e) {
      console.error('Failed to toggle item:', e)
    }
  }

  const addItem = async (name: string, quantity = 1) => {
    if (isDemoMode()) {
      const newItem: GroceryItem = {
        id: `demo-${Date.now()}`,
        name,
        quantity,
        is_checked: false,
        added_by: null,
        created_at: new Date().toISOString(),
      }
      setItems((prev) => [newItem, ...prev])
      return
    }

    try {
      await fetch('/api/grocery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, quantity }),
      })
      fetchItems()
    } catch (e) {
      console.error('Failed to add item:', e)
    }
  }

  const removeItem = async (id: string) => {
    if (isDemoMode()) {
      setItems((prev) => prev.filter((item) => item.id !== id))
      return
    }

    try {
      await fetch(`/api/grocery/${id}`, { method: 'DELETE' })
      fetchItems()
    } catch (e) {
      console.error('Failed to remove item:', e)
    }
  }

  return {
    items,
    loading,
    error,
    refetch: fetchItems,
    toggleItem,
    addItem,
    removeItem,
    isDemo: isDemoMode(),
  }
}

// Hook for fetching a random quote
export function useQuote() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchQuote = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchWithFallback<Quote>('/api/quotes?random=true', getRandomDemoQuote())
      setQuote(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQuote()
  }, [fetchQuote])

  return { quote, loading, refresh: fetchQuote, isDemo: isDemoMode() }
}

// Hook for fetching Google Calendar events
export function useGoogleCalendar() {
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConfigured, setIsConfigured] = useState(true)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/google-calendar')
      if (response.status === 503) {
        // Google Calendar not configured
        setIsConfigured(false)
        setEvents([])
        return
      }
      if (!response.ok) {
        throw new Error('Failed to fetch Google Calendar events')
      }
      const data = await response.json()
      setEvents(data)
      setIsConfigured(true)
    } catch (e: any) {
      console.warn('Google Calendar fetch failed:', e)
      setError(e.message)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents()
    // Refresh every 5 minutes
    const interval = setInterval(fetchEvents, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchEvents])

  return { events, loading, error, refetch: fetchEvents, isConfigured }
}

// Hook for dashboard data (combines multiple sources)
export function useDashboardData() {
  const { users, loading: usersLoading } = useUsers()
  const { goals, loading: goalsLoading, refetch: refetchGoals } = useGoals()
  const { quote, loading: quoteLoading, refresh: refreshQuote } = useQuote()

  const loading = usersLoading || goalsLoading || quoteLoading

  // Group goals by user
  const goalsByUser = users.map((user) => ({
    user,
    goals: goals.filter((g) => g.user_id === user.id),
  }))

  // Calculate stats
  const stats = {
    totalGoals: goals.length,
    completedGoals: goals.filter((g) => g.is_completed).length,
    onTrackGoals: goals.filter((g) => {
      if (!g.target_value || g.is_completed) return false
      const progress = (g.current_value / g.target_value) * 100
      return progress >= 50
    }).length,
    needsAttention: 0,
  }
  stats.needsAttention = stats.totalGoals - stats.completedGoals - stats.onTrackGoals

  return {
    users,
    goals,
    goalsByUser,
    quote,
    stats,
    loading,
    refetchGoals,
    refreshQuote,
    isDemo: isDemoMode(),
  }
}

// Hook for TV display data
export function useTVData() {
  const { users } = useUsers()
  const { goals, refetch: refetchGoals } = useGoals()
  const { items: groceryItems, toggleItem } = useGrocery(true)
  const { quote, refresh: refreshQuote } = useQuote()
  const { events: supabaseEvents, refetch: refetchEvents } = useEvents()
  const { events: googleCalendarEvents, isConfigured: googleConfigured, refetch: refetchGoogleCalendar } = useGoogleCalendar()

  // Use Google Calendar events if configured, otherwise fall back to Supabase/demo events
  const events = googleConfigured && googleCalendarEvents.length > 0
    ? googleCalendarEvents.map(e => ({
        id: e.id,
        title: e.title,
        description: e.description,
        start_time: e.start_time,
        end_time: e.end_time,
        is_all_day: e.is_all_day,
        recurrence_rule: null,
        location: e.location,
        color: e.color,
        created_at: new Date().toISOString(),
        calendar_name: e.calendar_name,
      }))
    : supabaseEvents

  // Group goals by user with progress
  const goalsByUser = users.map((user) => ({
    user,
    goals: goals
      .filter((g) => g.user_id === user.id && !g.is_completed)
      .slice(0, 5)
      .map((g) => ({
        ...g,
        progress: g.target_value
          ? Math.round((g.current_value / g.target_value) * 100)
          : 0,
      })),
  }))

  // Calculate Hawaii countdown from events
  const hawaiiEvent = events.find(
    (e) => e.title.toLowerCase().includes('hawaii') || e.location?.toLowerCase().includes('hawaii')
  )
  let daysUntilHawaii = 4 // Default fallback
  if (hawaiiEvent) {
    const eventDate = new Date(hawaiiEvent.start_time)
    const today = new Date()
    daysUntilHawaii = Math.max(0, Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
  }

  // Auto-refresh events every 30 seconds for TV display
  useEffect(() => {
    const interval = setInterval(() => {
      refetchEvents()
    }, 30 * 1000)
    return () => clearInterval(interval)
  }, [refetchEvents])

  // Also refresh when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      refetchEvents()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refetchEvents])

  return {
    users,
    goalsByUser,
    groceryItems,
    toggleGroceryItem: toggleItem,
    quote,
    events,
    daysUntilHawaii,
    refreshQuote,
    refetchGoals,
    refetchEvents,
    refetchGoogleCalendar,
    isDemo: isDemoMode(),
    googleCalendarConfigured: googleConfigured,
  }
}
