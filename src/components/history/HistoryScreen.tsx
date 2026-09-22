import { useEffect, useState } from 'react'
import { AppShell } from '../layout/AppShell'
import { useWorkouts } from '../../hooks/useWorkouts'
import { supabase } from '../../lib/supabaseClient'
import { WorkoutListItem } from './WorkoutListItem'

export function HistoryScreen() {
  const { workouts, loading } = useWorkouts()
  const [summaries, setSummaries] = useState<Map<string, string>>(new Map())
  const [summariesLoading, setSummariesLoading] = useState(true)

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
        setSummariesLoading(false)
      })
  }, [])

  // A workout with no sets yet is just the current open session waiting to be
  // logged into (e.g. right after "Done" opens a fresh one) — not something
  // worth showing as a history entry, so it's excluded once we know which
  // workouts actually have exercises.
  const loggedWorkouts = summariesLoading ? [] : workouts.filter((w) => summaries.has(w.id))
  const stillLoading = loading || summariesLoading

  return (
    <AppShell title="History">
      {stillLoading && <p className="text-mid">Loading…</p>}
      <div className="space-y-2">
        {loggedWorkouts.map((workout) => (
          <WorkoutListItem key={workout.id} workout={workout} exerciseSummary={summaries.get(workout.id) ?? ''} />
        ))}
        {!stillLoading && loggedWorkouts.length === 0 && <p className="text-mid">No workouts logged yet.</p>}
      </div>
    </AppShell>
  )
}
