import { useEffect, useMemo, useRef, useState } from 'react'
import type { GameApi } from '@/game/useGame'
import './RadicalPuzzle.css'

interface RadicalPuzzleProps {
  game: GameApi
}

interface PoolPart {
  id: string
  label: string
  /** Absolute slot index, or -1 for decoy */
  correctSlot: number
}

const DEFAULT_GROUPS = [
  { label: '字一', structure: '上下', parts: ['又', '土'], result: '圣' },
  { label: '字二', structure: '左右', parts: ['木', '不'], result: '杯' },
]

export function RadicalPuzzle({ game }: RadicalPuzzleProps) {
  const { completeAssemble, setLangdonLine, episode } = game
  const clueC = episode.clues.find((c) => c.id === 'C')
  const assemble = clueC?.assemble

  const groups = assemble?.groups?.length
    ? assemble.groups
    : DEFAULT_GROUPS

  const flatParts = useMemo(
    () => groups.flatMap((g) => g.parts),
    [groups],
  )

  const correctParts: PoolPart[] = useMemo(
    () =>
      flatParts.map((label, index) => ({
        id: `part-${index}-${label}`,
        label,
        correctSlot: index,
      })),
    [flatParts],
  )

  const decoyParts: PoolPart[] = useMemo(() => {
    const decoys = assemble?.decoyParts ?? ['忄', '礻']
    return decoys.map((label, index) => ({
      id: `decoy-${index}-${label}`,
      label,
      correctSlot: -1,
    }))
  }, [assemble?.decoyParts])

  const allParts = useMemo(
    () => [...correctParts, ...decoyParts],
    [correctParts, decoyParts],
  )

  const slotCount = flatParts.length

  const pool = useMemo(() => {
    const items = [...allParts]
    return items.sort(() => Math.random() - 0.5)
  }, [allParts])

  const [slots, setSlots] = useState<(string | null)[]>(() =>
    Array.from({ length: slotCount }, () => null),
  )
  const [used, setUsed] = useState<string[]>([])

  const place = (partId: string) => {
    const part = allParts.find((p) => p.id === partId)
    if (!part) return
    if (part.correctSlot < 0) {
      setLangdonLine(episode.dialogue.hints.radicalWrong)
      return
    }
    setSlots((prev) => {
      if (prev[part.correctSlot] != null) return prev
      const next = [...prev]
      next[part.correctSlot] = part.label
      return next
    })
    setUsed((u) => (u.includes(partId) ? u : [...u, partId]))
  }

  const filled = slots.length > 0 && slots.every(Boolean)
  const completedRef = useRef(false)

  useEffect(() => {
    if (!filled || completedRef.current) return
    completedRef.current = true
    completeAssemble()
  }, [filled, completeAssemble])

  let slotOffset = 0

  return (
    <div className="radical-panel">
      <p className="radical-title">{episode.ui.assembleTitle}</p>
      <p className="radical-deco" aria-hidden>
        {episode.ui.assembleDeco}
      </p>
      <p className="radical-hint">
        用偏旁部首拼回两个字：字一是上下结构，字二是左右结构。
      </p>

      <div className="radical-groups">
        {groups.map((group) => {
          const start = slotOffset
          const groupSlots = group.parts.map((_, i) => slots[start + i] ?? null)
          slotOffset += group.parts.length
          const groupDone = groupSlots.every(Boolean)
          const isStack = group.structure.includes('上下')

          return (
            <div key={group.label} className="radical-group">
              <div className="radical-group-head">
                <span>
                  {group.label} · {group.structure}
                </span>
                <span
                  className={[
                    'radical-result',
                    groupDone ? 'is-ready' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {groupDone ? group.result : '？'}
                </span>
              </div>
              <div
                className={[
                  'radical-slots',
                  isStack ? 'is-stack' : 'is-row',
                ].join(' ')}
              >
                {group.parts.map((_, i) => (
                  <div key={`${group.label}-${i}`} className="radical-slot">
                    {groupSlots[i] ?? '·'}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="radical-pool">
        {pool.map((part) => {
          const disabled = used.includes(part.id)
          return (
            <button
              key={part.id}
              type="button"
              className="radical-part"
              disabled={disabled}
              onClick={() => place(part.id)}
            >
              {part.label}
            </button>
          )
        })}
      </div>
      {filled ? (
        <p className="radical-hint">拼合完成，正在钉上墙…</p>
      ) : null}
    </div>
  )
}
