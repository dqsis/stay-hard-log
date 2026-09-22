-- Seeds the exercise picker with the exercises from the user's current gym
-- program. Run AFTER 0001_init.sql, and after creating your one account in
-- Authentication -> Users (copy that user's UUID from there first).
--
-- The Supabase SQL Editor runs as the service role, not as the authenticated
-- app user, so auth.uid() is null here -- the user_id default won't populate.
-- That's why it's hardcoded below. Replace REPLACE_WITH_YOUR_AUTH_USER_UUID
-- with the real UUID before running.

insert into public.exercises (user_id, name) values
  ('REPLACE_WITH_YOUR_AUTH_USER_UUID', 'Barbell Bench Press'),
  ('REPLACE_WITH_YOUR_AUTH_USER_UUID', 'Weighted Pull-ups'),
  ('REPLACE_WITH_YOUR_AUTH_USER_UUID', 'Seated Dumbbell Shoulder Press'),
  ('REPLACE_WITH_YOUR_AUTH_USER_UUID', 'Seated Cable Row'),
  ('REPLACE_WITH_YOUR_AUTH_USER_UUID', 'Back Squat'),
  ('REPLACE_WITH_YOUR_AUTH_USER_UUID', 'Front Squat'),
  ('REPLACE_WITH_YOUR_AUTH_USER_UUID', 'Hip Thrust'),
  ('REPLACE_WITH_YOUR_AUTH_USER_UUID', 'Standing Calf Raise'),
  ('REPLACE_WITH_YOUR_AUTH_USER_UUID', 'Bulgarian Split Squat'),
  ('REPLACE_WITH_YOUR_AUTH_USER_UUID', 'Pallof Press'),
  ('REPLACE_WITH_YOUR_AUTH_USER_UUID', 'Incline Dumbbell Press'),
  ('REPLACE_WITH_YOUR_AUTH_USER_UUID', 'Neutral-grip Pull-ups'),
  ('REPLACE_WITH_YOUR_AUTH_USER_UUID', 'Chest-supported T-bar Row'),
  ('REPLACE_WITH_YOUR_AUTH_USER_UUID', 'Dips'),
  ('REPLACE_WITH_YOUR_AUTH_USER_UUID', 'Trap Bar Deadlift'),
  ('REPLACE_WITH_YOUR_AUTH_USER_UUID', 'Goblet Squat'),
  ('REPLACE_WITH_YOUR_AUTH_USER_UUID', 'Walking Lunges'),
  ('REPLACE_WITH_YOUR_AUTH_USER_UUID', '45° Back Extension'),
  ('REPLACE_WITH_YOUR_AUTH_USER_UUID', 'Farmer''s Carry')
on conflict (user_id, name_key) do nothing;
