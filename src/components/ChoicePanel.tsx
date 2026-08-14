import type { GameApi } from '@/game/useGame'
import { VnStage } from '@/components/VnStage'
import { IMG } from '@/media/images'

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
        {currentOpeningBeat.choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            className="vn-choice-btn"
            onClick={(event) => {
              event.stopPropagation()
              answerOpeningChoice(choice.id)
            }}
          >
            {choice.text}
          </button>
        ))}
      </div>
    </VnStage>
  )
}
