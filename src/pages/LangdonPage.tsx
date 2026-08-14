import type { ReactNode } from 'react'
import { PhoneShell } from '@/components/PhoneShell'
import { TitleScreen } from '@/components/TitleScreen'
import { DialoguePanel } from '@/components/DialoguePanel'
import { ChoicePanel } from '@/components/ChoicePanel'
import { Board } from '@/components/Board'
import { RadicalPuzzle } from '@/components/RadicalPuzzle'
import { Ending } from '@/components/Ending'
import { VnStage } from '@/components/VnStage'
import { useGame } from '@/game/useGame'
import { IMG } from '@/media/images'

export function LangdonPage() {
  const game = useGame()
  const {
    state,
    episode,
    currentOpeningBeat,
    pinOpeningClue,
    advanceIntro,
    advancePostAssemble,
    advanceEnding,
    advanceLinkDialogue,
  } = game

  let body: ReactNode = null
  let onScreenTap: (() => void) | undefined
  let tapHint: string | undefined

  switch (state.phase) {
    case 'title':
      body = <TitleScreen game={game} />
      break
    case 'intro':
      body = <DialoguePanel game={game} />
      onScreenTap = advanceIntro
      tapHint = '点击屏幕继续对话'
      break
    case 'postAssemble':
      body = <DialoguePanel game={game} />
      onScreenTap = advancePostAssemble
      tapHint = '点击屏幕继续解说'
      break
    case 'choice':
      body = <ChoicePanel game={game} />
      break
    case 'discover': {
      const pinBeat =
        currentOpeningBeat?.type === 'pin' ? currentOpeningBeat : null
      body = (
        <VnStage
          backgroundSrc={IMG.wall}
          line={state.langdonLine}
          hint={
            <span className="vn-hint-continue">点击屏幕，把线索钉上探案墙</span>
          }
        >
          <Board
            game={game}
            interactive={false}
            previewClueId={pinBeat?.clueId ?? null}
            fill
          />
        </VnStage>
      )
      onScreenTap = pinOpeningClue
      tapHint = '点击屏幕钉上线索'
      break
    }
    case 'assembleWord':
      body = (
        <VnStage
          className="has-panel-dock"
          backgroundSrc={IMG.wall}
          line={state.langdonLine}
        >
          <Board game={game} interactive={false} fill />
          <div
            className="vn-panel-dock"
            onClick={(event) => event.stopPropagation()}
          >
            <RadicalPuzzle game={game} />
          </div>
        </VnStage>
      )
      break
    case 'linking': {
      const awaitingLinkLines = state.pendingLinkLines.length > 0
      body = (
        <VnStage
          backgroundSrc={IMG.wall}
          line={state.langdonLine}
          hint={
            awaitingLinkLines ? (
              <span className="vn-hint-continue">点击屏幕继续</span>
            ) : (
              <span className="vn-progress">
                {episode.ui.linkingProgress
                  .replace('{done}', String(state.lockedLinks.length))
                  .replace('{wrong}', String(state.wrongLinkCount))}
              </span>
            )
          }
        >
          <Board game={game} interactive={!awaitingLinkLines} fill />
        </VnStage>
      )
      if (awaitingLinkLines) {
        onScreenTap = advanceLinkDialogue
        tapHint = '点击屏幕继续'
      }
      break
    }
    case 'ending':
      body = <Ending game={game} />
      if (
        state.endingStep === 'epilogue' ||
        state.endingStep === 'epilogueOffice'
      ) {
        onScreenTap = advanceEnding
        tapHint = '点击屏幕继续'
      }
      break
  }

  return (
    <PhoneShell
      phase={state.phase}
      title={episode.meta.title}
      langdonLine={state.langdonLine}
      onScreenTap={onScreenTap}
      tapHint={tapHint}
    >
      {body}
    </PhoneShell>
  )
}
