import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppShell } from '../layout/AppShell'
import { useExercises } from '../../hooks/useExercises'
import { useWorkoutSets } from '../../hooks/useSets'
import { fetchWorkoutById, useWorkouts } from '../../hooks/useWorkouts'
import type { Workout } from '../../lib/types'
import { ExerciseBlock } from '../log/ExerciseBlock'
import { ExercisePicker } from '../log/ExercisePicker'
import { WorkoutMetaBar } from '../log/WorkoutMetaBar'

export function WorkoutDetailScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { updateWorkout, deleteWorkout } = useWorkouts()
  const { exercises, findOrCreateExercise } = useExercises()
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  useEffect(() => {
    if (id) fetchWorkoutById(id).then(setWorkout)
  }, [id])

  const { groups, addSet, updateSet, deleteSet } = useWorkoutSets(workout?.id ?? null)

  if (!workout) {
    return (
      <AppShell title="Workout">
        <p className="text-mid">Loading…</p>
      </AppShell>
    )
  }

  const activeExerciseIds = new Set(groups.map((g) => g.exerciseId))

  return (
    <AppShell title="Workout">
      <WorkoutMetaBar
        workout={workout}
        onUpdate={async (patch) => {
          await updateWorkout(workout.id, patch)
          setWorkout({ ...workout, ...patch })
        }}
      />

      {groups.map((group) => (
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

      <button
        onClick={async () => {
          if (!confirm('Delete this entire workout and all its sets?')) return
          await deleteWorkout(workout.id)
          navigate('/history')
        }}
        className="mt-6 w-full text-sm text-terracotta"
      >
        Delete workout
      </button>

      {pickerOpen && (
        <ExercisePicker
          exercises={exercises.filter((e) => !activeExerciseIds.has(e.id))}
          onClose={() => setPickerOpen(false)}
          onCreateNew={(name) => findOrCreateExercise(name)}
          onSelect={async (exercise) => {
            setPickerOpen(false)
            await addSet(exercise.id, 8, 20)
          }}
        />
      )}
    </AppShell>
  )
}
