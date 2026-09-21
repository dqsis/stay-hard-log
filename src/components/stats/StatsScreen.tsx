import { useState } from 'react'
import { AppShell } from '../layout/AppShell'
import { useExercises } from '../../hooks/useExercises'
import { useExerciseStats } from '../../hooks/useExerciseStats'
import { ExerciseStatsChart } from './ExerciseStatsChart'

export function StatsScreen() {
  const { exercises } = useExercises()
  const [selectedId, setSelectedId] = useState<string>('')
  const { points, loading } = useExerciseStats(selectedId || null)

  return (
    <AppShell title="Stats">
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="mb-4 w-full rounded border border-border bg-white px-3 py-2 text-ink"
      >
        <option value="">Pick an exercise…</option>
        {exercises.map((exercise) => (
          <option key={exercise.id} value={exercise.id}>
            {exercise.name}
          </option>
        ))}
      </select>

      {!selectedId && <p className="text-mid">Pick an exercise to see your top set over time.</p>}
      {selectedId && loading && <p className="text-mid">Loading…</p>}
      {selectedId && !loading && <ExerciseStatsChart points={points} />}
    </AppShell>
  )
}
