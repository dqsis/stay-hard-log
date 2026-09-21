import { useEffect, useState } from 'react'
import { AppShell } from '../layout/AppShell'
import { useWorkouts } from '../../hooks/useWorkouts'
import { supabase } from '../../lib/supabaseClient'
import { WorkoutListItem } from './WorkoutListItem'

export function HistoryScreen() {
  const { workouts, loading } = useWorkouts()
  const [summaries, setSummaries] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    supabase
      .from('sets')
      .select('workout_id, exercise:exercises(name), created_at')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) throw error
        const byWorkout = new Map<string, string[]>()
        for (const row of (data as unknown as { workout_id: string; exercise: { name: string } | null }[]) ?? []) {
          const name = row.exercise?.name
          if (!name) continue
          const list = byWorkout.get(row.workout_id) ?? []
          if (!list.includes(name)) list.push(name)
          byWorkout.set(row.workout_id, list)
        }
        setSummaries(new Map([...byWorkout.entries()].map(([id, names]) => [id, names.join(', ')])))
      })
  }, [])

  return (
    <AppShell title="History">
      {loading && <p className="text-mid">Loading…</p>}
      <div className="space-y-2">
        {workouts.map((workout) => (
          <WorkoutListItem key={workout.id} workout={workout} exerciseSummary={summaries.get(workout.id) ?? ''} />
        ))}
        {!loading && workouts.length === 0 && <p className="text-mid">No workouts logged yet.</p>}
      </div>
    </AppShell>
  )
}
