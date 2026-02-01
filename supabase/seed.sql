-- Fay Goals Seed Data
-- Run this after schema.sql in your Supabase SQL Editor

-- Clear existing data (optional - uncomment if needed)
-- TRUNCATE users, goals, metrics, events, event_participants, grocery_items, quotes, photos RESTART IDENTITY CASCADE;

-- Insert Users
INSERT INTO users (id, name, role, avatar_url) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Nate', 'parent', NULL),
  ('22222222-2222-2222-2222-222222222222', 'Dalton', 'child', NULL),
  ('33333333-3333-3333-3333-333333333333', 'Mason', 'child', NULL)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role;

-- Insert Goals for Nate
INSERT INTO goals (user_id, title, description, target_value, current_value, unit, category, deadline) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Lose 7 lbs', 'Get back to fighting weight', 7, 2, 'lbs', 'health', '2026-06-01'),
  ('11111111-1111-1111-1111-111111111111', 'Retire by 45', 'Financial independence goal', 45, 42, 'age', 'personal', '2029-01-01'),
  ('11111111-1111-1111-1111-111111111111', 'Travel outside country 2026', 'International trip with family', 1, 0, 'trips', 'travel', '2026-12-31'),
  ('11111111-1111-1111-1111-111111111111', 'Be a better dad', 'Quality time and presence', NULL, NULL, NULL, 'personal', NULL);

-- Insert Goals for Dalton
INSERT INTO goals (user_id, title, description, target_value, current_value, unit, category, deadline) VALUES
  ('22222222-2222-2222-2222-222222222222', 'Hit 93 MPH', 'Pitching velocity goal', 93, 88, 'mph', 'sports', '2026-05-01'),
  ('22222222-2222-2222-2222-222222222222', 'Straight A''s', 'Academic excellence', 4.0, 3.7, 'gpa', 'academic', '2026-05-15'),
  ('22222222-2222-2222-2222-222222222222', 'Make Varsity Baseball', 'Team roster goal', 1, 0, 'roster', 'sports', '2026-03-01'),
  ('22222222-2222-2222-2222-222222222222', 'Get recruited D1', 'College baseball recruitment', 1, 0, 'offers', 'sports', '2027-06-01');

-- Insert Goals for Mason
INSERT INTO goals (user_id, title, description, target_value, current_value, unit, category, deadline) VALUES
  ('33333333-3333-3333-3333-333333333333', 'Mid/High 70s Velo', 'Pitching velocity target', 77, 72, 'mph', 'sports', '2026-06-01'),
  ('33333333-3333-3333-3333-333333333333', 'Be more confident', 'Personal growth and self-assurance', NULL, NULL, NULL, 'personal', NULL),
  ('33333333-3333-3333-3333-333333333333', 'Sub 5:40 mile', 'Running time goal', 340, 365, 'seconds', 'sports', '2026-05-01'),
  ('33333333-3333-3333-3333-333333333333', 'All A''s and B''s', 'Academic goal', 3.5, 3.2, 'gpa', 'academic', '2026-05-15');

-- Insert sample metrics (recent entries)
INSERT INTO metrics (goal_id, user_id, value, notes, recorded_at)
SELECT g.id, g.user_id,
  CASE
    WHEN g.title = 'Hit 93 MPH' THEN 87 + random() * 2
    WHEN g.title = 'Mid/High 70s Velo' THEN 71 + random() * 2
    WHEN g.title = 'Lose 7 lbs' THEN 1 + random()
    WHEN g.title = 'Sub 5:40 mile' THEN 360 + random() * 10
    ELSE g.current_value
  END,
  'Weekly check-in',
  CURRENT_DATE - interval '7 days'
FROM goals g
WHERE g.target_value IS NOT NULL;

INSERT INTO metrics (goal_id, user_id, value, notes, recorded_at)
SELECT g.id, g.user_id,
  CASE
    WHEN g.title = 'Hit 93 MPH' THEN 88
    WHEN g.title = 'Mid/High 70s Velo' THEN 72
    WHEN g.title = 'Lose 7 lbs' THEN 2
    WHEN g.title = 'Sub 5:40 mile' THEN 365
    ELSE g.current_value
  END,
  'Latest check-in',
  CURRENT_DATE
FROM goals g
WHERE g.target_value IS NOT NULL;

-- Insert Events

-- Nate's Work (weekdays)
INSERT INTO events (id, title, description, start_time, end_time, is_all_day, recurrence_rule, color) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Work', 'Remote work day', '2026-01-27 08:00:00-07:00', '2026-01-27 17:00:00-07:00', false, 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR', '#3B82F6');

-- Practice (Mon, Wed, Sat for boys)
INSERT INTO events (id, title, description, start_time, end_time, is_all_day, recurrence_rule, color) VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Practice', 'Baseball practice', '2026-01-27 16:00:00-07:00', '2026-01-27 18:00:00-07:00', false, 'FREQ=WEEKLY;BYDAY=MO,WE,SA', '#22C55E');

-- Games (Tue, Wed, Fri for boys)
INSERT INTO events (id, title, description, start_time, end_time, is_all_day, recurrence_rule, color) VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Game', 'Baseball game', '2026-01-28 17:00:00-07:00', '2026-01-28 20:00:00-07:00', false, 'FREQ=WEEKLY;BYDAY=TU,TH,FR', '#EAB308');

-- Hawaii Trip
INSERT INTO events (id, title, description, start_time, end_time, is_all_day, location, color) VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Hawaii Trip', 'Family vacation to Hawaii', '2026-01-28 00:00:00-07:00', '2026-01-31 23:59:59-07:00', true, 'Honolulu, Hawaii', '#EC4899');

-- Event participants
INSERT INTO event_participants (event_id, user_id) VALUES
  -- Nate's work
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
  -- Practice (Dalton & Mason)
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333'),
  -- Games (Dalton & Mason)
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333'),
  -- Hawaii (everyone)
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333');

-- Insert Grocery Items
INSERT INTO grocery_items (name, quantity, is_checked, added_by) VALUES
  ('Milk', 1, false, '11111111-1111-1111-1111-111111111111'),
  ('Eggs', 2, false, '11111111-1111-1111-1111-111111111111'),
  ('Bread', 1, true, '11111111-1111-1111-1111-111111111111'),
  ('Bananas', 1, false, '33333333-3333-3333-3333-333333333333'),
  ('Chicken Breast', 2, false, '11111111-1111-1111-1111-111111111111'),
  ('Protein Powder', 1, false, '22222222-2222-2222-2222-222222222222'),
  ('Orange Juice', 1, false, '11111111-1111-1111-1111-111111111111'),
  ('Sunscreen', 1, false, '11111111-1111-1111-1111-111111111111');

-- Insert Motivational Quotes
INSERT INTO quotes (text, author, is_active) VALUES
  ('The only way to do great work is to love what you do.', 'Steve Jobs', true),
  ('Hard work beats talent when talent doesn''t work hard.', 'Tim Notke', true),
  ('Success is not final, failure is not fatal: it is the courage to continue that counts.', 'Winston Churchill', true),
  ('The difference between the impossible and the possible lies in a person''s determination.', 'Tommy Lasorda', true),
  ('I''ve missed more than 9000 shots in my career. I''ve lost almost 300 games. 26 times, I''ve been trusted to take the game winning shot and missed. I''ve failed over and over and over again in my life. And that is why I succeed.', 'Michael Jordan', true),
  ('It''s not whether you get knocked down, it''s whether you get up.', 'Vince Lombardi', true),
  ('The only person you are destined to become is the person you decide to be.', 'Ralph Waldo Emerson', true),
  ('Champions keep playing until they get it right.', 'Billie Jean King', true),
  ('You miss 100% of the shots you don''t take.', 'Wayne Gretzky', true),
  ('The harder you work, the luckier you get.', 'Gary Player', true);

-- Verify data
SELECT 'Users:' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Goals:', COUNT(*) FROM goals
UNION ALL
SELECT 'Metrics:', COUNT(*) FROM metrics
UNION ALL
SELECT 'Events:', COUNT(*) FROM events
UNION ALL
SELECT 'Event Participants:', COUNT(*) FROM event_participants
UNION ALL
SELECT 'Grocery Items:', COUNT(*) FROM grocery_items
UNION ALL
SELECT 'Quotes:', COUNT(*) FROM quotes;
