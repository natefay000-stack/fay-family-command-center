// MLB Stats API - Free, no key required
// Docs: https://statsapi.mlb.com

const MLB_BASE_URL = 'https://statsapi.mlb.com/api/v1'

export interface MLBTeam {
  id: number
  name: string
  abbreviation: string
}

export interface MLBGame {
  gamePk: number
  gameDate: string
  status: {
    abstractGameState: 'Preview' | 'Live' | 'Final'
    detailedState: string
  }
  teams: {
    away: {
      team: MLBTeam
      score?: number
    }
    home: {
      team: MLBTeam
      score?: number
    }
  }
  venue: {
    name: string
  }
}

export interface MLBScheduleResponse {
  dates: Array<{
    date: string
    games: MLBGame[]
  }>
}

// Popular team IDs
export const MLB_TEAMS = {
  // AL West
  ANGELS: 108,
  ASTROS: 117,
  ATHLETICS: 133,
  MARINERS: 136,
  RANGERS: 140,
  // AL Central
  GUARDIANS: 114,
  ROYALS: 118,
  TIGERS: 116,
  TWINS: 142,
  WHITE_SOX: 145,
  // AL East
  BLUE_JAYS: 141,
  ORIOLES: 110,
  RAYS: 139,
  RED_SOX: 111,
  YANKEES: 147,
  // NL West
  DIAMONDBACKS: 109,
  DODGERS: 119,
  GIANTS: 137,
  PADRES: 135,
  ROCKIES: 115,
  // NL Central
  BREWERS: 158,
  CARDINALS: 138,
  CUBS: 112,
  PIRATES: 134,
  REDS: 113,
  // NL East
  BRAVES: 144,
  MARLINS: 146,
  METS: 121,
  NATIONALS: 120,
  PHILLIES: 143,
}

// Get team schedule for a date range
export async function getTeamSchedule(
  teamId: number,
  startDate: string,
  endDate: string
): Promise<MLBGame[]> {
  try {
    const url = `${MLB_BASE_URL}/schedule?sportId=1&teamId=${teamId}&startDate=${startDate}&endDate=${endDate}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Failed to fetch MLB schedule')
    }

    const data: MLBScheduleResponse = await response.json()

    return data.dates.flatMap(d => d.games)
  } catch (error) {
    console.error('MLB API error:', error)
    return []
  }
}

// Get today's games for a team
export async function getTeamTodayGame(teamId: number): Promise<MLBGame | null> {
  const today = new Date().toISOString().split('T')[0]
  const games = await getTeamSchedule(teamId, today, today)
  return games[0] || null
}

// Get next upcoming game for a team
export async function getTeamNextGame(teamId: number): Promise<MLBGame | null> {
  const today = new Date()
  const startDate = today.toISOString().split('T')[0]
  const endDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const games = await getTeamSchedule(teamId, startDate, endDate)

  // Find first game that hasn't finished
  return games.find(g => g.status.abstractGameState !== 'Final') || null
}

// Get live scores for multiple teams
export async function getLiveScores(teamIds: number[]): Promise<MLBGame[]> {
  const today = new Date().toISOString().split('T')[0]

  const allGames: MLBGame[] = []

  for (const teamId of teamIds) {
    const games = await getTeamSchedule(teamId, today, today)
    allGames.push(...games)
  }

  // Remove duplicates (same game appears for both teams)
  const uniqueGames = allGames.filter((game, index, self) =>
    index === self.findIndex(g => g.gamePk === game.gamePk)
  )

  return uniqueGames
}

// Get standings
export async function getStandings(leagueId: 103 | 104 = 103): Promise<any> {
  try {
    const url = `${MLB_BASE_URL}/standings?leagueId=${leagueId}&season=${new Date().getFullYear()}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Failed to fetch standings')
    }

    return await response.json()
  } catch (error) {
    console.error('MLB API error:', error)
    return null
  }
}

// Format game for display
export function formatGameDisplay(game: MLBGame): string {
  const away = game.teams.away
  const home = game.teams.home
  const status = game.status.abstractGameState

  if (status === 'Final') {
    return `${away.team.abbreviation} ${away.score} - ${home.team.abbreviation} ${home.score} FINAL`
  } else if (status === 'Live') {
    return `${away.team.abbreviation} ${away.score || 0} - ${home.team.abbreviation} ${home.score || 0} LIVE`
  } else {
    const gameTime = new Date(game.gameDate).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
    return `${away.team.abbreviation} @ ${home.team.abbreviation} ${gameTime}`
  }
}
