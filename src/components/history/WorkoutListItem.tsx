import { Link } from 'react-router-dom'
import type { Workout } from '../../lib/types'

export function WorkoutListItem({ workout, exerciseSummary }: { workout: Workout; exerciseSummary: string }) {
  return (
    <Link
      to={`/history/${workout.id}`}
      className="block rounded border border-border bg-white px-3 py-2.5"
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-ink">{workout.workout_date}</span>
        {workout.location && <span className="text-xs text-mid">{workout.location}</span>}
      </div>
      <p className="mt-1 truncate text-sm text-mid">{exerciseSummary || 'No exercises logged'}</p>
    </Link>
  )
}
