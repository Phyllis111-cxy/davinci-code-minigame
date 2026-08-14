/** Runtime image paths (WebP). Keep in sync with scripts/compress-assets.mjs USED list. */
export const IMG = {
  office: '/backgrounds/office.webp',
  wall: '/backgrounds/wall.webp',
  wallPanorama: '/backgrounds/wall-panorama.webp',
  phiLesson: '/backgrounds/phi-lesson.webp',
  davinciReading: '/backgrounds/davinci-reading.webp',
  manuscriptA1: '/backgrounds/manuscript-a-1.webp',
  manuscriptA2: '/backgrounds/manuscript-a-2.webp',
  manuscriptB2: '/backgrounds/manuscript-b-2.webp',
  manuscriptC1: '/backgrounds/manuscript-c-1.webp',
  manuscriptE2: '/backgrounds/manuscript-e-2.webp',
  standing: '/characters/langdon-standing.webp',
  standingTalk: '/characters/langdon-standing-talk.webp',
  half: '/characters/langdon-half.webp',
  sangreal: '/props/sangreal-board.webp',
  clueA: '/clues/clue-a.webp',
  clueB: '/clues/clue-b.webp',
  clueC: '/clues/clue-c.webp',
  clueD: '/clues/clue-d.webp',
  clueE: '/clues/clue-e.webp',
} as const

/** First paint: office + standing portrait. */
export const BOOT_PRELOAD: string[] = [IMG.office, IMG.standing]

/**
 * Warm upcoming scenes while the player is still in early dialogue.
 * Order ≈ play order so early idle time fills the next screens.
 */
export const WARM_PRELOAD: string[] = [
  IMG.standingTalk,
  IMG.half,
  IMG.wallPanorama,
  IMG.phiLesson,
  IMG.davinciReading,
  IMG.manuscriptA1,
  IMG.manuscriptA2,
  IMG.manuscriptB2,
  IMG.manuscriptE2,
  IMG.manuscriptC1,
  IMG.wall,
  IMG.clueA,
  IMG.clueB,
  IMG.clueC,
  IMG.clueD,
  IMG.clueE,
  IMG.sangreal,
]
