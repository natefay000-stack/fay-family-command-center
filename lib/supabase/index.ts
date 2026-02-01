// Supabase exports for Fay Goals

// Client utilities
export { createClient as createBrowserClient } from './client'
export { createClient as createServerClient } from './server'

// Client-side queries (for use in Client Components with 'use client')
export * from './queries'

// Re-export types
export type {
  User,
  Goal,
  Metric,
  Event,
  GroceryItem,
  Quote,
  Photo,
  UserRole,
  GoalCategory,
  GoalStatus,
  GoalWithUser,
  GoalWithMetrics,
  EventWithParticipants,
  MetricWithGoal,
  ApiResponse,
  CreateGoalInput,
  UpdateGoalInput,
  CreateMetricInput,
  CreateEventInput,
  CreateGroceryItemInput,
  GoalProgress,
  WeatherData,
  CalendarView,
  CalendarFilter,
} from '../types'
