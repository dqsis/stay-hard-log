import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Log', end: true },
  { to: '/history', label: 'History', end: false },
  { to: '/stats', label: 'Stats', end: false },
]

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-border bg-bg/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `flex-1 py-3 text-center text-[0.72rem] font-semibold uppercase tracking-wide ${isActive ? 'text-terracotta' : 'text-mid'}`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
