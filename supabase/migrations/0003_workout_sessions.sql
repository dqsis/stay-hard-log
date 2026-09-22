-- Adds an explicit "Done" concept to workouts instead of treating "today's
-- workout" as the one true session for the day. This lets more than one
-- workout be logged on the same date (e.g. finish one, start another).

alter table public.workouts add column ended_at timestamptz;

-- At most one open (unfinished) workout per user at a time -- this is what
-- "today's active session" now means, replacing the old date-based lookup.
create unique index workouts_one_active_per_user
  on public.workouts (user_id)
  where ended_at is null;

-- Multiple workouts per day are now allowed, so the old one-per-date
-- constraint no longer applies.
alter table public.workouts drop constraint workouts_user_date_unique;
