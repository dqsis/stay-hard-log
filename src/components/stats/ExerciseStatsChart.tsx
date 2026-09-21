import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { StatPoint } from '../../hooks/useExerciseStats'

export function ExerciseStatsChart({ points }: { points: StatPoint[] }) {
  if (points.length === 0) {
    return <p className="text-mid">No sets logged for this exercise yet.</p>
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} unit="kg" width={48} />
          <Tooltip />
          <Line type="monotone" dataKey="topWeightKg" name="Top set (kg)" stroke="#b5563c" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
