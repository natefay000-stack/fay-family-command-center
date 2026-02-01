import { NextResponse } from 'next/server'
import { google } from 'googleapis'

// Quick add endpoint optimized for Apple Shortcuts
// POST: { "text": "Mason baseball Saturday 8am @ Mountain West" }
// Or with user: { "text": "baseball Saturday 8am", "user": "mason" }

// Calendar IDs from environment
const CALENDAR_IDS: Record<string, string> = {
  nate: process.env.GCAL_NATE || '',
  dalton: process.env.GCAL_DALTON || '',
  mason: process.env.GCAL_MASON || '',
  family: process.env.GCAL_FAY_FAMILY || '',
  'dalton-baseball': process.env.GCAL_DALTON_BASEBALL || '',
  'mason-baseball': process.env.GCAL_MASON_BASEBALL || '',
}

// Initialize Google Calendar API
function getCalendarClient() {
  try {
    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
    if (!serviceAccountJson) return null

    const credentials = JSON.parse(serviceAccountJson)
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    })

    return google.calendar({ version: 'v3', auth })
  } catch (error) {
    console.error('Failed to init Google Calendar:', error)
    return null
  }
}

// Parse natural language event text
function parseEventText(text: string): {
  title: string
  user: string | null
  date: Date | null
  endDate: Date | null
  location: string | null
  isBaseball: boolean
} {
  const now = new Date()
  let title = text.trim()
  let user: string | null = null
  let date: Date | null = null
  let endDate: Date | null = null
  let location: string | null = null
  let isBaseball = false

  // Check if it's baseball related
  if (/\b(baseball|practice|game|tournament)\b/i.test(text)) {
    isBaseball = true
  }

  // Extract location (after @ or "at")
  const locationMatch = text.match(/(?:@|at)\s+(.+?)(?:\s+(?:on|at|\d)|\s*$)/i)
  if (locationMatch) {
    location = locationMatch[1].trim()
    title = title.replace(locationMatch[0], ' ').trim()
  }

  // Extract user/person
  const userMatch = text.match(/\b(mason|dalton|nate|family)\b/i)
  if (userMatch) {
    user = userMatch[1].toLowerCase()
  }

  // Extract time
  const timeMatch = text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i)
  let hours = 9
  let minutes = 0
  if (timeMatch) {
    hours = parseInt(timeMatch[1])
    minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0
    const isPM = timeMatch[3].toLowerCase() === 'pm'
    if (isPM && hours !== 12) hours += 12
    if (!isPM && hours === 12) hours = 0
    title = title.replace(timeMatch[0], ' ').trim()
  }

  // Extract end time
  const endTimeMatch = text.match(/(?:-|to)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i)

  // Day patterns
  const dayPatterns: Record<string, number> = {
    'sunday': 0, 'sun': 0,
    'monday': 1, 'mon': 1,
    'tuesday': 2, 'tue': 2, 'tues': 2,
    'wednesday': 3, 'wed': 3,
    'thursday': 4, 'thu': 4, 'thur': 4, 'thurs': 4,
    'friday': 5, 'fri': 5,
    'saturday': 6, 'sat': 6,
  }

  // Check for relative days
  if (/\btoday\b/i.test(text)) {
    date = new Date(now)
    title = title.replace(/\btoday\b/i, ' ').trim()
  } else if (/\btomorrow\b/i.test(text)) {
    date = new Date(now)
    date.setDate(date.getDate() + 1)
    title = title.replace(/\btomorrow\b/i, ' ').trim()
  } else {
    for (const [dayName, dayNum] of Object.entries(dayPatterns)) {
      const regex = new RegExp(`\\b${dayName}\\b`, 'i')
      if (regex.test(text)) {
        date = new Date(now)
        const currentDay = date.getDay()
        let daysUntil = dayNum - currentDay
        if (daysUntil <= 0) daysUntil += 7
        date.setDate(date.getDate() + daysUntil)
        title = title.replace(regex, ' ').trim()
        break
      }
    }
  }

  // Check for specific dates
  const dateMatch = text.match(/\b(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2})(?:st|nd|rd|th)?|(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?)\b/i)
  if (dateMatch) {
    if (dateMatch[1]) {
      const months: Record<string, number> = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
        jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
      }
      const month = months[dateMatch[1].toLowerCase().slice(0, 3)]
      const day = parseInt(dateMatch[2])
      date = new Date(now.getFullYear(), month, day)
      if (date < now) date.setFullYear(date.getFullYear() + 1)
    } else {
      const month = parseInt(dateMatch[3]) - 1
      const day = parseInt(dateMatch[4])
      let year = dateMatch[5] ? parseInt(dateMatch[5]) : now.getFullYear()
      if (year < 100) year += 2000
      date = new Date(year, month, day)
    }
    title = title.replace(dateMatch[0], ' ').trim()
  }

  if (!date) date = new Date(now)
  date.setHours(hours, minutes, 0, 0)

  // Set end time
  if (endTimeMatch) {
    endDate = new Date(date)
    let endHours = parseInt(endTimeMatch[1])
    const endMinutes = endTimeMatch[2] ? parseInt(endTimeMatch[2]) : 0
    const isPM = endTimeMatch[3].toLowerCase() === 'pm'
    if (isPM && endHours !== 12) endHours += 12
    if (!isPM && endHours === 12) endHours = 0
    endDate.setHours(endHours, endMinutes, 0, 0)
    title = title.replace(endTimeMatch[0], ' ').trim()
  } else {
    endDate = new Date(date)
    endDate.setHours(endDate.getHours() + 1)
  }

  title = title.replace(/\s+/g, ' ').replace(/^\s*[-–—]\s*/, '').trim()

  return { title, user, date, endDate, location, isBaseball }
}

// Event colors for Google Calendar (colorId)
const USER_COLORS: Record<string, string> = {
  'nate': '9',      // Blue
  'dalton': '11',   // Red
  'mason': '6',     // Orange
  'family': '10',   // Green
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const text = json.text || json.message || json.event || ''
    const userOverride = json.user || json.person || null

    if (!text) {
      return NextResponse.json({
        success: false,
        error: 'No text provided',
        speak: 'Please provide event details'
      }, { status: 400 })
    }

    const parsed = parseEventText(text)

    // Determine user and calendar
    let eventUser = userOverride?.toLowerCase() || parsed.user || 'family'

    // Determine which calendar to use
    let calendarId = CALENDAR_IDS[eventUser] || CALENDAR_IDS.family

    // If it's baseball-related, use the baseball calendar
    if (parsed.isBaseball && (eventUser === 'mason' || eventUser === 'dalton')) {
      calendarId = CALENDAR_IDS[`${eventUser}-baseball`] || calendarId
    }

    if (!calendarId) {
      return NextResponse.json({
        success: false,
        error: 'No calendar configured for this user',
        speak: 'Calendar not configured'
      }, { status: 400 })
    }

    const calendar = getCalendarClient()
    if (!calendar) {
      return NextResponse.json({
        success: false,
        error: 'Google Calendar not configured',
        speak: 'Calendar service unavailable'
      }, { status: 500 })
    }

    // Create the event
    const event = {
      summary: parsed.title || text,
      location: parsed.location || undefined,
      start: {
        dateTime: parsed.date?.toISOString(),
        timeZone: 'America/Denver',
      },
      end: {
        dateTime: parsed.endDate?.toISOString(),
        timeZone: 'America/Denver',
      },
      colorId: USER_COLORS[eventUser] || undefined,
      description: `Added via Quick Add: "${text}"`,
    }

    const result = await calendar.events.insert({
      calendarId,
      requestBody: event,
    })

    // Format response for Shortcuts
    const dateStr = parsed.date?.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })
    const timeStr = parsed.date?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })

    const speakText = `Added ${parsed.title} on ${dateStr} at ${timeStr}${parsed.location ? ` at ${parsed.location}` : ''}`

    return NextResponse.json({
      success: true,
      speak: speakText,
      event: {
        id: result.data.id,
        title: parsed.title,
        date: dateStr,
        time: timeStr,
        location: parsed.location,
        user: eventUser,
        calendar: calendarId,
        link: result.data.htmlLink,
      }
    })

  } catch (error: unknown) {
    console.error('Quick add error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({
      success: false,
      error: message,
      speak: 'Sorry, something went wrong'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Quick Add API ready',
    usage: {
      method: 'POST',
      body: {
        text: 'Mason baseball Saturday 8am @ Mountain West',
        user: 'optional - defaults to parsed user or family'
      }
    },
    examples: [
      { text: 'Mason practice Saturday 8am' },
      { text: 'game tomorrow 4pm @ Mountain West', user: 'dalton' },
      { text: 'Family dinner Friday 6:30pm at Grandmas' },
    ],
    calendars: Object.keys(CALENDAR_IDS).filter(k => CALENDAR_IDS[k]),
    shortcut_setup: {
      step1: 'Create new Shortcut',
      step2: 'Add "Dictate Text" or "Ask for Input" action',
      step3: 'Add "Get Contents of URL" action',
      step4: 'Set URL to: https://your-domain.com/api/events/quick',
      step5: 'Set Method to POST, Request Body to JSON',
      step6: 'Add key "text" with value from Step 2',
      step7: 'Optionally add "Speak Text" with response.speak'
    }
  })
}
