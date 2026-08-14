import type { GameApi } from '@/game/useGame'
import { VnStage } from '@/components/VnStage'
import { IMG } from '@/media/images'

const PORTRAITS = [IMG.standing, IMG.standingTalk, IMG.half] as const

function portraitForLine(lineIndex: number): string {
  return PORTRAITS[lineIndex % PORTRAITS.length]
}

interface DialoguePanelProps {
  game: GameApi
}

export function DialoguePanel({ game }: DialoguePanelProps) {
  const { state, episode } = game
  const { ui } = episode
  const line = state.langdonLine ?? ''

  if (state.phase === 'postAssemble') {
    const lines = episode.dialogue.afterAssembleLines
    const total = lines.length
    const current = state.openingLineIndex + 1
    const portraitSrc = portraitForLine(state.openingLineIndex)
    const showSangrealBoard = state.openingLineIndex >= 1

    return (
      <VnStage
        backgroundSrc={IMG.office}
        showPortrait={!showSangrealBoard}
        portraitSrc={portraitSrc}
        line={line}
        showSangrealBoard={showSangrealBoard}
        hint={
          <>
            <span>{ui.postAssembleSceneHint}</span>
            <span className="vn-hint-continue">{current}/{total} · 点击屏幕继续</span>
          </>
        }
      />
    )
  }

  if (state.phase !== 'intro') {
    return null
  }

  const beat = game.currentOpeningBeat
  if (!beat || beat.type !== 'talk') {
    return null
  }

  const total = beat.lines.length
  const current = state.openingLineIndex + 1
  const beatIndex = state.openingBeatIndex
  const lineIndex = state.openingLineIndex
  const portraitSrc = portraitForLine(lineIndex)

  /** talk0 special slides (indices after removing 原 5/9·6/9 材料说明页) */
  const usePhiLesson = beatIndex === 0 && lineIndex === 4
  const useDavinciReading = beatIndex === 0 && lineIndex === 5

  /** talkA-setup 1/2 & 2/2：画作残稿（《最后的晚餐》课堂摹本） */
  const useManuscriptA1 = beatIndex === 1 && lineIndex === 0
  const useManuscriptA2 = beatIndex === 1 && lineIndex === 1
  /** talkB-setup 2/2：玫瑰纹章拓片 */
  const useManuscriptB2 = beatIndex === 5 && lineIndex === 1
  /** talkE-setup：圣堂平面（诱饵） */
  const useManuscriptE2 = beatIndex === 10
  /** talkC-setup：残破字笺（1/3–3/3 同用总览图） */
  const useManuscriptC = beatIndex === 14

  const hidePortrait =
    usePhiLesson ||
    useDavinciReading ||
    useManuscriptA1 ||
    useManuscriptA2 ||
    useManuscriptB2 ||
    useManuscriptE2 ||
    useManuscriptC

  let backgroundSrc: string = IMG.office
  if (usePhiLesson) backgroundSrc = IMG.phiLesson
  else if (useDavinciReading) backgroundSrc = IMG.davinciReading
  else if (useManuscriptA1) backgroundSrc = IMG.manuscriptA1
  else if (useManuscriptA2) backgroundSrc = IMG.manuscriptA2
  else if (useManuscriptB2) backgroundSrc = IMG.manuscriptB2
  else if (useManuscriptE2) backgroundSrc = IMG.manuscriptE2
  else if (useManuscriptC) backgroundSrc = IMG.manuscriptC1

  return (
    <VnStage
      backgroundSrc={backgroundSrc}
      showPortrait={!hidePortrait}
      portraitSrc={portraitSrc}
      line={line}
      hint={
        <>
          <span>{ui.introSceneHint}</span>
          <span className="vn-hint-continue">{current}/{total} · 点击屏幕继续</span>
        </>
      }
    />
  )
}
