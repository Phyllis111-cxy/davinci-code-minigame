import type { GameApi } from '@/game/useGame'
import { VnStage } from '@/components/VnStage'
import { IMG } from '@/media/images'
import './ChoicePanel.css'

interface ChoicePanelProps {
  game: GameApi
}

export function ChoicePanel({ game }: ChoicePanelProps) {
  const { currentOpeningBeat, answerOpeningChoice, episode, state } = game

  if (!currentOpeningBeat || currentOpeningBeat.type !== 'choice') {
    return null
  }

  const manuscriptByClue: Partial<Record<string, string>> = {
    A: IMG.manuscriptA2,
    B: IMG.manuscriptB2,
    E: IMG.manuscriptE2,
  }
  const manuscriptSrc = currentOpeningBeat.clueId
    ? manuscriptByClue[currentOpeningBeat.clueId]
    : undefined
  const useManuscript = Boolean(manuscriptSrc)

  return (
    <VnStage
      className="has-choices"
      backgroundSrc={manuscriptSrc ?? IMG.office}
      showPortrait={!useManuscript}
      portraitSrc={IMG.half}
      line={state.langdonLine}
      hint={<span className="vn-hint-continue">{episode.ui.choiceSceneHint}</span>}
    >
      <div className="vn-choices" role="group" aria-label="观察选项">
        <p className="vn-choices-kicker">观察笔记 · 三选一</p>
        {currentOpeningBeat.choices.map((choice, index) => (
          <button
            key={choice.id}
            type="button"
            className="vn-choice-btn"
            style={{ animationDelay: `${0.08 + index * 0.07}s` }}
            onClick={(event) => {
              event.stopPropagation()
              answerOpeningChoice(choice.id)
            }}
          >
            <span className="vn-choice-index" aria-hidden>
              {String.fromCharCode(65 + index)}
            </span>
            <span className="vn-choice-body">
              <span className="vn-choice-text">{choice.text}</span>
            </span>
            <span className="vn-choice-corner" aria-hidden />
          </button>
        ))}
      </div>
    </VnStage>
  )
}
