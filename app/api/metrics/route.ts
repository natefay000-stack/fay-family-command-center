import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { CreateMetricInput } from '@/lib/types'

// GET /api/metrics - Get metrics, optionally filtered
export async function GET(request: Request) {
  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const goalId = searchParams.get('goal_id')
  const userId = searchParams.get('user_id')
  const days = searchParams.get('days')

  let query = supabase.from('metrics').select('*').order('recorded_at', { ascending: false })

  if (goalId) {
    query = query.eq('goal_id', goalId)
  }
  if (userId) {
    query = query.eq('user_id', userId)
  }
  if (days) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(days))
    query = query.gte('recorded_at', startDate.toISOString().split('T')[0])
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/metrics - Create a new metric entry
export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const body: CreateMetricInput = await request.json()

    // Insert the metric
    const { data: metric, error: metricError } = await supabase
      .from('metrics')
      .insert(body)
      .select()
      .single()

    if (metricError) {
      return NextResponse.json({ error: metricError.message }, { status: 500 })
    }

    // Update the goal's current_value
    const { error: goalError } = await supabase
      .from('goals')
      .update({ current_value: body.value })
      .eq('id', body.goal_id)

    if (goalError) {
      console.error('Failed to update goal current_value:', goalError)
    }

    return NextResponse.json(metric, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
