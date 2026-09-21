import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Workout } from '../lib/types'

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('workout_date', { ascending: false })
      .order('start_time', { ascending: false })
    if (error) throw error
    setWorkouts(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Finds today's workout if one already exists, otherwise creates it with the
  // most recently used location pre-filled so the user rarely has to type it.
  // Uses upsert + ignoreDuplicates against the (user_id, workout_date) unique
  // constraint so two concurrent calls (e.g. React StrictMode's double-effect
  // in dev, or two tabs) converge on one row instead of racing to insert two.
  const getOrCreateTodayWorkout = useCallback(async (): Promise<Workout> => {
    const today = new Date().toISOString().slice(0, 10)
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id
    if (!userId) throw new Error('Not signed in')

    const { data: mostRecent } = await supabase
      .from('workouts')
      .select('location')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const nowTime = new Date().toTimeString().slice(0, 8)
    const { error: upsertError } = await supabase.from('workouts').upsert(
      {
        user_id: userId,
        workout_date: today,
        start_time: nowTime,
        location: mostRecent?.location ?? null,
      },
      { onConflict: 'user_id,workout_date', ignoreDuplicates: true },
    )
    if (upsertError) throw upsertError

    const { data: current, error: selectError } = await supabase
      .from('workouts')
      .select('*')
      .eq('workout_date', today)
      .single()
    if (selectError) throw selectError
    await refresh()
    return current
  }, [refresh])

  const updateWorkout = useCallback(
    async (id: string, patch: Partial<Pick<Workout, 'location' | 'notes' | 'start_time' | 'workout_date'>>) => {
      const { error } = await supabase.from('workouts').update(patch).eq('id', id)
      if (error) throw error
      await refresh()
    },
    [refresh],
  )

  const deleteWorkout = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('workouts').delete().eq('id', id)
      if (error) throw error
      await refresh()
    },
    [refresh],
  )

  return { workouts, loading, refresh, getOrCreateTodayWorkout, updateWorkout, deleteWorkout }
}

export async function fetchWorkoutById(id: string): Promise<Workout | null> {
  const { data, error } = await supabase.from('workouts').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data
}
