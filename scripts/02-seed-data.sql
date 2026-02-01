-- This script should be run after users are created through Supabase Auth
-- Replace the UUIDs below with actual user IDs after signup

-- Example seed data structure
-- NOTE: You'll need to create users through the signup flow first, then get their UUIDs

-- Example goals (replace user_id with actual UUIDs)
-- INSERT INTO goals (user_id, title, description, category, target_value, current_value, unit, start_date, end_date)
-- VALUES 
--   ('user-uuid-here', 'Run 500 miles in 2026', 'Complete 500 miles of running throughout the year', 'fitness', 500, 45, 'miles', '2026-01-01', '2026-12-31'),
--   ('user-uuid-here', 'Read 24 books', 'Read at least 2 books per month', 'learning', 24, 3, 'books', '2026-01-01', '2026-12-31');

-- Example milestones
-- INSERT INTO milestones (goal_id, title, target_date, completed)
-- VALUES
--   ('goal-uuid-here', 'Complete first 100 miles', '2026-03-31', false),
--   ('goal-uuid-here', 'Reach halfway point (250 miles)', '2026-06-30', false);

-- Example metrics
-- INSERT INTO metrics (user_id, metric_name, metric_value, unit, date)
-- VALUES
--   ('user-uuid-here', 'Weight', 175.5, 'lbs', '2026-01-15'),
--   ('user-uuid-here', 'Running Distance', 5.2, 'miles', '2026-01-15');

-- Example check-ins
-- INSERT INTO check_ins (user_id, date, mood, content, highlights, challenges)
-- VALUES
--   ('user-uuid-here', '2026-01-15', 'great', 'Had a fantastic day! Morning run felt amazing.', 'Completed 5 mile run, Healthy eating all day', 'Woke up a bit late');
