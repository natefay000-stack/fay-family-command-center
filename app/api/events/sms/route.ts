import { NextResponse } from 'next/server'
import { google } from 'googleapis'

// Twilio SMS webhook - receives texts and adds to Google Calendar
// Twilio sends: Body (message), From (phone), To (your Twilio number)

// Calendar IDs
const CALENDAR_IDS: Record<string, string> = {
  nate: process.env.GCAL_NATE || '',
  dalton: process.env.GCAL_DALTON || '',
  mason: process.env.GCAL_MASON || '',
  family: process.env.GCAL_FAY_FAMILY || '',
  'dalton-baseball': process.env.GCAL_DALTON_BASEBALL || '',
  'mason-baseball': process.env.GCAL_MASON_BASEBALL || '',
}

// Map phone numbers to users (add your numbers here)
const PHONE_TO_USER: Record<string, string> = {
  // '+18015551234': 'nate',
}

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
  } catch {
    return null
  }
}

function parseEventText(text: string): {
  title: string
  user: string | null
  date: Date
  endDate: Date
  location: string | null
  isBaseball: boolean
} {
  const now = new Date()
  let title = text.trim()
  let user: string | null = null
  let date: Date = new Date(now)
  let location: string | null = null
  let isBaseball = /\b(baseball|practice|game|tournament)\b/i.test(text)

  // Extract location
  const locationMatch = text.match(/(?:@|at)\s+(.+?)(?:\s+(?:on|at|\d)|\s*$)/i)
  if (locationMatch) {
    location = locationMatch[1].trim()
    title = title.replace(locationMatch[0], ' ').trim()
  }

  // Extract user
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
    'sunday': 0, 'sun': 0, 'monday': 1, 'mon': 1,
    'tuesday': 2, 'tue': 2, 'wednesday': 3, 'wed': 3,
    'thursday': 4, 'thu': 4, 'friday': 5, 'fri': 5,
    'saturday': 6, 'sat': 6,
  }

  if (/\btoday\b/i.test(text)) {
    title = title.replace(/\btoday\b/i, ' ').trim()
  } else if (/\btomorrow\b/i.test(text)) {
    date.setDate(date.getDate() + 1)
    title = title.replace(/\btomorrow\b/i, ' ').trim()
  } else {
    for (const [dayName, dayNum] of Object.entries(dayPatterns)) {
      const regex = new RegExp(`\\b${dayName}\\b`, 'i')
      if (regex.test(text)) {
        const currentDay = date.getDay()
        let daysUntil = dayNum - currentDay
        if (daysUntil <= 0) daysUntil += 7
        date.setDate(date.getDate() + daysUntil)
        title = title.replace(regex, ' ').trim()
        break
      }
    }
  }

  // Specific dates
  const dateMatch = text.match(/\b(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2})|(\d{1,2})\/(\d{1,2}))\b/i)
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
      date = new Date(now.getFullYear(), month, day)
    }
    title = title.replace(dateMatch[0], ' ').trim()
  }

  date.setHours(hours, minutes, 0, 0)

  // End time
  let endDate = new Date(date)
  if (endTimeMatch) {
    let endHours = parseInt(endTimeMatch[1])
    const endMinutes = endTimeMatch[2] ? parseInt(endTimeMatch[2]) : 0
    const isPM = endTimeMatch[3].toLowerCase() === 'pm'
    if (isPM && endHours !== 12) endHours += 12
    if (!isPM && endHours === 12) endHours = 0
    endDate.setHours(endHours, endMinutes, 0, 0)
    title = title.replace(endTimeMatch[0], ' ').trim()
  } else {
    endDate.setHours(endDate.getHours() + 1)
  }

  title = title.replace(/\s+/g, ' ').trim()
  return { title, user, date, endDate, location, isBaseball }
}

const USER_COLORS: Record<string, string> = {
  'nate': '9', 'dalton': '11', 'mason': '6', 'family': '10',
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let body: string
    let fromPhone: string | null = null

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData()
      body = formData.get('Body') as string || ''
      fromPhone = formData.get('From') as string || null
    } else {
      const json = await request.json()
      body = json.text || json.Body || ''
      fromPhone = json.from || json.From || null
    }

    if (!body) {
      const errorXml = `<?xml version="1.0"?><Response><Message>Please include event details</Message></Response>`
      return new Response(errorXml, { headers: { 'Content-Type': 'text/xml' } })
    }

    const parsed = parseEventText(body)

    // Determine user
    let eventUser = parsed.user
    if (!eventUser && fromPhone && PHONE_TO_USER[fromPhone]) {
      eventUser = PHONE_TO_USER[fromPhone]
    }
    if (!eventUser) eventUser = 'family'

    // Get calendar
    let calendarId = CALENDAR_IDS[eventUser] || CALENDAR_IDS.family
    if (parsed.isBaseball && (eventUser === 'mason' || eventUser === 'dalton')) {
      calendarId = CALENDAR_IDS[`${eventUser}-baseball`] || calendarId
    }

    const calendar = getCalendarClient()
    if (!calendar) {
      const errorXml = `<?xml version="1.0"?><Response><Message>Calendar not configured</Message></Response>`
      return new Response(errorXml, { headers: { 'Content-Type': 'text/xml' } })
    }

    // Create event
    await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: parsed.title || body,
        location: parsed.location || undefined,
        start: { dateTime: parsed.date.toISOString(), timeZone: 'America/Denver' },
        end: { dateTime: parsed.endDate.toISOString(), timeZone: 'America/Denver' },
        colorId: USER_COLORS[eventUser],
        description: `Added via SMS: "${body}"`,
      },
    })

    // Format confirmation
    const dateStr = parsed.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    const timeStr = parsed.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    const confirmMsg = `✅ Added: ${parsed.title}\n📅 ${dateStr} at ${timeStr}${parsed.location ? `\n📍 ${parsed.location}` : ''}`

    // Return TwiML for Twilio or JSON for other clients
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const xml = `<?xml version="1.0"?><Response><Message>${confirmMsg}</Message></Response>`
      return new Response(xml, { headers: { 'Content-Type': 'text/xml' } })
    }

    return NextResponse.json({ success: true, message: confirmMsg, parsed })

  } catch (error) {
    console.error('SMS error:', error)
    const errorXml = `<?xml version="1.0"?><Response><Message>Error adding event. Try again.</Message></Response>`
    return new Response(errorXml, { headers: { 'Content-Type': 'text/xml' } })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'SMS webhook ready for Twilio',
    twilio_setup: {
      step1: 'Create Twilio account at twilio.com',
      step2: 'Buy a phone number (~$1/month)',
      step3: 'Go to Phone Numbers > Manage > Active Numbers',
      step4: 'Set Messaging webhook to: https://your-domain.com/api/events/sms',
      step5: 'Text "Mason practice Saturday 8am @ Mountain West" to your number',
    },
    examples: [
      'Mason practice Saturday 8am',
      'Dalton game tomorrow 4pm @ Mountain West',
      'Family dinner Friday 6:30pm at Grandmas',
    ]
  })
}
