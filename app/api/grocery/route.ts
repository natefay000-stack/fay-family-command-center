import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { CreateGroceryItemInput } from '@/lib/types'

// GET /api/grocery - Get grocery items
export async function GET(request: Request) {
  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const showChecked = searchParams.get('show_checked') === 'true'

  let query = supabase.from('grocery_items').select('*').order('created_at', { ascending: false })

  if (!showChecked) {
    query = query.eq('is_checked', false)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/grocery - Add a grocery item
export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const body: CreateGroceryItemInput = await request.json()

    const { data, error } = await supabase
      .from('grocery_items')
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

// DELETE /api/grocery - Clear checked items
export async function DELETE(request: Request) {
  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const clearChecked = searchParams.get('clear_checked') === 'true'

  if (clearChecked) {
    const { error } = await supabase.from('grocery_items').delete().eq('is_checked', true)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
