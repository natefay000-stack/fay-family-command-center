// Google Calendar configuration and types

export interface GoogleCalendarConfig {
  id: string | undefined
  name: string
  color: string
  owner?: string // Which family member owns this calendar
}

// Function to get calendars at runtime (not build time)
export function getGoogleCalendars(): GoogleCalendarConfig[] {
  return [
    {
      id: process.env.GCAL_NATE,
      name: 'Nate',
      color: '#3B82F6',  // Blue
      owner: 'Nate'
    },
    {
      id: process.env.GCAL_DALTON,
      name: 'Dalton',
      color: '#22C55E',  // Green
      owner: 'Dalton'
    },
    {
      id: process.env.GCAL_MASON,
      name: 'Mason',
      color: '#F97316',  // Orange
      owner: 'Mason'
    },
    {
      id: process.env.GCAL_DALTON_BASEBALL,
      name: 'Dalton Baseball',
      color: '#EF4444',  // Red
      owner: 'Dalton'
    },
    {
      id: process.env.GCAL_MASON_BASEBALL,
      name: 'Mason Baseball',
      color: '#8B5CF6',  // Purple
      owner: 'Mason'
    },
    {
      id: process.env.GCAL_FAY_FAMILY,
      name: 'Fay Family',
      color: '#06B6D4',  // Cyan
    },
  ]
}

// Keep this for backward compatibility but it will be empty at build time
export const GOOGLE_CALENDARS: GoogleCalendarConfig[] = []

// Type for events returned from the Google Calendar API route
export interface GoogleCalendarEvent {
  id: string
  title: string
  description: string | null
  start_time: string
  end_time: string | null
  is_all_day: boolean
  location: string | null
  color: string
  calendar_name: string
  calendar_owner?: string
}

// Color mapping for TV display gradients
export const CALENDAR_COLOR_MAP: Record<string, string> = {
  '#3B82F6': 'from-[#1d4ed8] to-[#1e40af]',   // Blue (Nate)
  '#22C55E': 'from-[#15803d] to-[#166534]',   // Green (Dalton)
  '#F97316': 'from-[#ea580c] to-[#c2410c]',   // Orange (Mason)
  '#EF4444': 'from-[#dc2626] to-[#b91c1c]',   // Red (Dalton Baseball)
  '#8B5CF6': 'from-[#7c3aed] to-[#6d28d9]',   // Purple (Mason Baseball)
  '#06B6D4': 'from-[#0891b2] to-[#0e7490]',   // Cyan (Fay Family)
}
