import type { KeyboardEvent, ReactNode } from 'react'
import { PHASE_LABEL } from '@/game/episode'
import type { GamePhase } from '@/types/game'
import './PhoneShell.css'

interface PhoneShellProps {
  phase: GamePhase
  title: string
  langdonLine: string | null
  children: ReactNode
  footer?: ReactNode
  /** When set, tap anywhere on the phone frame to advance dialogue. */
  onScreenTap?: () => void
  tapHint?: string
}

export function PhoneShell({
  phase,
  title,
  langdonLine,
  children,
  footer,
  onScreenTap,
  tapHint,
}: PhoneShellProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onScreenTap) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onScreenTap()
    }
  }

  return (
    <div className="app-frame">
      <div
        className={['phone-shell', onScreenTap ? 'is-tap-advance' : '']
          .filter(Boolean)
          .join(' ')}
        onClick={onScreenTap}
        onKeyDown={onKeyDown}
        role={onScreenTap ? 'button' : undefined}
        tabIndex={onScreenTap ? 0 : undefined}
        aria-label={onScreenTap ? tapHint ?? '点击继续' : undefined}
      >
        <header className="shell-header">
          <p className="shell-kicker">{PHASE_LABEL[phase]}</p>
          <span className="shell-title-sr">{title}</span>
        </header>

        <main className="shell-main">{children}</main>

        <span className="vn-live-sr" aria-live="polite">
          {langdonLine}
        </span>

        {footer ? <footer className="shell-footer">{footer}</footer> : null}
      </div>
    </div>
  )
}
