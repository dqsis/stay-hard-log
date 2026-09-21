-- Prevents two "today" workout rows from ever being created for the same
-- user on the same date (was reachable via a React StrictMode double-effect
-- race in dev, but the same race is possible from two tabs/devices too).
alter table public.workouts
  add constraint workouts_user_date_unique unique (user_id, workout_date);
