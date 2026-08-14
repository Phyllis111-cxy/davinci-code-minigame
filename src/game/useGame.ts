import { useCallback, useMemo, useState } from 'react'
import type { ClueId, GamePhase, GameState } from '@/types/game'
import {
  createInitialState,
  episode,
  getOpeningBeat,
  isLiteralChurchLink,
  matchesCorrectLink,
  nextLinkStepIndex,
  normalizeLink,
} from '@/game/episode'

function enterBeat(
  _s: GameState,
  beatIndex: number,
): Pick<
  GameState,
  'phase' | 'openingBeatIndex' | 'openingLineIndex' | 'langdonLine' | 'highlightClueIds'
> {
  const beat = getOpeningBeat(beatIndex)
  if (!beat) {
    return {
      phase: 'assembleWord',
      openingBeatIndex: beatIndex,
      openingLineIndex: 0,
      langdonLine: episode.clues.find((c) => c.id === 'C')?.langdonComment ?? null,
      highlightClueIds: [],
    }
  }
  if (beat.type === 'talk') {
    return {
      phase: 'intro',
      openingBeatIndex: beatIndex,
      openingLineIndex: 0,
      langdonLine: beat.lines[0]?.text ?? null,
      highlightClueIds: [],
    }
  }
  if (beat.type === 'choice') {
    return {
      phase: 'choice',
      openingBeatIndex: beatIndex,
      openingLineIndex: 0,
      langdonLine: beat.question,
      highlightClueIds: [beat.clueId],
    }
  }
  return {
    phase: 'discover',
    openingBeatIndex: beatIndex,
    openingLineIndex: 0,
    langdonLine: beat.line,
    highlightClueIds: [beat.clueId],
  }
}

export function useGame() {
  const [state, setState] = useState<GameState>(createInitialState)

  const reset = useCallback(() => {
    setState(createInitialState())
  }, [])

  const beginEpisode = useCallback(() => {
    setState((s) => {
      if (s.phase !== 'title') return s
      return { ...s, ...enterBeat(s, 0) }
    })
  }, [])

  const setLangdonLine = useCallback((text: string | null) => {
    setState((s) => ({ ...s, langdonLine: text }))
  }, [])

  const advanceIntro = useCallback(() => {
    setState((s) => {
      if (s.phase !== 'intro') return s
      const beat = getOpeningBeat(s.openingBeatIndex)
      if (!beat || beat.type !== 'talk') return s

      const nextLine = s.openingLineIndex + 1
      if (nextLine < beat.lines.length) {
        return {
          ...s,
          openingLineIndex: nextLine,
          langdonLine: beat.lines[nextLine].text,
        }
      }

      // Move to next opening beat (usually a pin)
      return { ...s, ...enterBeat(s, s.openingBeatIndex + 1) }
    })
  }, [])

  const answerOpeningChoice = useCallback((choiceId: string) => {
    setState((s) => {
      if (s.phase !== 'choice') return s
      const beat = getOpeningBeat(s.openingBeatIndex)
      if (!beat || beat.type !== 'choice') return s

      const choice = beat.choices.find((c) => c.id === choiceId)
      if (!choice) return s

      if (!choice.correct) {
        return {
          ...s,
          langdonLine: choice.wrongLine ?? beat.question,
        }
      }

      return { ...s, ...enterBeat(s, s.openingBeatIndex + 1) }
    })
  }, [])

  const pinOpeningClue = useCallback(() => {
    setState((s) => {
      if (s.phase !== 'discover') return s
      const beat = getOpeningBeat(s.openingBeatIndex)
      if (!beat || beat.type !== 'pin') return s

      const unlockedClues = s.unlockedClues.includes(beat.clueId)
        ? s.unlockedClues
        : [...s.unlockedClues, beat.clueId]
      const inspectedClues = s.inspectedClues.includes(beat.clueId)
        ? s.inspectedClues
        : [...s.inspectedClues, beat.clueId]

      if (beat.after === 'assembleWord') {
        return {
          ...s,
          unlockedClues,
          inspectedClues,
          phase: 'assembleWord',
          highlightClueIds: [],
          langdonLine:
            episode.clues.find((c) => c.id === beat.clueId)?.langdonComment ??
            beat.line,
        }
      }

      const next = enterBeat(s, s.openingBeatIndex + 1)
      return {
        ...s,
        unlockedClues,
        inspectedClues,
        ...next,
      }
    })
  }, [])

  const inspectClue = useCallback((id: ClueId) => {
    setState((s) => {
      if (!s.unlockedClues.includes(id)) return s
      const clue = episode.clues.find((c) => c.id === id)
      const inspected = s.inspectedClues.includes(id)
        ? s.inspectedClues
        : [...s.inspectedClues, id]

      let phase = s.phase
      let langdonLine = clue?.langdonComment ?? s.langdonLine

      // Only jump to assemble from inspect if already past opening and not assembled
      if (
        id === 'C' &&
        !s.wordAssembled &&
        (s.phase === 'linking' || s.phase === 'assembleWord')
      ) {
        phase = 'assembleWord'
        langdonLine = clue?.langdonComment ?? langdonLine
      }

      if (id === 'D') {
        langdonLine = clue?.langdonComment ?? clue?.revealText ?? langdonLine
      }

      return {
        ...s,
        inspectedClues: inspected,
        phase,
        langdonLine,
      }
    })
  }, [])

  const completeAssemble = useCallback(() => {
    const lines = episode.dialogue.afterAssembleLines
    setState((s) => ({
      ...s,
      wordAssembled: true,
      phase: 'postAssemble',
      openingLineIndex: 0,
      highlightClueIds: [],
      langdonLine: lines[0]?.text ?? episode.dialogue.hints.afterAssemble,
    }))
  }, [])

  const advancePostAssemble = useCallback(() => {
    setState((s) => {
      if (s.phase !== 'postAssemble') return s
      const lines = episode.dialogue.afterAssembleLines
      const nextLine = s.openingLineIndex + 1
      if (nextLine < lines.length) {
        return {
          ...s,
          openingLineIndex: nextLine,
          langdonLine: lines[nextLine].text,
        }
      }
      return {
        ...s,
        phase: 'linking',
        openingLineIndex: 0,
        langdonLine: episode.dialogue.hints.linkPickFirst,
      }
    })
  }, [])

  const selectClueForLink = useCallback((id: ClueId) => {
    setState((s) => {
      if (s.phase !== 'linking') {
        return s
      }
      if (s.pendingLinkLines.length > 0) return s
      if (!s.unlockedClues.includes(id)) return s
      if (id === 'C' && !s.wordAssembled) {
        return {
          ...s,
          langdonLine: episode.dialogue.hints.needAssembleFirst,
        }
      }
      if (!s.selectedClue) {
        return {
          ...s,
          selectedClue: id,
          highlightClueIds: [],
          langdonLine:
            s.lockedLinks.length === 0
              ? episode.dialogue.hints.linkPickFirst
              : s.langdonLine,
        }
      }
      if (s.selectedClue === id) {
        return { ...s, selectedClue: null }
      }

      const from = s.selectedClue
      const to = id
      const step = nextLinkStepIndex(s.lockedLinks.length)

      if (isLiteralChurchLink(from, to)) {
        const wrong = s.wrongLinkCount + 1
        return {
          ...s,
          selectedClue: null,
          wrongLinkCount: wrong,
          langdonLine: episode.dialogue.hints.literalChurch,
          highlightClueIds: wrong >= 4 ? nextHighlight(step) : [],
        }
      }

      if (!matchesCorrectLink(from, to, step)) {
        const wrong = s.wrongLinkCount + 1
        const hint =
          wrong >= 2
            ? episode.dialogue.hints.afterWrongLink2
            : episode.dialogue.hints.missingLink
        return {
          ...s,
          selectedClue: null,
          wrongLinkCount: wrong,
          langdonLine: hint,
          highlightClueIds: wrong >= 4 ? nextHighlight(step) : [],
        }
      }

      const expected = episode.board.correctLinksInOrder[step]
      const link = normalizeLink(from, to)
      const lockedLinks = [...s.lockedLinks, link]
      let unlockedClues = [...s.unlockedClues]
      let phase: GamePhase = s.phase

      const bc = normalizeLink('B', 'C')
      if (link.from === bc.from && link.to === bc.to && !unlockedClues.includes('D')) {
        unlockedClues = [...unlockedClues, 'D']
      }

      if (lockedLinks.length >= episode.board.correctLinksInOrder.length) {
        phase = 'ending'
      }

      const pages = Array.isArray(expected.successLine)
        ? expected.successLine
        : [expected.successLine]

      if (phase === 'ending') {
        return {
          ...s,
          selectedClue: null,
          lockedLinks,
          unlockedClues,
          phase,
          endingStep: 'epilogue',
          wrongLinkCount: 0,
          highlightClueIds: [],
          pendingLinkLines: [],
          langdonLine: episode.dialogue.hints.endingSuccess,
        }
      }

      return {
        ...s,
        selectedClue: null,
        lockedLinks,
        unlockedClues,
        phase,
        wrongLinkCount: 0,
        highlightClueIds: [],
        langdonLine: pages[0] ?? null,
        pendingLinkLines: pages.slice(1),
      }
    })
  }, [])

  const advanceLinkDialogue = useCallback(() => {
    setState((s) => {
      if (s.phase !== 'linking' || s.pendingLinkLines.length === 0) return s
      const [next, ...rest] = s.pendingLinkLines
      return {
        ...s,
        langdonLine: next,
        pendingLinkLines: rest,
      }
    })
  }, [])

  const advanceEnding = useCallback(() => {
    setState((s) => {
      if (s.phase !== 'ending') return s
      if (s.endingStep === 'epilogue') {
        return {
          ...s,
          endingStep: 'epilogueOffice',
          langdonLine: episode.dialogue.hints.endingSuccessOffice,
        }
      }
      if (s.endingStep === 'epilogueOffice') {
        return { ...s, endingStep: 'cta', langdonLine: null }
      }
      return s
    })
  }, [])

  const goToPhase = useCallback((phase: GameState['phase']) => {
    setState((s) => ({ ...s, phase }))
  }, [])

  const currentOpeningBeat = useMemo(
    () => getOpeningBeat(state.openingBeatIndex),
    [state.openingBeatIndex],
  )

  const boardReady = useMemo(
    () => state.unlockedClues.length > 0,
    [state.unlockedClues.length],
  )

  return {
    state,
    episode,
    boardReady,
    currentOpeningBeat,
    reset,
    beginEpisode,
    setLangdonLine,
    advanceIntro,
    answerOpeningChoice,
    pinOpeningClue,
    inspectClue,
    completeAssemble,
    advancePostAssemble,
    selectClueForLink,
    advanceLinkDialogue,
    advanceEnding,
    goToPhase,
  }
}

function nextHighlight(step: number): ClueId[] {
  const expected = episode.board.correctLinksInOrder[step]
  if (!expected) return []
  return [expected.from]
}

export type GameApi = ReturnType<typeof useGame>
