/** Runtime image paths (WebP). Keep in sync with scripts/compress-assets.mjs USED list. */

const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

export const IMG = {
  office: asset('backgrounds/office.webp'),
  wall: asset('backgrounds/wall.webp'),
  wallPanorama: asset('backgrounds/wall-panorama.webp'),
  phiLesson: asset('backgrounds/phi-lesson.webp'),
  davinciReading: asset('backgrounds/davinci-reading.webp'),
  manuscriptA1: asset('backgrounds/manuscript-a-1.webp'),
  manuscriptA2: asset('backgrounds/manuscript-a-2.webp'),
  manuscriptB2: asset('backgrounds/manuscript-b-2.webp'),
  manuscriptC1: asset('backgrounds/manuscript-c-1.webp'),
  manuscriptE2: asset('backgrounds/manuscript-e-2.webp'),
  standing: asset('characters/langdon-standing.webp'),
  standingTalk: asset('characters/langdon-standing-talk.webp'),
  half: asset('characters/langdon-half.webp'),
  sangreal: asset('props/sangreal-board.webp'),
  clueA: asset('clues/clue-a.webp'),
  clueB: asset('clues/clue-b.webp'),
  clueC: asset('clues/clue-c.webp'),
  clueD: asset('clues/clue-d.webp'),
  clueE: asset('clues/clue-e.webp'),
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
