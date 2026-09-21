import { useMemo, useState } from 'react'
import type { Exercise } from '../../lib/types'

export function ExercisePicker({
  exercises,
  onSelect,
  onCreateNew,
  onClose,
}: {
  exercises: Exercise[]
  onSelect: (exercise: Exercise) => void
  onCreateNew: (name: string) => Promise<Exercise>
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const [creating, setCreating] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return exercises
    return exercises.filter((e) => e.name.toLowerCase().includes(q))
  }, [exercises, query])

  const exactMatch = exercises.some((e) => e.name.toLowerCase() === query.trim().toLowerCase())

  async function handleCreateNew() {
    setCreating(true)
    try {
      const exercise = await onCreateNew(query.trim())
      onSelect(exercise)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 z-20 flex flex-col bg-bg">
      <div className="flex items-center gap-2 border-b border-border p-3">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search exercises…"
          className="flex-1 rounded border border-border bg-white px-3 py-2 text-ink"
        />
        <button onClick={onClose} className="px-2 text-mid">
          Cancel
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {query.trim() && !exactMatch && (
          <button
            onClick={handleCreateNew}
            disabled={creating}
            className="w-full border-b border-border px-4 py-3 text-left text-terracotta disabled:opacity-50"
          >
            + Add "{query.trim()}" as new exercise
          </button>
        )}
        {filtered.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => onSelect(exercise)}
            className="w-full border-b border-border px-4 py-3 text-left text-ink"
          >
            {exercise.name}
          </button>
        ))}
        {filtered.length === 0 && !query.trim() && (
          <p className="p-4 text-sm text-mid">No exercises yet — type a name above to add one.</p>
        )}
      </div>
    </div>
  )
}
