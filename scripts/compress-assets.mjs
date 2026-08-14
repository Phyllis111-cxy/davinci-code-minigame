/**
 * Compress public PNG assets to WebP for faster first load.
 * Usage: node scripts/compress-assets.mjs
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')

/** @type {Record<string, { maxWidth: number; quality: number }>} */
const RULES = {
  'backgrounds/': { maxWidth: 1280, quality: 76 },
  'characters/': { maxWidth: 900, quality: 80 },
  'clues/': { maxWidth: 420, quality: 82 },
  'props/': { maxWidth: 1280, quality: 78 },
}

/** Used by the game — always compress these. */
const USED = [
  'backgrounds/office.png',
  'backgrounds/wall.png',
  'backgrounds/wall-panorama.png',
  'backgrounds/phi-lesson.png',
  'backgrounds/davinci-reading.png',
  'backgrounds/manuscript-a-1.png',
  'backgrounds/manuscript-a-2.png',
  'backgrounds/manuscript-b-2.png',
  'backgrounds/manuscript-c-1.png',
  'backgrounds/manuscript-e-2.png',
  'characters/langdon-standing.png',
  'characters/langdon-standing-talk.png',
  'characters/langdon-half.png',
  'clues/clue-a.png',
  'clues/clue-b.png',
  'clues/clue-c.png',
  'clues/clue-d.png',
  'clues/clue-e.png',
  'props/sangreal-board.png',
]

function ruleFor(rel) {
  for (const [prefix, rule] of Object.entries(RULES)) {
    if (rel.startsWith(prefix)) return rule
  }
  return { maxWidth: 1280, quality: 78 }
}

async function compressOne(rel) {
  const input = path.join(publicDir, rel)
  const output = input.replace(/\.png$/i, '.webp')
  const rule = ruleFor(rel)
  const before = (await fs.stat(input)).size

  await sharp(input)
    .rotate()
    .resize({
      width: rule.maxWidth,
      withoutEnlargement: true,
    })
    .webp({
      quality: rule.quality,
      alphaQuality: 85,
      effort: 5,
    })
    .toFile(output)

  const after = (await fs.stat(output)).size
  const pct = ((1 - after / before) * 100).toFixed(0)
  console.log(
    `${rel}  ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB  (-${pct}%)`,
  )
}

async function main() {
  let totalBefore = 0
  let totalAfter = 0
  for (const rel of USED) {
    const input = path.join(publicDir, rel)
    try {
      await fs.access(input)
    } catch {
      console.warn('skip missing', rel)
      continue
    }
    const before = (await fs.stat(input)).size
    await compressOne(rel)
    const after = (await fs.stat(input.replace(/\.png$/i, '.webp'))).size
    totalBefore += before
    totalAfter += after
  }
  console.log(
    `\nUSED TOTAL  ${(totalBefore / 1024 / 1024).toFixed(1)}MB → ${(totalAfter / 1024 / 1024).toFixed(1)}MB`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
