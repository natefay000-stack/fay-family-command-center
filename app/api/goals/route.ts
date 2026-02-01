import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { CreateGoalInput } from '@/lib/types'

// GET /api/goals - Get all goals or filter by user_id
export async function GET(request: Request) {
  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user_id')
  const category = searchParams.get('category')

  let query = supabase.from('goals').select('*').order('created_at', { ascending: false })

  if (userId) {
    query = query.eq('user_id', userId)
  }
  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/goals - Create a new goal
export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const body: CreateGoalInput = await request.json()

    const { data, error } = await supabase
      .from('goals')
      .insert(body)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
