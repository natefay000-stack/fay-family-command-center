import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { CreateEventInput } from '@/lib/types'

// GET /api/events - Get events, optionally filtered by date range or user
export async function GET(request: Request) {
  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get('start_date')
  const endDate = searchParams.get('end_date')
  const userId = searchParams.get('user_id')

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
    query = query.gte('start_time', startDate)
  }
  if (endDate) {
    query = query.lte('start_time', endDate)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Transform and filter by user if needed
  let events = (data || []).map((event: any) => ({
    ...event,
    participants: event.participants?.map((p: any) => p.user).filter(Boolean) || [],
  }))

  if (userId) {
    events = events.filter((e: any) =>
      e.participants.some((p: any) => p.id === userId)
    )
  }

  return NextResponse.json(events)
}

// POST /api/events - Create a new event
export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const body: CreateEventInput = await request.json()
    const { participant_ids, ...eventData } = body

    // Insert the event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single()

    if (eventError) {
      return NextResponse.json({ error: eventError.message }, { status: 500 })
    }

    // Add participants if provided
    if (event && participant_ids && participant_ids.length > 0) {
      const participants = participant_ids.map((userId) => ({
        event_id: event.id,
        user_id: userId,
      }))

      const { error: participantError } = await supabase
        .from('event_participants')
        .insert(participants)

      if (participantError) {
        console.error('Failed to add participants:', participantError)
      }
    }

    return NextResponse.json(event, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
