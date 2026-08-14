import { BOOT_PRELOAD, WARM_PRELOAD } from '@/media/images'

const warmed = new Set<string>()

function preloadOne(src: string): Promise<void> {
  if (warmed.has(src)) return Promise.resolve()
  warmed.add(src)
  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = src
  })
}

/** Kick off critical assets immediately; warm the rest when the browser is idle. */
export function startImagePreload(): void {
  void Promise.all(BOOT_PRELOAD.map(preloadOne)).then(() => {
    const runWarm = () => {
      void (async () => {
        for (const src of WARM_PRELOAD) {
          await preloadOne(src)
          // Yield so taps stay responsive while warming.
          await new Promise((r) => setTimeout(r, 40))
        }
      })()
    }

    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(runWarm, { timeout: 1800 })
    } else {
      window.setTimeout(runWarm, 400)
    }
  })
}

/** Preload a specific list (e.g. next scene). Safe to call repeatedly. */
export function preloadImages(srcs: string[]): void {
  for (const src of srcs) void preloadOne(src)
}
