-- Gym Log schema: single-user, RLS-scoped via auth.uid().
-- Run this whole file in the Supabase SQL Editor once, before seed.sql.

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  name_key text generated always as (lower(trim(name))) stored,
  created_at timestamptz not null default now(),
  unique (user_id, name_key)
);

create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  workout_date date not null default current_date,
  start_time time,
  location text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.sets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  workout_id uuid not null references public.workouts(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete restrict,
  set_number int not null check (set_number > 0),
  reps int not null check (reps >= 0),
  weight_kg numeric(6,2) not null check (weight_kg >= 0),
  created_at timestamptz not null default now()
);

create index idx_workouts_user_date on public.workouts (user_id, workout_date desc);
create index idx_sets_workout on public.sets (workout_id);
create index idx_sets_exercise_user_date on public.sets (exercise_id, user_id, created_at);

alter table public.exercises enable row level security;
alter table public.workouts enable row level security;
alter table public.sets enable row level security;

create policy "exercises_owner_all" on public.exercises
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "workouts_owner_all" on public.workouts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "sets_owner_all" on public.sets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
