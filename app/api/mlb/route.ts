import { NextResponse } from 'next/server'
import {
  getTeamSchedule,
  getTeamNextGame,
  getLiveScores,
  formatGameDisplay,
  MLB_TEAMS,
  type MLBGame,
} from '@/lib/mlb-api'

// Configure favorite teams here
const FAVORITE_TEAMS = [
  MLB_TEAMS.DODGERS,  // LA Dodgers
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action') || 'scores'

  try {
    if (action === 'scores') {
      // Get today's scores for favorite teams
      const games = await getLiveScores(FAVORITE_TEAMS)
      return NextResponse.json({
        games: games.map(g => ({
          ...g,
          display: formatGameDisplay(g),
        })),
      })
    }

    if (action === 'next') {
      // Get next game for primary team
      const nextGame = await getTeamNextGame(FAVORITE_TEAMS[0])
      if (!nextGame) {
        return NextResponse.json({ game: null, message: 'No upcoming games' })
      }
      return NextResponse.json({
        game: nextGame,
        display: formatGameDisplay(nextGame),
      })
    }

    if (action === 'schedule') {
      // Get 2-week schedule
      const today = new Date()
      const startDate = today.toISOString().split('T')[0]
      const endDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]

      const games = await getTeamSchedule(FAVORITE_TEAMS[0], startDate, endDate)
      return NextResponse.json({
        games: games.map(g => ({
          ...g,
          display: formatGameDisplay(g),
        })),
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('MLB API route error:', error)
    return NextResponse.json({ error: 'Failed to fetch MLB data' }, { status: 500 })
  }
}
