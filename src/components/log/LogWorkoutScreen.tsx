import { useEffect, useState } from 'react'
import { AppShell } from '../layout/AppShell'
import { useExercises } from '../../hooks/useExercises'
import { useWorkouts } from '../../hooks/useWorkouts'
import { useWorkoutSets } from '../../hooks/useSets'
import type { ExerciseGroup } from '../../hooks/useSets'
import type { Exercise, Workout } from '../../lib/types'
import { ExerciseBlock } from './ExerciseBlock'
import { ExercisePicker } from './ExercisePicker'
import { WorkoutMetaBar } from './WorkoutMetaBar'

export function LogWorkoutScreen() {
  const { getOrCreateTodayWorkout, updateWorkout } = useWorkouts()
  const { exercises, findOrCreateExercise } = useExercises()
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  // Exercises added to this session that don't have a logged set yet — kept
  // client-side only until "Add Set" actually writes the first one.
  const [pendingExercises, setPendingExercises] = useState<Exercise[]>([])

  useEffect(() => {
    getOrCreateTodayWorkout().then(setWorkout)
    // Only run once on mount — this screen always targets "today."
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { groups, addSet, updateSet, deleteSet } = useWorkoutSets(workout?.id ?? null)

  if (!workout) {
    return (
      <AppShell title="Log Workout">
        <p className="text-mid">Loading…</p>
      </AppShell>
    )
  }

  const activeExerciseIds = new Set(groups.map((g) => g.exerciseId))
  const emptyGroups: ExerciseGroup[] = pendingExercises
    .filter((e) => !activeExerciseIds.has(e.id))
    .map((e) => ({ exerciseId: e.id, exerciseName: e.name, sets: [] }))
  const displayGroups = [...groups, ...emptyGroups]
  const excludeFromPickerIds = new Set([...activeExerciseIds, ...pendingExercises.map((e) => e.id)])

  return (
    <AppShell title="Log Workout">
      <WorkoutMetaBar
        workout={workout}
        onUpdate={async (patch) => {
          await updateWorkout(workout.id, patch)
          setWorkout({ ...workout, ...patch })
        }}
      />

      {displayGroups.map((group) => (
        <ExerciseBlock
          key={group.exerciseId}
          group={group}
          onAddSet={(reps, weightKg) => addSet(group.exerciseId, reps, weightKg)}
          onUpdateSet={updateSet}
          onDeleteSet={deleteSet}
        />
      ))}

      <button
        onClick={() => setPickerOpen(true)}
        className="w-full rounded border border-dashed border-border py-3 font-semibold text-terracotta"
      >
        + Add Exercise
      </button>

      {pickerOpen && (
        <ExercisePicker
          exercises={exercises.filter((e) => !excludeFromPickerIds.has(e.id))}
          onClose={() => setPickerOpen(false)}
          onCreateNew={async (name) => {
            const exercise = await findOrCreateExercise(name)
            return exercise
          }}
          onSelect={(exercise) => {
            setPickerOpen(false)
            setPendingExercises((prev) => [...prev, exercise])
          }}
        />
      )}
    </AppShell>
  )
}
