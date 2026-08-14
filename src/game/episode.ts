import type {
  ClueId,
  EpisodeData,
  GamePhase,
  GameState,
  LockedLink,
  OpeningBeat,
} from '@/types/game'
import episodeJson from '@/data/langdon-01.json'

export const episode = episodeJson as EpisodeData

export const PHASE_LABEL: Record<GamePhase, string> = {
  title: '符号线索',
  intro: '幕一 · 办公室',
  choice: '幕一 · 观察',
  discover: '幕一 · 钉上线索',
  assembleWord: '幕二 · 拼字',
  postAssemble: '幕二 · Sangreal',
  linking: '幕二 · 连线推理',
  ending: '通关',
}

export function getOpeningBeat(index: number): OpeningBeat | undefined {
  return episode.opening.beats[index]
}

export function firstOpeningLine(): string | null {
  const beat = episode.opening.beats[0]
  if (!beat) return null
  if (beat.type === 'talk') return beat.lines[0]?.text ?? null
  if (beat.type === 'choice') return beat.question
  return beat.line
}

export function createInitialState(): GameState {
  return {
    phase: 'title',
    openingBeatIndex: 0,
    openingLineIndex: 0,
    unlockedClues: [],
    inspectedClues: [],
    wordAssembled: false,
    lockedLinks: [],
    selectedClue: null,
    wrongLinkCount: 0,
    endingStep: 'epilogue',
    pendingLinkLines: [],
    langdonLine: null,
    highlightClueIds: [],
  }
}

function linkKey(a: ClueId, b: ClueId): string {
  return [a, b].sort().join('-')
}

export function isSameLink(a: LockedLink, b: LockedLink): boolean {
  return linkKey(a.from, a.to) === linkKey(b.from, b.to)
}

export function normalizeLink(from: ClueId, to: ClueId): LockedLink {
  return from < to ? { from, to } : { from: to, to: from }
}

/** Next required correct link index based on locked links count (strict order). */
export function nextLinkStepIndex(lockedCount: number): number {
  return lockedCount
}

export function getCorrectLinkAt(step: number) {
  return episode.board.correctLinksInOrder[step]
}

export function isLiteralChurchLink(from: ClueId, to: ClueId): boolean {
  return episode.board.alwaysWrongExamples.some(
    (w) => linkKey(w.from, w.to) === linkKey(from, to),
  )
}

export function matchesCorrectLink(
  from: ClueId,
  to: ClueId,
  step: number,
): boolean {
  const expected = getCorrectLinkAt(step)
  if (!expected) return false
  return linkKey(expected.from, expected.to) === linkKey(from, to)
}

export const PIN_LAYOUT: Record<ClueId, { x: number; y: number }> = {
  /**
   * Clear cork play area — spaced for 84px art cards + link lines.
   * Bottom pair sits high enough to clear the dialogue box.
   */
  A: { x: 24, y: 30 },
  B: { x: 76, y: 30 },
  C: { x: 50, y: 48 },
  D: { x: 24, y: 66 },
  E: { x: 76, y: 66 },
}
