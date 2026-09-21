-- Seeds the exercise picker with the exercises from the user's current gym
-- program. Run AFTER 0001_init.sql, and after creating your one account in
-- Authentication -> Users.
--
-- The Supabase SQL Editor runs as the service role, not as the authenticated
-- app user, so auth.uid() is null here -- the user_id default won't populate.
-- That's why it's hardcoded below.

insert into public.exercises (user_id, name) values
  ('84900c3d-9d15-4a4a-9c97-01fc9a8ee46b', 'Barbell Bench Press'),
  ('84900c3d-9d15-4a4a-9c97-01fc9a8ee46b', 'Weighted Pull-ups'),
  ('84900c3d-9d15-4a4a-9c97-01fc9a8ee46b', 'Seated Dumbbell Shoulder Press'),
  ('84900c3d-9d15-4a4a-9c97-01fc9a8ee46b', 'Seated Cable Row'),
  ('84900c3d-9d15-4a4a-9c97-01fc9a8ee46b', 'Back Squat'),
  ('84900c3d-9d15-4a4a-9c97-01fc9a8ee46b', 'Front Squat'),
  ('84900c3d-9d15-4a4a-9c97-01fc9a8ee46b', 'Hip Thrust'),
  ('84900c3d-9d15-4a4a-9c97-01fc9a8ee46b', 'Standing Calf Raise'),
  ('84900c3d-9d15-4a4a-9c97-01fc9a8ee46b', 'Bulgarian Split Squat'),
  ('84900c3d-9d15-4a4a-9c97-01fc9a8ee46b', 'Pallof Press'),
  ('84900c3d-9d15-4a4a-9c97-01fc9a8ee46b', 'Incline Dumbbell Press'),
  ('84900c3d-9d15-4a4a-9c97-01fc9a8ee46b', 'Neutral-grip Pull-ups'),
  ('84900c3d-9d15-4a4a-9c97-01fc9a8ee46b', 'Chest-supported T-bar Row'),
  ('84900c3d-9d15-4a4a-9c97-01fc9a8ee46b', 'Dips'),
  ('84900c3d-9d15-4a4a-9c97-01fc9a8ee46b', 'Trap Bar Deadlift'),
  ('84900c3d-9d15-4a4a-9c97-01fc9a8ee46b', 'Goblet Squat'),
  ('84900c3d-9d15-4a4a-9c97-01fc9a8ee46b', 'Walking Lunges'),
  ('84900c3d-9d15-4a4a-9c97-01fc9a8ee46b', '45° Back Extension'),
  ('84900c3d-9d15-4a4a-9c97-01fc9a8ee46b', 'Farmer''s Carry')
on conflict (user_id, name_key) do nothing;
