export type GamePhase =
  | 'title'
  | 'intro'
  | 'choice'
  | 'discover'
  | 'assembleWord'
  | 'postAssemble'
  | 'linking'
  | 'ending'

export type EndingStep = 'epilogue' | 'epilogueOffice' | 'cta'

export type ClueId = 'A' | 'B' | 'C' | 'D' | 'E'

export interface DialogueLine {
  id: string
  speaker: string
  text: string
}

export interface OpeningChoice {
  id: string
  text: string
  correct: boolean
  wrongLine?: string
}

export type OpeningBeat =
  | {
      id: string
      type: 'talk'
      lines: DialogueLine[]
    }
  | {
      id: string
      type: 'choice'
      clueId: ClueId
      question: string
      choices: OpeningChoice[]
    }
  | {
      id: string
      type: 'pin'
      clueId: ClueId
      line: string
      button: string
      after?: GamePhase
    }

export interface ClueData {
  id: ClueId
  name: string
  type: string
  unlock: string
  highlight?: string
  langdonComment?: string
  decorativeForeignText?: string
  targetWord?: string
  assemble?: {
    slots: number
    parts: string[]
    decoyParts: string[]
    note?: string
    groups?: Array<{
      label: string
      structure: string
      parts: string[]
      result: string
    }>
  }
  revealText?: string
  surfaceText?: string
  langdonCommentOnWrongLink?: string
}

export interface CorrectLink {
  from: ClueId
  to: ClueId
  proof: string
  /** One line, or multiple pages advanced by tap. */
  successLine: string | string[]
  requires?: string[]
}

export interface EpisodeData {
  meta: {
    episodeId: string
    title: string
    durationMinutes: number[]
    lead: string
    tone: string
    locale: string
    notes: string
  }
  flow: GamePhase[]
  titleScreen: {
    kicker: string
    headline: string
    setting: string
    blurb: string
    duration: string
    cta: string
  }
  opening: {
    beats: OpeningBeat[]
  }
  dialogue: {
    intro: DialogueLine[]
    afterAssembleLines: DialogueLine[]
    hints: Record<string, string>
  }
  ui: {
    introSceneHint: string
    introContinue: string
    introToChoice: string
    introPinFirst: string
    choiceSceneHint: string
    postAssembleSceneHint: string
    postAssembleContinue: string
    postAssembleToLink: string
    discoverTip: string
    linkingTip: string
    linkingProgress: string
    assembleTitle: string
    assembleDeco: string
    assembleSubmit: string
    playAgain: string
    purchasePending: string
  }
  clues: ClueData[]
  board: {
    layout: string
    freeDragDuringPuzzle: boolean
    linkInput: string
    correctLinksInOrder: CorrectLink[]
    alwaysWrongExamples: Array<{ from: ClueId; to: ClueId; reason: string }>
    gates: {
      linksInvolvingCRequireAssemble: boolean
      strictOrder: boolean
    }
  }
  ending: {
    ctaOrder: string[]
    sophieTeaser: {
      title: string
      blurb: string
      route: string
      available: boolean
    }
    purchase: {
      label: string
      url: string
    }
  }
  tech: {
    stackSuggestion: string
    modules: string[]
    orientation: string
  }
}

export interface LockedLink {
  from: ClueId
  to: ClueId
}

export interface GameState {
  phase: GamePhase
  /** Index into episode.opening.beats */
  openingBeatIndex: number
  /** Line index within a talk beat */
  openingLineIndex: number
  unlockedClues: ClueId[]
  inspectedClues: ClueId[]
  wordAssembled: boolean
  lockedLinks: LockedLink[]
  selectedClue: ClueId | null
  wrongLinkCount: number
  endingStep: EndingStep
  /** Remaining success-line pages after the current langdonLine (linking). */
  pendingLinkLines: string[]
  langdonLine: string | null
  highlightClueIds: ClueId[]
}
