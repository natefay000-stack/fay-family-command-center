import { NextResponse } from 'next/server'

// Demo weather data for Salt Lake City area
const DEMO_WEATHER = {
  location: 'Herriman, UT 84096',
  current: {
    temp: 30,
    condition: 'Partly Cloudy',
    icon: '❄️',
    humidity: 71,
    wind_speed: 2,
    wind_direction: 'NE',
  },
  hourly: [
    { time: '6 PM', temp: 28, icon: '🌤️' },
    { time: '9 PM', temp: 27, icon: '☁️' },
    { time: '10 PM', temp: 26, icon: '☁️' },
    { time: '11 PM', temp: 25, icon: '🌙' },
  ],
}

// GET /api/weather - Get current weather
export async function GET() {
  const apiKey = process.env.OPENWEATHER_API_KEY

  // If no API key, return demo weather
  if (!apiKey) {
    return NextResponse.json(DEMO_WEATHER)
  }

  try {
    // Herriman, UT coordinates
    const lat = 40.5141
    const lon = -112.0330

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`,
      { next: { revalidate: 900 } } // Cache for 15 minutes
    )

    if (!response.ok) {
      console.error('Weather API error:', response.status)
      return NextResponse.json(DEMO_WEATHER)
    }

    const data = await response.json()

    // Get hourly forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&cnt=4&appid=${apiKey}`,
      { next: { revalidate: 900 } }
    )

    let hourly = DEMO_WEATHER.hourly
    if (forecastResponse.ok) {
      const forecastData = await forecastResponse.json()
      hourly = forecastData.list.map((item: any) => {
        const date = new Date(item.dt * 1000)
        return {
          time: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          temp: Math.round(item.main.temp),
          icon: getWeatherIcon(item.weather[0].id, item.sys.pod === 'd'),
        }
      })
    }

    // Map OpenWeather data to our format
    const weather = {
      location: 'Herriman, UT 84096',
      current: {
        temp: Math.round(data.main.temp),
        condition: data.weather[0].description,
        icon: getWeatherIcon(data.weather[0].id, data.weather[0].icon.includes('d')),
        humidity: data.main.humidity,
        wind_speed: Math.round(data.wind.speed),
        wind_direction: getWindDirection(data.wind.deg),
      },
      hourly,
    }

    return NextResponse.json(weather)
  } catch (error) {
    console.error('Weather fetch error:', error)
    return NextResponse.json(DEMO_WEATHER)
  }
}

// Convert wind degrees to direction
function getWindDirection(deg: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(deg / 45) % 8
  return directions[index]
}

// Map OpenWeather condition codes to emoji icons
function getWeatherIcon(code: number, isDay: boolean): string {
  if (code >= 200 && code < 300) return '⛈️' // Thunderstorm
  if (code >= 300 && code < 400) return '🌧️' // Drizzle
  if (code >= 500 && code < 600) return '🌧️' // Rain
  if (code >= 600 && code < 700) return '❄️' // Snow
  if (code >= 700 && code < 800) return '🌫️' // Atmosphere
  if (code === 800) return isDay ? '☀️' : '🌙' // Clear
  if (code === 801) return isDay ? '🌤️' : '🌙' // Few clouds
  if (code >= 802 && code < 900) return '☁️' // Cloudy
  return '🌡️'
}
