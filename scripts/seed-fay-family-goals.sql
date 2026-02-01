-- Seed script for Fay Family 2026 Goals
-- This populates the database with real goals for Nate, Dalton, and Mason

-- First, let's create the three family members (profiles)
-- Note: In production, these would be created during signup
-- For demo purposes, we'll use fixed UUIDs

-- Insert profiles for the Fay family
INSERT INTO profiles (id, full_name, role, email, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Nate', 'teen', 'nate@faygoals.com', NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Dalton', 'teen', 'dalton@faygoals.com', NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333'::uuid, 'Mason', 'teen', 'mason@faygoals.com', NOW(), NOW())
ON CONFLICT (id) DO UPDATE 
SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, email = EXCLUDED.email;

-- NATE'S GOALS (17 year old)
-- Goal 1: Reduce Phone Time
INSERT INTO goals (id, user_id, title, description, category, target_value, current_value, unit, start_date, end_date, status, created_at, updated_at)
VALUES 
  ('a1111111-1111-1111-1111-111111111111'::uuid, 
   '11111111-1111-1111-1111-111111111111'::uuid,
   'Reduce Phone Time',
   'Limit daily phone usage to less than 2 hours per day',
   'health',
   120, -- 2 hours = 120 minutes
   180, -- currently at 3 hours
   'minutes',
   '2026-01-01',
   '2026-12-31',
   'in_progress',
   NOW(),
   NOW())
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title, target_value = EXCLUDED.target_value, current_value = EXCLUDED.current_value;

-- Goal 2: Weekly Workouts
INSERT INTO goals (id, user_id, title, description, category, target_value, current_value, unit, start_date, end_date, status, created_at, updated_at)
VALUES 
  ('a1111111-2222-2222-2222-222222222222'::uuid, 
   '11111111-1111-1111-1111-111111111111'::uuid,
   'Weekly Workouts',
   'Complete 5 workouts per week consistently',
   'athletic',
   5,
   3, -- currently doing 3 per week
   'workouts',
   '2026-01-01',
   '2026-12-31',
   'in_progress',
   NOW(),
   NOW())
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title, target_value = EXCLUDED.target_value, current_value = EXCLUDED.current_value;

-- Goal 3: International Travel
INSERT INTO goals (id, user_id, title, description, category, target_value, current_value, unit, start_date, end_date, status, created_at, updated_at)
VALUES 
  ('a1111111-3333-3333-3333-333333333333'::uuid, 
   '11111111-1111-1111-1111-111111111111'::uuid,
   'International Travel',
   'Visit at least 2 new countries in 2026',
   'personal',
   2,
   0, -- haven't traveled yet
   'countries',
   '2026-01-01',
   '2026-12-31',
   'not_started',
   NOW(),
   NOW())
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title, target_value = EXCLUDED.target_value, current_value = EXCLUDED.current_value;

-- DALTON'S GOALS (13 year old, 8th grade)
-- Goal 1: Throwing Velocity
INSERT INTO goals (id, user_id, title, description, category, target_value, current_value, unit, start_date, end_date, status, created_at, updated_at)
VALUES 
  ('b2222222-1111-1111-1111-111111111111'::uuid, 
   '22222222-2222-2222-2222-222222222222'::uuid,
   'Throwing Velo',
   'Increase throwing velocity to 93 mph by end of year',
   'athletic',
   93,
   78, -- currently throwing 78 mph
   'mph',
   '2026-01-01',
   '2026-12-31',
   'in_progress',
   NOW(),
   NOW())
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title, target_value = EXCLUDED.target_value, current_value = EXCLUDED.current_value;

-- Goal 2: Straight A's / 4.0 GPA
INSERT INTO goals (id, user_id, title, description, category, target_value, current_value, unit, start_date, end_date, status, created_at, updated_at)
VALUES 
  ('b2222222-2222-2222-2222-222222222222'::uuid, 
   '22222222-2222-2222-2222-222222222222'::uuid,
   'Straight A''s',
   'Maintain a 4.0 GPA throughout 8th grade',
   'academic',
   400, -- 4.0 * 100 for storage
   380, -- currently at 3.8
   'GPA',
   '2026-01-01',
   '2026-12-31',
   'in_progress',
   NOW(),
   NOW())
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title, target_value = EXCLUDED.target_value, current_value = EXCLUDED.current_value;

-- Goal 3: Make Varsity Baseball
INSERT INTO goals (id, user_id, title, description, category, target_value, current_value, unit, start_date, end_date, status, created_at, updated_at)
VALUES 
  ('b2222222-3333-3333-3333-333333333333'::uuid, 
   '22222222-2222-2222-2222-222222222222'::uuid,
   'Make Varsity Baseball',
   'Make the high school varsity baseball team',
   'athletic',
   5, -- 5 milestones to achieve
   3, -- completed 3 of 5
   'milestones',
   '2026-01-01',
   '2026-08-01',
   'in_progress',
   NOW(),
   NOW())
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title, target_value = EXCLUDED.target_value, current_value = EXCLUDED.current_value;

-- Add milestones for Varsity Baseball goal
INSERT INTO milestones (id, goal_id, title, description, target_date, completed, completed_at, created_at)
VALUES 
  ('m1111111-1111-1111-1111-111111111111'::uuid, 
   'b2222222-3333-3333-3333-333333333333'::uuid,
   'Improve throwing velocity',
   'Increase velo to 85+ mph',
   '2026-03-01',
   true,
   '2026-02-15',
   NOW()),
  ('m1111111-2222-2222-2222-222222222222'::uuid, 
   'b2222222-3333-3333-3333-333333333333'::uuid,
   'Attend all practices',
   'Perfect attendance at winter training',
   '2026-04-01',
   true,
   '2026-03-30',
   NOW()),
  ('m1111111-3333-3333-3333-333333333333'::uuid, 
   'b2222222-3333-3333-3333-333333333333'::uuid,
   'Impress at tryouts',
   'Show skill improvements at spring tryouts',
   '2026-05-01',
   true,
   '2026-04-28',
   NOW()),
  ('m1111111-4444-4444-4444-444444444444'::uuid, 
   'b2222222-3333-3333-3333-333333333333'::uuid,
   'Get coach recommendation',
   'Earn recommendation from travel ball coach',
   '2026-06-01',
   false,
   NULL,
   NOW()),
  ('m1111111-5555-5555-5555-555555555555'::uuid, 
   'b2222222-3333-3333-3333-333333333333'::uuid,
   'Make final roster',
   'Be selected for varsity roster',
   '2026-08-01',
   false,
   NULL,
   NOW())
ON CONFLICT (id) DO NOTHING;

-- MASON'S GOALS (younger teen)
-- Goal 1: Throwing Velocity
INSERT INTO goals (id, user_id, title, description, category, target_value, current_value, unit, start_date, end_date, status, created_at, updated_at)
VALUES 
  ('c3333333-1111-1111-1111-111111111111'::uuid, 
   '33333333-3333-3333-3333-333333333333'::uuid,
   'Throwing Velo',
   'Reach mid-70s mph throwing velocity',
   'athletic',
   75,
   68, -- currently at 68 mph
   'mph',
   '2026-01-01',
   '2026-12-31',
   'in_progress',
   NOW(),
   NOW())
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title, target_value = EXCLUDED.target_value, current_value = EXCLUDED.current_value;

-- Goal 2: Mile Time
INSERT INTO goals (id, user_id, title, description, category, target_value, current_value, unit, start_date, end_date, status, created_at, updated_at)
VALUES 
  ('c3333333-2222-2222-2222-222222222222'::uuid, 
   '33333333-3333-3333-3333-333333333333'::uuid,
   'Mile Time',
   'Run a mile under 7 minutes',
   'athletic',
   420, -- 7 minutes = 420 seconds
   480, -- currently at 8 minutes
   'seconds',
   '2026-01-01',
   '2026-12-31',
   'in_progress',
   NOW(),
   NOW())
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title, target_value = EXCLUDED.target_value, current_value = EXCLUDED.current_value;

-- Goal 3: Build Confidence
INSERT INTO goals (id, user_id, title, description, category, target_value, current_value, unit, start_date, end_date, status, created_at, updated_at)
VALUES 
  ('c3333333-3333-3333-3333-333333333333'::uuid, 
   '33333333-3333-3333-3333-333333333333'::uuid,
   'Build Confidence',
   'Complete public speaking opportunities and social activities',
   'personal',
   10, -- 10 confidence-building activities
   4, -- completed 4 so far
   'activities',
   '2026-01-01',
   '2026-12-31',
   'in_progress',
   NOW(),
   NOW())
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title, target_value = EXCLUDED.target_value, current_value = EXCLUDED.current_value;

-- Add some recent metrics for tracking progress
-- Dalton's throwing velocity progress
INSERT INTO metrics (id, user_id, metric_name, metric_value, unit, date, notes, created_at)
VALUES 
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222'::uuid, 'Throwing Velocity', 75, 'mph', '2026-01-15', 'Good progress in winter training', NOW()),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222'::uuid, 'Throwing Velocity', 76, 'mph', '2026-02-01', 'Mechanics improving', NOW()),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222'::uuid, 'Throwing Velocity', 78, 'mph', '2026-02-15', 'New personal record!', NOW())
ON CONFLICT DO NOTHING;

-- Mason's velocity progress
INSERT INTO metrics (id, user_id, metric_name, metric_value, unit, date, notes, created_at)
VALUES 
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333'::uuid, 'Throwing Velocity', 66, 'mph', '2026-01-10', 'Starting baseline', NOW()),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333'::uuid, 'Throwing Velocity', 67, 'mph', '2026-01-25', 'Slight improvement', NOW()),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333'::uuid, 'Throwing Velocity', 68, 'mph', '2026-02-10', 'Gaining strength', NOW())
ON CONFLICT DO NOTHING;

-- Mason's mile time progress
INSERT INTO metrics (id, user_id, metric_name, metric_value, unit, date, notes, created_at)
VALUES 
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333'::uuid, 'Mile Time', 510, 'seconds', '2026-01-05', '8:30 mile', NOW()),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333'::uuid, 'Mile Time', 495, 'seconds', '2026-01-20', '8:15 mile - getting faster', NOW()),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333'::uuid, 'Mile Time', 480, 'seconds', '2026-02-05', '8:00 mile - 1 minute to go!', NOW())
ON CONFLICT DO NOTHING;

-- Dalton's GPA tracking
INSERT INTO metrics (id, user_id, metric_name, metric_value, unit, date, notes, created_at)
VALUES 
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222'::uuid, 'GPA', 3.8, 'GPA', '2026-01-15', 'Q1 report card', NOW()),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222'::uuid, 'GPA', 3.9, 'GPA', '2026-03-15', 'Q2 improvement!', NOW())
ON CONFLICT DO NOTHING;

-- Nate's phone time tracking
INSERT INTO metrics (id, user_id, metric_name, metric_value, unit, date, notes, created_at)
VALUES 
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111'::uuid, 'Phone Time', 210, 'minutes', '2026-01-01', 'Starting point - 3.5 hours', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111'::uuid, 'Phone Time', 195, 'minutes', '2026-01-15', '3.25 hours - getting better', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111'::uuid, 'Phone Time', 180, 'minutes', '2026-02-01', '3 hours - halfway there', NOW())
ON CONFLICT DO NOTHING;

-- Nate's workout frequency
INSERT INTO metrics (id, user_id, metric_name, metric_value, unit, date, notes, created_at)
VALUES 
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111'::uuid, 'Weekly Workouts', 2, 'workouts', '2026-01-06', 'Week 1', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111'::uuid, 'Weekly Workouts', 3, 'workouts', '2026-01-13', 'Week 2 - improving', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111'::uuid, 'Weekly Workouts', 3, 'workouts', '2026-01-20', 'Week 3 - consistent', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111'::uuid, 'Weekly Workouts', 4, 'workouts', '2026-01-27', 'Week 4 - getting closer!', NOW())
ON CONFLICT DO NOTHING;
