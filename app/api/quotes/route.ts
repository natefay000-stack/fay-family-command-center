import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Demo quotes for fallback
const DEMO_QUOTES = [
  { id: '1', text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', is_active: true },
  { id: '2', text: "Hard work beats talent when talent doesn't work hard.", author: 'Tim Notke', is_active: true },
  { id: '3', text: "I've missed more than 9000 shots in my career. I've lost almost 300 games. 26 times, I've been trusted to take the game winning shot and missed. I've failed over and over and over again in my life. And that is why I succeed.", author: 'Michael Jordan', is_active: true },
  { id: '4', text: "You miss 100% of the shots you don't take.", author: 'Wayne Gretzky', is_active: true },
  { id: '5', text: 'Champions keep playing until they get it right.', author: 'Billie Jean King', is_active: true },
]

// GET /api/quotes - Get active quotes or a random one
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const random = searchParams.get('random') === 'true'

  const supabase = await createClient()

  // If Supabase is not configured, use demo quotes
  if (!supabase) {
    if (random) {
      const randomQuote = DEMO_QUOTES[Math.floor(Math.random() * DEMO_QUOTES.length)]
      return NextResponse.json(randomQuote)
    }
    return NextResponse.json(DEMO_QUOTES)
  }

  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('is_active', true)

  if (error) {
    // Fallback to demo quotes on error
    if (random) {
      const randomQuote = DEMO_QUOTES[Math.floor(Math.random() * DEMO_QUOTES.length)]
      return NextResponse.json(randomQuote)
    }
    return NextResponse.json(DEMO_QUOTES)
  }

  const quotes = data && data.length > 0 ? data : DEMO_QUOTES

  if (random) {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    return NextResponse.json(randomQuote)
  }

  return NextResponse.json(quotes)
}
