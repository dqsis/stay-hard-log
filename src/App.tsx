import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { LogWorkoutScreen } from './components/log/LogWorkoutScreen'
import { HistoryScreen } from './components/history/HistoryScreen'
import { WorkoutDetailScreen } from './components/history/WorkoutDetailScreen'
import { StatsScreen } from './components/stats/StatsScreen'

function App() {
  return (
    <BrowserRouter>
      <ProtectedRoute>
        <Routes>
          <Route path="/" element={<LogWorkoutScreen />} />
          <Route path="/history" element={<HistoryScreen />} />
          <Route path="/history/:id" element={<WorkoutDetailScreen />} />
          <Route path="/stats" element={<StatsScreen />} />
        </Routes>
      </ProtectedRoute>
    </BrowserRouter>
  )
}

export default App
