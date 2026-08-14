import type { ReactNode } from 'react'
import './VnStage.css'
import { IMG } from '@/media/images'

export type VnBg = 'office' | 'wall'

interface VnStageProps {
  /** Atmosphere layer; swap for real art via backgroundSrc later. */
  bg?: VnBg
  /** Optional full-bleed background image (overrides CSS atmosphere). */
  backgroundSrc?: string | null
  showPortrait?: boolean
  portraitSrc?: string
  /** full = 全身；half = 半身放大 */
  portraitFit?: 'full' | 'half'
  speaker?: string
  line?: string | null
  showSangrealBoard?: boolean
  hint?: ReactNode
  children?: ReactNode
  className?: string
}

export function VnStage({
  bg = 'office',
  backgroundSrc = null,
  showPortrait = false,
  portraitSrc = IMG.standing,
  portraitFit = 'full',
  speaker = '兰登',
  line = null,
  showSangrealBoard = false,
  hint = null,
  children = null,
  className = '',
}: VnStageProps) {
  const stageClass = ['vn-stage', className].filter(Boolean).join(' ')
  const fit = portraitFit === 'half' || portraitSrc.includes('half') ? 'half' : 'full'

  return (
    <div className={stageClass}>
      {backgroundSrc ? (
        <img
          className="vn-backdrop-img"
          src={backgroundSrc}
          alt=""
          draggable={false}
        />
      ) : (
        <div className={`vn-backdrop is-${bg}`} aria-hidden />
      )}

      {showPortrait ? (
        <div
          className={['vn-portrait-wrap', fit === 'half' ? 'is-half' : '']
            .filter(Boolean)
            .join(' ')}
          aria-hidden
          key={portraitSrc}
        >
          <img
            className="vn-portrait"
            src={portraitSrc}
            alt=""
            draggable={false}
          />
        </div>
      ) : null}

      <div className="vn-vignette" aria-hidden />

      {showSangrealBoard ? (
        <img
          className="vn-sangreal"
          src={IMG.sangreal}
          alt=""
          draggable={false}
          aria-hidden
        />
      ) : null}

      {children ? <div className="vn-layer">{children}</div> : null}

      {line ? (
        <div className="vn-dialogue">
          <span className="vn-nameplate">{speaker}</span>
          <div className="vn-box">
            <p className="vn-line">{line}</p>
          </div>
        </div>
      ) : null}

      {hint ? <div className="vn-hint">{hint}</div> : null}
    </div>
  )
}
