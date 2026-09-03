import { useCallback, useEffect, useMemo, useState } from 'react'

/** Gossip Harbor–style merge chain — desk / campus themed. */
const chain = ['✏️', '📝', '📚', '🎒', '🐻', '🍁', '🧬', '🎨', '🏆'] as const

const COLS = 6
const ROWS = 5
const SIZE = COLS * ROWS
const BEST_KEY = 'cis-merge-best'

type Cell = { id: string; tier: number } | null

function uid() {
  return crypto.randomUUID()
}

function emptyBoard(): Cell[] {
  return Array.from({ length: SIZE }, () => null)
}

function randomLowTier() {
  // Bias toward early tiers so merges stay possible
  const roll = Math.random()
  if (roll < 0.55) return 0
  if (roll < 0.85) return 1
  return 2
}

function spawnOn(board: Cell[], tier = randomLowTier()): Cell[] | null {
  const empties = board.map((c, i) => (c ? -1 : i)).filter((i) => i >= 0)
  if (!empties.length) return null
  const at = empties[Math.floor(Math.random() * empties.length)]
  const next = [...board]
  next[at] = { id: uid(), tier }
  return next
}

function canMerge(board: Cell[]) {
  const counts = new Map<number, number>()
  for (const cell of board) {
    if (!cell) continue
    counts.set(cell.tier, (counts.get(cell.tier) ?? 0) + 1)
  }
  for (const n of counts.values()) {
    if (n >= 2) return true
  }
  return false
}

function loadBest() {
  const raw = localStorage.getItem(BEST_KEY)
  const n = raw ? Number(raw) : 0
  return Number.isFinite(n) ? n : 0
}

export default function MergeGame() {
  const [board, setBoard] = useState<Cell[]>(() => {
    let b = emptyBoard()
    for (let i = 0; i < 6; i++) b = spawnOn(b) ?? b
    return b
  })
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => loadBest())
  const [flash, setFlash] = useState<number | null>(null)
  const [message, setMessage] = useState('Tap two matching emojis to merge.')

  const filled = board.filter(Boolean).length
  const stuck = filled === SIZE && !canMerge(board)
  const maxTier = useMemo(() => {
    let m = -1
    for (const c of board) if (c && c.tier > m) m = c.tier
    return m
  }, [board])

  useEffect(() => {
    if (score > best) {
      setBest(score)
      localStorage.setItem(BEST_KEY, String(score))
    }
  }, [score, best])

  const reset = useCallback(() => {
    let b = emptyBoard()
    for (let i = 0; i < 6; i++) b = spawnOn(b) ?? b
    setBoard(b)
    setSelected(null)
    setScore(0)
    setFlash(null)
    setMessage('Tap two matching emojis to merge.')
  }, [])

  function drop() {
    if (stuck) return
    const next = spawnOn(board)
    if (!next) {
      setMessage('Board full — merge something first.')
      return
    }
    setBoard(next)
    setSelected(null)
    setMessage('New item dropped.')
  }

  function tap(index: number) {
    if (stuck) return
    const cell = board[index]
    if (!cell) {
      setSelected(null)
      return
    }

    if (selected == null) {
      setSelected(index)
      setMessage(`Selected ${chain[cell.tier]} — tap a match.`)
      return
    }

    if (selected === index) {
      setSelected(null)
      setMessage('Deselected.')
      return
    }

    const a = board[selected]
    const b = board[index]
    if (!a || !b || a.tier !== b.tier) {
      setSelected(index)
      setMessage(`Selected ${chain[cell.tier]} — tap a match.`)
      return
    }

    // Merge into the second cell
    const next = [...board]
    next[selected] = null
    if (a.tier >= chain.length - 1) {
      // Max tier: both clear for big points
      next[index] = null
      const gained = (a.tier + 1) * 50
      setScore((s) => s + gained)
      setMessage(`Max merge! +${gained}`)
    } else {
      const newTier = a.tier + 1
      next[index] = { id: uid(), tier: newTier }
      const gained = (newTier + 1) * 10
      setScore((s) => s + gained)
      setFlash(index)
      setMessage(`Merged → ${chain[newTier]} · +${gained}`)
      window.setTimeout(() => setFlash(null), 380)
      // Soft drop a new low item after merge if space
      const after = spawnOn(next, randomLowTier())
      setBoard(after ?? next)
      setSelected(null)
      return
    }

    setBoard(next)
    setSelected(null)
  }

  return (
    <div className="merge-game">
      <div className="merge-chain" aria-label="Merge chain">
        {chain.map((emoji, i) => (
          <span key={emoji} className={`merge-chain-item${i <= maxTier ? ' is-unlocked' : ''}`}>
            <span aria-hidden>{emoji}</span>
            {i < chain.length - 1 && <span className="merge-chain-arrow">›</span>}
          </span>
        ))}
      </div>

      <div className="memory-head">
        <p className="meta" style={{ margin: 0 }}>
          {stuck
            ? `Board stuck · score ${score}${best ? ` · best ${best}` : ''}`
            : `Score ${score} · best ${best} · ${filled}/${SIZE} filled`}
        </p>
        <div className="todo-add" style={{ marginTop: 0 }}>
          <button className="btn" type="button" onClick={drop} disabled={stuck || filled === SIZE}>
            Drop item
          </button>
          <button className="btn ghost" type="button" onClick={reset}>
            New game
          </button>
        </div>
      </div>
      <p className="meta merge-hint">{message}</p>

      <div
        className="merge-board"
        role="grid"
        aria-label="Emoji merge board"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
      >
        {board.map((cell, i) => (
          <button
            key={cell?.id ?? `empty-${i}`}
            type="button"
            role="gridcell"
            className={`merge-cell${cell ? '' : ' is-empty'}${selected === i ? ' is-selected' : ''}${flash === i ? ' is-flash' : ''}`}
            onClick={() => tap(i)}
            disabled={stuck && !cell}
            aria-label={cell ? `Tier ${cell.tier + 1} ${chain[cell.tier]}` : 'Empty'}
          >
            {cell ? chain[cell.tier] : ''}
          </button>
        ))}
      </div>

      {stuck && (
        <p className="meta" style={{ marginTop: 12 }}>
          No moves left. Hit New game for another round.
        </p>
      )}
    </div>
  )
}
