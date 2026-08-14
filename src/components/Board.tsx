import { PIN_LAYOUT } from '@/game/episode'
import type { GameApi } from '@/game/useGame'
import type { ClueId } from '@/types/game'
import { IMG } from '@/media/images'
import './Board.css'

interface BoardProps {
  game: GameApi
  interactive?: boolean
  /** Clue shown as a pending pin (not yet confirmed). */
  previewClueId?: ClueId | null
  /** Fill the parent stage; background comes from VnStage wall art. */
  fill?: boolean
}

/** Illustrated clue cards (no letter IDs on art). */
const CLUE_CARD_SRC: Partial<Record<ClueId, string>> = {
  A: IMG.clueA,
  B: IMG.clueB,
  C: IMG.clueC,
  D: IMG.clueD,
  E: IMG.clueE,
}

const CLUE_GLYPH: Record<ClueId, string> = {
  A: '手',
  B: '玫',
  C: '字',
  D: '脉',
  E: '堂',
}

export function Board({
  game,
  interactive = true,
  previewClueId = null,
  fill = false,
}: BoardProps) {
  const { state, episode, inspectClue, selectClueForLink } = game

  const onPinClick = (id: ClueId) => {
    if (!interactive) return
    if (state.phase === 'linking') {
      selectClueForLink(id)
      return
    }
    inspectClue(id)
  }

  const selectedPos = state.selectedClue ? PIN_LAYOUT[state.selectedClue] : null

  return (
    <div
      className={['board', fill ? 'is-fill' : ''].filter(Boolean).join(' ')}
      role="application"
      aria-label="探案墙"
    >
      {!fill ? <div className="board-texture" aria-hidden /> : null}
      {!fill ? <div className="board-vignette" aria-hidden /> : null}

      <svg className="board-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        {state.lockedLinks.map((link) => {
          const a = PIN_LAYOUT[link.from]
          const b = PIN_LAYOUT[link.to]
          return (
            <line
              key={`${link.from}-${link.to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              className="board-line locked"
              pathLength={100}
            />
          )
        })}
        {selectedPos ? (
          <>
            <circle
              cx={selectedPos.x}
              cy={selectedPos.y}
              r="4.5"
              className="board-select-ring"
            />
            <circle
              cx={selectedPos.x}
              cy={selectedPos.y}
              r="2"
              className="board-select-core"
            />
          </>
        ) : null}
      </svg>

      {episode.clues.map((clue) => {
        const unlocked = state.unlockedClues.includes(clue.id)
        const isPreview = previewClueId === clue.id && !unlocked
        if (!unlocked && !isPreview) return null
        const pos = PIN_LAYOUT[clue.id]
        const selected = state.selectedClue === clue.id
        const highlighted = state.highlightClueIds.includes(clue.id) || isPreview
        const assembledMark = clue.id === 'C' && state.wordAssembled
        const inspected = state.inspectedClues.includes(clue.id)
        const cardSrc = CLUE_CARD_SRC[clue.id]

        return (
          <button
            key={clue.id}
            type="button"
            data-clue={clue.id}
            aria-label={clue.name}
            className={[
              'board-pin',
              cardSrc ? 'has-art' : '',
              selected ? 'is-selected' : '',
              highlighted ? 'is-hint' : '',
              assembledMark ? 'is-assembled' : '',
              inspected ? 'is-inspected' : '',
              isPreview ? 'is-preview' : '',
              clue.type === 'endpoint-decoy' ? 'is-decoy' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            onClick={() => onPinClick(clue.id)}
          >
            {cardSrc ? (
              <img
                className="pin-art"
                src={cardSrc}
                alt=""
                draggable={false}
              />
            ) : (
              <>
                <span className="pin-head" />
                <span className="pin-card">
                  <span className="pin-glyph" aria-hidden>
                    {CLUE_GLYPH[clue.id]}
                  </span>
                  <em>{clue.name}</em>
                  {clue.id === 'C' && state.wordAssembled ? (
                    <span className="pin-word">圣杯</span>
                  ) : null}
                  {clue.id === 'E' ? <span className="pin-decoy">？</span> : null}
                </span>
              </>
            )}
          </button>
        )
      })}
    </div>
  )
}
