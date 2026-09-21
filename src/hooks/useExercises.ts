import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Exercise } from '../lib/types'

// Sorted by most-recently-used first (falls back to name for exercises never logged),
// so the picker surfaces the handful of exercises the user actually does.
export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const [{ data: exerciseRows, error: exErr }, { data: setRows, error: setErr }] = await Promise.all([
      supabase.from('exercises').select('*').order('name'),
      supabase.from('sets').select('exercise_id, created_at').order('created_at', { ascending: false }),
    ])
    if (exErr) throw exErr
    if (setErr) throw setErr

    const lastUsed = new Map<string, string>()
    for (const row of setRows ?? []) {
      if (!lastUsed.has(row.exercise_id)) lastUsed.set(row.exercise_id, row.created_at)
    }

    const sorted = [...(exerciseRows ?? [])].sort((a, b) => {
      const aUsed = lastUsed.get(a.id)
      const bUsed = lastUsed.get(b.id)
      if (aUsed && bUsed) return bUsed.localeCompare(aUsed)
      if (aUsed) return -1
      if (bUsed) return 1
      return a.name.localeCompare(b.name)
    })

    setExercises(sorted)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const findOrCreateExercise = useCallback(
    async (rawName: string): Promise<Exercise> => {
      const name = rawName.trim()
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData.user?.id
      if (!userId) throw new Error('Not signed in')

      const { data: inserted, error: insertError } = await supabase
        .from('exercises')
        .insert({ name, user_id: userId })
        .select()
        .single()

      if (!insertError && inserted) {
        await refresh()
        return inserted
      }

      if (insertError?.code === '23505') {
        const { data: existing, error: fetchError } = await supabase
          .from('exercises')
          .select('*')
          .ilike('name', name)
          .single()
        if (fetchError) throw fetchError
        return existing
      }

      throw insertError
    },
    [refresh],
  )

  return { exercises, loading, refresh, findOrCreateExercise }
}
