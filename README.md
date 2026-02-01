# Fay Goals - Family Goal Tracking App

A comprehensive family goal tracking application with Tuesday check-ins, metrics tracking, and SMS notifications powered by Supabase and Twilio.

## Features

- **Goal Management**: Create, track, and manage personal and family goals
- **Metrics Tracking**: Log daily metrics with visualization and trends
- **Tuesday Check-ins**: Weekly structured check-in system with family view
- **SMS Notifications**: Twilio-powered notifications for reminders and achievements
- **Calendar Integration**: iCal subscription for milestones and check-ins
- **Interactive Charts**: Progress tracking with Recharts visualizations
- **Family Dashboard**: See progress across all family members

## Environment Variables

### Required

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

# Auth
SUPABASE_JWT_SECRET=
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

### Optional (for SMS Notifications)

```
# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Security
CRON_SECRET=your-secure-random-string
INTERNAL_API_SECRET=your-internal-api-secret

# App URL (for notifications)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Setup Instructions

### 1. Database Setup

Run the SQL scripts in order:
1. `scripts/01-create-tables.sql` - Create initial tables
2. `scripts/02-seed-data.sql` - Seed with sample data (optional)
3. `scripts/03-check-ins-notifications.sql` - Add check-in and notification tables

### 2. Twilio Setup (Optional)

1. Sign up for a Twilio account at https://www.twilio.com
2. Get your Account SID, Auth Token, and a phone number
3. Add the credentials to your environment variables
4. Users can verify their phone numbers at `/settings/notifications`

### 3. Vercel Cron Jobs (Optional)

The app includes automated notifications via Vercel Cron Jobs:

- **Tuesday 9am**: Check-in reminders
- **Daily 8pm**: Log reminders (skips if already logged)
- **Wednesday 9am**: Weekly summaries
- **Hourly**: Achievement and streak alerts

Make sure to set the `CRON_SECRET` environment variable to secure the cron endpoints.

## Notification Types

1. **Check-in Reminder**: Tuesday reminder to complete weekly check-in
2. **Daily Log Reminder**: Evening reminder to log daily metrics
3. **Target Achieved**: Celebrate when goals are hit
4. **Weekly Summary**: Family check-in summary every Wednesday
5. **Streak Alert**: Celebrate milestone streaks (7, 14, 30+ days)

Users can toggle each notification type and set custom times in `/settings/notifications`.

## API Routes

### Public Routes
- `/api/check-in` - Submit weekly check-in
- `/api/notifications/send-verification` - Send phone verification code
- `/api/notifications/verify-code` - Verify phone number
- `/api/notifications/preferences` - Update notification preferences
- `/api/calendar/[userId]/feed.ics` - iCal feed for calendar subscription

### Internal Routes (Secured)
- `/api/notifications/send` - Send notification (SMS + in-app)
- `/api/cron/notifications` - Scheduled notification job
- `/api/cron/achievements` - Achievement detection job

## Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Make sure to add all required environment variables in your Vercel project settings.
