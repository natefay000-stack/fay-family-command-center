import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { getGoogleCalendars, type GoogleCalendarEvent } from '@/lib/google-calendar'

// Cache for calendar events (5 minute TTL)
let cachedEvents: GoogleCalendarEvent[] | null = null
let cacheTimestamp: number = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Initialize Google Calendar API client
function getCalendarClient() {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON

  if (!serviceAccountJson) {
    return null
  }

  try {
    const credentials = JSON.parse(serviceAccountJson)
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    })

    return google.calendar({ version: 'v3', auth })
  } catch (error) {
    console.error('Failed to initialize Google Calendar client:', error)
    return null
  }
}

// Fetch events from a single calendar
async function fetchCalendarEvents(
  calendar: ReturnType<typeof google.calendar>,
  calendarId: string,
  calendarName: string,
  color: string,
  owner?: string
): Promise<GoogleCalendarEvent[]> {
  const now = new Date()
  const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  try {
    const response = await calendar.events.list({
      calendarId,
      timeMin: oneWeekAgo.toISOString(),
      timeMax: twoWeeksFromNow.toISOString(),
      singleEvents: true, // Expand recurring events
      orderBy: 'startTime',
      maxResults: 100,
    })

    const events = response.data.items || []

    return events.map((event): GoogleCalendarEvent => {
      const isAllDay = !event.start?.dateTime
      const startTime = event.start?.dateTime || event.start?.date || ''
      const endTime = event.end?.dateTime || event.end?.date || null

      return {
        id: event.id || `gcal-${Date.now()}-${Math.random()}`,
        title: event.summary || 'Untitled Event',
        description: event.description || null,
        start_time: startTime,
        end_time: endTime,
        is_all_day: isAllDay,
        location: event.location || null,
        color,
        calendar_name: calendarName,
        calendar_owner: owner,
      }
    })
  } catch (error) {
    console.error(`Failed to fetch events from ${calendarName}:`, error)
    return []
  }
}

export async function GET() {
  // Check cache first
  const now = Date.now()
  if (cachedEvents && (now - cacheTimestamp) < CACHE_TTL) {
    return NextResponse.json(cachedEvents)
  }

  const calendarClient = getCalendarClient()

  if (!calendarClient) {
    return NextResponse.json(
      { error: 'Google Calendar not configured. Add GOOGLE_SERVICE_ACCOUNT_JSON to .env.local' },
      { status: 503 }
    )
  }

  // Filter out calendars without IDs configured
  const configuredCalendars = getGoogleCalendars().filter(cal => cal.id)

  if (configuredCalendars.length === 0) {
    return NextResponse.json(
      { error: 'No calendar IDs configured. Add GCAL_* variables to .env.local' },
      { status: 503 }
    )
  }

  // Fetch events from all calendars in parallel
  const eventPromises = configuredCalendars.map(cal =>
    fetchCalendarEvents(
      calendarClient,
      cal.id!,
      cal.name,
      cal.color,
      cal.owner
    )
  )

  const results = await Promise.all(eventPromises)

  // Flatten and sort all events by start time
  const allEvents = results
    .flat()
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())

  // Update cache
  cachedEvents = allEvents
  cacheTimestamp = now

  return NextResponse.json(allEvents)
}
