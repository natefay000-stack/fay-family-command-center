import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const supabase = await createClient()

  if (!supabase) {
    return new NextResponse("Database not configured", { status: 503 })
  }

  const { userId } = await params

  // Verify the user exists
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (!profile) {
    return new NextResponse("User not found", { status: 404 })
  }

  // Fetch goals with target dates
  const { data: goals } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .not("target_date", "is", null)

  // Fetch milestones
  const { data: milestones } = await supabase
    .from("milestones")
    .select("*, goal:goals!inner(*)")
    .eq("goal.user_id", params.userId)

  // Generate iCalendar format
  const now = new Date()
  const formatDate = (date: string) => {
    const d = new Date(date)
    return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  let icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Fay Goals//Calendar Feed//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Fay Goals - ${profile.full_name}
X-WR-TIMEZONE:UTC
X-WR-CALDESC:Goals, milestones, and check-ins for ${profile.full_name}
`

  // Add goal target dates
  goals?.forEach((goal) => {
    const uid = `goal-${goal.id}@faygoals.app`
    const dtstart = formatDate(goal.target_date)
    const dtstamp = formatDate(goal.created_at)

    icalContent += `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART;VALUE=DATE:${dtstart.split("T")[0]}
SUMMARY:Goal: ${goal.title}
DESCRIPTION:Target date for goal: ${goal.title}
STATUS:${goal.status === "completed" ? "COMPLETED" : "CONFIRMED"}
CATEGORIES:GOAL
END:VEVENT
`
  })

  // Add milestones
  milestones?.forEach((milestone) => {
    const uid = `milestone-${milestone.id}@faygoals.app`
    const dtstart = formatDate(milestone.due_date)
    const dtstamp = formatDate(milestone.created_at)

    icalContent += `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART;VALUE=DATE:${dtstart.split("T")[0]}
SUMMARY:Milestone: ${milestone.title}
DESCRIPTION:Milestone for goal: ${milestone.goal.title}
STATUS:${milestone.completed ? "COMPLETED" : "CONFIRMED"}
CATEGORIES:MILESTONE
END:VEVENT
`
  })

  // Add recurring Tuesday check-in
  const firstTuesday = new Date(2026, 0, 6) // First Tuesday of 2026
  const checkInUid = `checkin-tuesday@faygoals.app`

  icalContent += `BEGIN:VEVENT
UID:${checkInUid}
DTSTAMP:${formatDate(now.toISOString())}
DTSTART;VALUE=DATE:20260106
SUMMARY:Weekly Check-in
DESCRIPTION:Weekly family check-in day
RRULE:FREQ=WEEKLY;BYDAY=TU;UNTIL=20261231
CATEGORIES:CHECK-IN
END:VEVENT
`

  icalContent += `END:VCALENDAR`

  return new NextResponse(icalContent, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="fay-goals-${profile.full_name.replace(/\s+/g, "-").toLowerCase()}.ics"`,
    },
  })
}
