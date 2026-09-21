import { useEffect, useState } from 'react'
import { fetchLastSetForExercise } from '../../hooks/useSets'
import type { ExerciseGroup } from '../../hooks/useSets'
import { SetEntryForm } from './SetEntryForm'
import { SetRow } from './SetRow'

const FALLBACK_REPS = 8
const FALLBACK_WEIGHT_KG = 20

export function ExerciseBlock({
  group,
  onAddSet,
  onUpdateSet,
  onDeleteSet,
}: {
  group: ExerciseGroup
  onAddSet: (reps: number, weightKg: number, setsCount: number) => Promise<void>
  onUpdateSet: (id: string, patch: { reps: number; weight_kg: number }) => Promise<void>
  onDeleteSet: (id: string) => Promise<void>
}) {
  const [defaults, setDefaults] = useState<{ reps: number; weightKg: number } | null>(null)

  useEffect(() => {
    if (group.sets.length > 0) {
      const last = group.sets[group.sets.length - 1]
      setDefaults({ reps: last.reps, weightKg: last.weight_kg })
      return
    }
    let cancelled = false
    fetchLastSetForExercise(group.exerciseId).then((last) => {
      if (cancelled) return
      setDefaults(
        last ? { reps: last.reps, weightKg: last.weight_kg } : { reps: FALLBACK_REPS, weightKg: FALLBACK_WEIGHT_KG },
      )
    })
    return () => {
      cancelled = true
    }
    // Re-derive defaults only when the set count changes, not on every set edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group.exerciseId, group.sets.length])

  return (
    <div className="mb-4 rounded border border-border bg-white">
      <div className="border-b border-border px-3 py-2 font-semibold text-ink">{group.exerciseName}</div>
      <div className="px-3">
        {group.sets.map((set) => (
          <SetRow
            key={set.id}
            set={set}
            onUpdate={(patch) => onUpdateSet(set.id, patch)}
            onDelete={() => onDeleteSet(set.id)}
          />
        ))}
      </div>
      <div className="p-3">
        {defaults && (
          <SetEntryForm defaultReps={defaults.reps} defaultWeightKg={defaults.weightKg} onAdd={onAddSet} />
        )}
      </div>
    </div>
  )
}
