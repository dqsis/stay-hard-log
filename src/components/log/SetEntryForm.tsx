import { useState } from 'react'

function Stepper({
  value,
  step,
  min,
  suffix,
  onChange,
}: {
  value: number
  step: number
  min: number
  suffix: string
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, round(value - step)))}
        className="h-10 w-10 rounded-full border border-border bg-white text-lg text-ink"
      >
        −
      </button>
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-16 rounded border border-border bg-white py-2 text-center text-ink"
      />
      <span className="w-6 text-xs text-mid">{suffix}</span>
      <button
        type="button"
        onClick={() => onChange(round(value + step))}
        className="h-10 w-10 rounded-full border border-border bg-white text-lg text-ink"
      >
        +
      </button>
    </div>
  )
}

function round(n: number) {
  return Math.round(n * 100) / 100
}

export function SetEntryForm({
  defaultReps,
  defaultWeightKg,
  onAdd,
}: {
  defaultReps: number
  defaultWeightKg: number
  onAdd: (reps: number, weightKg: number, setsCount: number) => Promise<void>
}) {
  const [reps, setReps] = useState(defaultReps)
  const [weightKg, setWeightKg] = useState(defaultWeightKg)
  const [setsCount, setSetsCount] = useState(1)
  const [saving, setSaving] = useState(false)

  async function handleAdd() {
    setSaving(true)
    try {
      await onAdd(reps, weightKg, setsCount)
      setSetsCount(1)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-border bg-panel p-3">
      <Stepper value={setsCount} step={1} min={1} suffix="sets" onChange={setSetsCount} />
      <Stepper value={reps} step={1} min={0} suffix="reps" onChange={setReps} />
      <Stepper value={weightKg} step={2.5} min={0} suffix="kg" onChange={setWeightKg} />
      <button
        type="button"
        onClick={handleAdd}
        disabled={saving}
        className="rounded bg-ink px-4 py-2 font-semibold text-white disabled:opacity-50"
      >
        {setsCount > 1 ? `Add ${setsCount} Sets` : 'Add Set'}
      </button>
    </div>
  )
}
