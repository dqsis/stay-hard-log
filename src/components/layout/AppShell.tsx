import type { ReactNode } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { BottomNav } from './BottomNav'

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg pb-24">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <a
          href="https://dqsis.com"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-2.5 no-underline"
        >
          <img src="/images/dqsis-logo.png" alt="DQSIS logo" className="h-7 w-7 object-contain" />
          <span className="text-[0.8rem] font-semibold uppercase tracking-wide text-ink">
            Stay Hard Log
            <span className="block text-[0.68rem] font-normal normal-case tracking-wide text-mid">
              dqsis.com
            </span>
          </span>
        </a>
        <button onClick={() => supabase.auth.signOut()} className="text-[0.72rem] tracking-wide text-mid">
          Sign out
        </button>
      </header>

      <main className="px-4 py-4">
        <p className="eyebrow mb-4 text-[0.75rem] font-medium tracking-wide text-mid">{title}</p>
        {children}
        <p className="site-footer mt-10 border-t border-border pt-4 text-center text-[0.7rem] font-medium text-mid">
          Stay hard.
        </p>
      </main>

      <BottomNav />
    </div>
  )
}
