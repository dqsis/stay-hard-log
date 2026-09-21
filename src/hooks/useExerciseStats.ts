import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export interface StatPoint {
  date: string // yyyy-mm-dd
  topWeightKg: number
}

// Top set (highest weight) per workout for the given exercise, oldest first —
// the shape a line chart wants.
export function useExerciseStats(exerciseId: string | null) {
  const [points, setPoints] = useState<StatPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!exerciseId) {
      setPoints([])
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    supabase
      .from('sets')
      .select('weight_kg, workout:workouts(workout_date)')
      .eq('exercise_id', exerciseId)
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) throw error
        const byDate = new Map<string, number>()
        for (const row of (data as unknown as { weight_kg: number; workout: { workout_date: string } | null }[]) ?? []) {
          const date = row.workout?.workout_date
          if (!date) continue
          byDate.set(date, Math.max(byDate.get(date) ?? 0, row.weight_kg))
        }
        const sorted = [...byDate.entries()]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, topWeightKg]) => ({ date, topWeightKg }))
        setPoints(sorted)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [exerciseId])

  return { points, loading }
}
