# Fay Family Command Center

A family goal tracking dashboard designed for display on a 43" Samsung Frame TV.

## Features

- **Investment Command Center UI** - Polished dark theme with glows and gradients
- **Goal Tracking** - Track goals for Nate, Dalton, and Mason with progress bars
- **Google Calendar Integration** - Pull events from family calendars
- **Weather Display** - Live weather for Herriman, UT
- **Grocery List** - Shared list with QR codes for mobile access
- **Countdowns** - Track days until tournaments, MLB opening day, etc.
- **Text-to-Calendar** - Add events via SMS (Twilio) or Apple Shortcuts
- **Apple Health Sync** - Endpoint for fitness ring data

## Quick Links

- **TV Dashboard**: `/demo/tv`
- **Shortcut Setup**: `/demo/shortcut`

## Environment Variables

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Google Calendar
GOOGLE_SERVICE_ACCOUNT_JSON=
GCAL_NATE=
GCAL_DALTON=
GCAL_MASON=
GCAL_FAY_FAMILY=
GCAL_DALTON_BASEBALL=
GCAL_MASON_BASEBALL=
```

## Text-to-Calendar API

**Apple Shortcuts / HTTP:**
```
POST /api/events/quick
{ "text": "Mason practice Saturday 8am @ Mountain West" }
```

**Twilio SMS Webhook:**
```
POST /api/events/sms
```

## Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000/demo/tv` for the TV dashboard.

## Deployment

Deploy to Vercel and add environment variables in project settings.
