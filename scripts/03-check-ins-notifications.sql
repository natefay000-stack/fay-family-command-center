-- Add phone verification and notification preferences to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'America/New_York',
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
  "check_in_reminder": true,
  "daily_log_reminder": true,
  "target_achieved": true,
  "weekly_summary": true,
  "streak_alert": true,
  "check_in_time": "09:00",
  "daily_log_time": "20:00"
}'::jsonb;

-- Create weekly check-in sessions table
CREATE TABLE IF NOT EXISTS weekly_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  summary_generated BOOLEAN DEFAULT false,
  total_milestones INT DEFAULT 0,
  average_rating DECIMAL(3,2),
  combined_focus TEXT,
  UNIQUE(week_start_date)
);

-- Create individual check-ins table
CREATE TABLE IF NOT EXISTS check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES weekly_sessions(id) ON DELETE CASCADE,
  overall_rating INT CHECK (overall_rating >= 1 AND overall_rating <= 5),
  wins TEXT,
  struggles TEXT,
  next_week_focus TEXT,
  priority_metrics UUID[],
  flagged_metrics JSONB, -- {metric_id: {reason, note}}
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, session_id)
);

-- Create check-in comments table (family encouragement)
CREATE TABLE IF NOT EXISTS check_in_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  check_in_id UUID REFERENCES check_ins(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create phone verification codes table
CREATE TABLE IF NOT EXISTS verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications log table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'check_in_reminder', 'daily_log', 'achievement', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT false,
  sent_via_sms BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notification sends log (for SMS tracking)
CREATE TABLE IF NOT EXISTS notification_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'sent', 'failed', 'pending'
  twilio_sid VARCHAR(100),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE weekly_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_in_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_sends ENABLE ROW LEVEL SECURITY;

-- RLS Policies for weekly_sessions (everyone can read)
CREATE POLICY "Anyone can view weekly sessions"
  ON weekly_sessions FOR SELECT
  USING (true);

CREATE POLICY "System can manage weekly sessions"
  ON weekly_sessions FOR ALL
  USING (true);

-- RLS Policies for check_ins (family can read, own to insert/update)
CREATE POLICY "Users can view family check-ins"
  ON check_ins FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM profiles
      WHERE id = auth.uid() OR id IN (
        SELECT id FROM profiles WHERE id != auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert own check-ins"
  ON check_ins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own check-ins"
  ON check_ins FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for check_in_comments
CREATE POLICY "Users can view all comments"
  ON check_in_comments FOR SELECT
  USING (true);

CREATE POLICY "Users can insert comments"
  ON check_in_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON check_in_comments FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for verification_codes (own only)
CREATE POLICY "Users can view own verification codes"
  ON verification_codes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own verification codes"
  ON verification_codes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for notifications (own only)
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- RLS Policies for notification_sends (own only)
CREATE POLICY "Users can view own notification sends"
  ON notification_sends FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage notification sends"
  ON notification_sends FOR ALL
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_session_id ON check_ins(session_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_weekly_sessions_date ON weekly_sessions(week_start_date);
