import type { ReactNode } from 'react'
import { useSession } from '../../hooks/useSession'
import { LoginScreen } from '../login/LoginScreen'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useSession()

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-mid">Loading…</div>
  }
  if (!session) {
    return <LoginScreen />
  }
  return <>{children}</>
}
