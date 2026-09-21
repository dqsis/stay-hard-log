export interface Exercise {
  id: string
  user_id: string
  name: string
  created_at: string
}

export interface Workout {
  id: string
  user_id: string
  workout_date: string // yyyy-mm-dd
  start_time: string | null // HH:mm:ss
  location: string | null
  notes: string | null
  created_at: string
}

export interface SetRow {
  id: string
  user_id: string
  workout_id: string
  exercise_id: string
  set_number: number
  reps: number
  weight_kg: number
  created_at: string
}

export interface NewSetInput {
  workout_id: string
  exercise_id: string
  set_number: number
  reps: number
  weight_kg: number
}
