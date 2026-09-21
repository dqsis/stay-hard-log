import type { ReactNode } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { BottomNav } from './BottomNav'

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg pb-20">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <h1 className="font-bold text-lg text-ink">{title}</h1>
        <button onClick={() => supabase.auth.signOut()} className="text-xs text-mid underline">
          Sign out
        </button>
      </header>
      <main className="px-4 py-4">{children}</main>
      <BottomNav />
    </div>
  )
}
