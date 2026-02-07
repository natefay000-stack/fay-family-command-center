import { NextResponse } from 'next/server'

// Weather locations
const LOCATIONS = {
  herriman: { name: 'Herriman, UT', lat: 40.5141, lon: -112.0364 },
  stgeorge: { name: 'St. George, UT', lat: 37.0965, lon: -113.5684 },
  mesquite: { name: 'Mesquite, NV', lat: 36.8055, lon: -114.0672 },
  lasvegas: { name: 'Las Vegas, NV', lat: 36.1699, lon: -115.1398 },
}

// WMO Weather interpretation codes to emoji
function getWeatherIcon(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? '☀️' : '🌙' // Clear
  if (code <= 3) return isDay ? '🌤️' : '☁️' // Partly cloudy
  if (code <= 49) return '🌫️' // Fog
  if (code <= 59) return '🌧️' // Drizzle
  if (code <= 69) return '🌧️' // Rain
  if (code <= 79) return '❄️' // Snow
  if (code <= 84) return '🌧️' // Rain showers
  if (code <= 86) return '❄️' // Snow showers
  if (code >= 95) return '⛈️' // Thunderstorm
  return '🌡️'
}

function getConditionText(code: number): string {
  if (code === 0) return 'Clear'
  if (code <= 3) return 'Partly Cloudy'
  if (code <= 49) return 'Foggy'
  if (code <= 59) return 'Drizzle'
  if (code <= 69) return 'Rainy'
  if (code <= 79) return 'Snowy'
  if (code <= 84) return 'Rain Showers'
  if (code <= 86) return 'Snow Showers'
  if (code >= 95) return 'Thunderstorm'
  return 'Unknown'
}

async function fetchWeatherForLocation(lat: number, lon: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&temperature_unit=fahrenheit&timezone=America/Denver&forecast_days=1`

  const response = await fetch(url, { next: { revalidate: 1800 } }) // Cache 30 min
  if (!response.ok) throw new Error('Weather API error')
  return response.json()
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get('location') || 'herriman'

  const loc = LOCATIONS[location as keyof typeof LOCATIONS] || LOCATIONS.herriman

  try {
    const data = await fetchWeatherForLocation(loc.lat, loc.lon)

    const isDay = data.current.is_day === 1
    const currentCode = data.current.weather_code

    // Get next 4 hours
    const now = new Date()
    const currentHour = now.getHours()
    const hourly = []

    for (let i = 1; i <= 4; i++) {
      const hourIndex = currentHour + i
      if (hourIndex < 24 && data.hourly.temperature_2m[hourIndex]) {
        const hour = new Date(now)
        hour.setHours(hourIndex, 0, 0, 0)
        hourly.push({
          time: hour.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          temp: Math.round(data.hourly.temperature_2m[hourIndex]),
          icon: getWeatherIcon(data.hourly.weather_code[hourIndex], hourIndex >= 6 && hourIndex < 18),
        })
      }
    }

    const weather = {
      location: loc.name,
      current: {
        temp: Math.round(data.current.temperature_2m),
        condition: getConditionText(currentCode),
        icon: getWeatherIcon(currentCode, isDay),
        high: Math.round(data.daily.temperature_2m_max[0]),
        low: Math.round(data.daily.temperature_2m_min[0]),
      },
      hourly,
    }

    return NextResponse.json(weather)
  } catch (error) {
    console.error('Weather fetch error:', error)
    // Return fallback
    return NextResponse.json({
      location: loc.name,
      current: {
        temp: 32,
        condition: 'Unknown',
        icon: '🌡️',
        high: 38,
        low: 25,
      },
      hourly: [],
    })
  }
}

// Endpoint to get weather for multiple locations (for rotation)
export async function POST(request: Request) {
  try {
    const { locations } = await request.json()

    const results = await Promise.all(
      (locations || ['herriman']).map(async (loc: string) => {
        const location = LOCATIONS[loc as keyof typeof LOCATIONS]
        if (!location) return null

        try {
          const data = await fetchWeatherForLocation(location.lat, location.lon)
          const isDay = data.current.is_day === 1
          return {
            id: loc,
            location: location.name,
            temp: Math.round(data.current.temperature_2m),
            condition: getConditionText(data.current.weather_code),
            icon: getWeatherIcon(data.current.weather_code, isDay),
          }
        } catch {
          return null
        }
      })
    )

    return NextResponse.json({ locations: results.filter(Boolean) })
  } catch {
    return NextResponse.json({ locations: [] })
  }
}
