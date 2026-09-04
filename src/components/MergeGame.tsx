import { useCallback, useEffect, useMemo, useState } from 'react'

/**
 * Branching merge graph — different starter paths converge on the same
 * mid/high items (shared value). Two matching emojis merge to mergesTo.
 */
type ItemDef = {
  id: string
  emoji: string
  name: string
  value: number
  mergesTo?: string
  spawn?: boolean
  path: string
}

const items: ItemDef[] = [
  { id: 'pencil', emoji: '✏️', name: 'Pencil', value: 1, mergesTo: 'note', spawn: true, path: 'Study' },
  { id: 'note', emoji: '📝', name: 'Notes', value: 2, mergesTo: 'books', path: 'Study' },
  { id: 'books', emoji: '📚', name: 'Books', value: 4, mergesTo: 'bag', path: 'Study' },
  { id: 'flask', emoji: '🧪', name: 'Flask', value: 1, mergesTo: 'scope', spawn: true, path: 'Lab' },
  { id: 'scope', emoji: '🔬', name: 'Microscope', value: 2, mergesTo: 'dna', path: 'Lab' },
  { id: 'dna', emoji: '🧬', name: 'DNA', value: 4, mergesTo: 'bag', path: 'Lab' },
  { id: 'brush', emoji: '🖌️', name: 'Brush', value: 1, mergesTo: 'palette', spawn: true, path: 'Art' },
  { id: 'palette', emoji: '🎨', name: 'Palette', value: 2, mergesTo: 'frame', path: 'Art' },
  { id: 'frame', emoji: '🖼️', name: 'Frame', value: 4, mergesTo: 'leaf', path: 'Art' },
  { id: 'pin', emoji: '📍', name: 'Pin', value: 1, mergesTo: 'map', spawn: true, path: 'Map' },
  { id: 'map', emoji: '🗺️', name: 'Map', value: 2, mergesTo: 'compass', path: 'Map' },
  { id: 'compass', emoji: '🧭', name: 'Compass', value: 4, mergesTo: 'leaf', path: 'Map' },
  { id: 'apple', emoji: '🍎', name: 'Apple', value: 1, mergesTo: 'juice', spawn: true, path: 'Snack' },
  { id: 'juice', emoji: '🧃', name: 'Juice', value: 2, mergesTo: 'snack', path: 'Snack' },
  { id: 'snack', emoji: '🍪', name: 'Snack', value: 4, mergesTo: 'bear', path: 'Snack' },
  { id: 'bag', emoji: '🎒', name: 'Backpack', value: 8, mergesTo: 'bear', path: 'Campus' },
  { id: 'leaf', emoji: '🍁', name: 'Maple', value: 8, mergesTo: 'bear', path: 'Campus' },
  { id: 'bear', emoji: '🐻', name: 'Bear', value: 16, mergesTo: 'trophy', path: 'Campus' },
  { id: 'trophy', emoji: '🏆', name: 'Trophy', value: 32, mergesTo: 'crown', path: 'Campus' },
  { id: 'crown', emoji: '👑', name: 'Crown', value: 64, mergesTo: 'star', path: 'Campus' },
  { id: 'star', emoji: '⭐', name: 'Star', value: 100, path: 'Campus' },
]

const byId = Object.fromEntries(items.map((i) => [i.id, i])) as Record<string, ItemDef>
const spawnPool = items.filter((i) => i.spawn).map((i) => i.id)

const pathways = [
  { name: 'Study', ids: ['pencil', 'note', 'books', 'bag'], note: '→ same 🎒' },
  { name: 'Lab', ids: ['flask', 'scope', 'dna', 'bag'], note: '→ same 🎒' },
  { name: 'Art', ids: ['brush', 'palette', 'frame', 'leaf'], note: '→ same 🍁' },
  { name: 'Map', ids: ['pin', 'map', 'compass', 'leaf'], note: '→ same 🍁' },
  { name: 'Snack', ids: ['apple', 'juice', 'snack', 'bear'], note: '→ 🐻' },
  { name: 'Campus', ids: ['bag', 'leaf', 'bear', 'trophy', 'crown', 'star'], note: 'late game' },
]

const COLS = 6
const ROWS = 5
const SIZE = COLS * ROWS
const BEST_KEY = 'cis-merge-best'
const TASK_SLOTS = 3

type Cell = { id: string; itemId: string } | null

type Task = {
  id: string
  itemId: string
  need: number
  have: number
  reward: number
}

function uid() {
  return crypto.randomUUID()
}

function emptyBoard(): Cell[] {
  return Array.from({ length: SIZE }, () => null)
}

function randomSpawnId() {
  return spawnPool[Math.floor(Math.random() * spawnPool.length)]
}

function spawnOn(board: Cell[], itemId = randomSpawnId()): Cell[] | null {
  const empties = board.map((c, i) => (c ? -1 : i)).filter((i) => i >= 0)
  if (!empties.length) return null
  const at = empties[Math.floor(Math.random() * empties.length)]
  const next = [...board]
  next[at] = { id: uid(), itemId }
  return next
}

function canMerge(board: Cell[]) {
  const counts = new Map<string, number>()
  for (const cell of board) {
    if (!cell) continue
    if (!byId[cell.itemId]?.mergesTo) continue
    counts.set(cell.itemId, (counts.get(cell.itemId) ?? 0) + 1)
  }
  return [...counts.values()].some((n) => n >= 2)
}

function loadBest() {
  const raw = localStorage.getItem(BEST_KEY)
  const n = raw ? Number(raw) : 0
  return Number.isFinite(n) ? n : 0
}

function makeTask(): Task {
  const roll = Math.random()
  let pool: ItemDef[]
  let need: number
  if (roll < 0.42) {
    pool = items.filter((i) => i.spawn)
    need = 10 + Math.floor(Math.random() * 16) // 10–25
  } else if (roll < 0.72) {
    pool = items.filter((i) => i.value >= 2 && i.value <= 4)
    need = 3 + Math.floor(Math.random() * 6) // 3–8
  } else if (roll < 0.9) {
    pool = items.filter((i) => i.value === 8 || i.value === 16)
    need = 1 + Math.floor(Math.random() * 2) // 1–2
  } else {
    pool = items.filter((i) => i.value >= 32)
    need = 1
  }
  const pick = pool[Math.floor(Math.random() * pool.length)] ?? items[0]
  return { id: uid(), itemId: pick.id, need, have: 0, reward: pick.value * need * 3 }
}

function seedTasks(): Task[] {
  return Array.from({ length: TASK_SLOTS }, () => makeTask())
}

/** Advance tasks for one produced/delivered item; replace finished ones. */
function advanceTasks(
  tasks: Task[],
  itemId: string,
): { tasks: Task[]; bonus: number; labels: string[] } {
  let bonus = 0
  const labels: string[] = []
  const next = tasks.map((t) => {
    if (t.itemId !== itemId || t.have >= t.need) return t
    const have = Math.min(t.need, t.have + 1)
    if (have >= t.need) {
      bonus += t.reward
      labels.push(byId[t.itemId].emoji)
      return makeTask()
    }
    return { ...t, have }
  })
  return { tasks: next, bonus, labels }
}

export default function MergeGame() {
  const [board, setBoard] = useState<Cell[]>(() => {
    let b = emptyBoard()
    for (let i = 0; i < 8; i++) b = spawnOn(b) ?? b
    return b
  })
  const [tasks, setTasks] = useState<Task[]>(() => seedTasks())
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => loadBest())
  const [tasksDone, setTasksDone] = useState(0)
  const [flash, setFlash] = useState<number | null>(null)
  const [message, setMessage] = useState(
    'Merge matches · tasks fill when you craft, drop, or deliver.',
  )

  const filled = board.filter(Boolean).length
  const stuck = filled === SIZE && !canMerge(board)

  const seen = useMemo(() => {
    const s = new Set<string>()
    for (const c of board) if (c) s.add(c.itemId)
    return s
  }, [board])

  useEffect(() => {
    if (score > best) {
      setBest(score)
      localStorage.setItem(BEST_KEY, String(score))
    }
  }, [score, best])

  const noteTaskProgress = useCallback((itemId: string, baseGain: number, craftMsg: string) => {
    setTasks((prev) => {
      const { tasks: next, bonus, labels } = advanceTasks(prev, itemId)
      setScore((s) => s + baseGain + bonus)
      if (labels.length) {
        setTasksDone((n) => n + labels.length)
        setMessage(`Task done ${labels.join(' ')} · +${baseGain + bonus}`)
      } else {
        setMessage(craftMsg)
      }
      return next
    })
  }, [])

  const reset = useCallback(() => {
    let b = emptyBoard()
    for (let i = 0; i < 8; i++) b = spawnOn(b) ?? b
    setBoard(b)
    setTasks(seedTasks())
    setSelected(null)
    setScore(0)
    setTasksDone(0)
    setFlash(null)
    setMessage('Merge matches · tasks fill when you craft, drop, or deliver.')
  }, [])

  function drop() {
    if (stuck) return
    const itemId = randomSpawnId()
    const next = spawnOn(board, itemId)
    if (!next) {
      setMessage('Board full — merge something first.')
      return
    }
    setBoard(next)
    setSelected(null)
    noteTaskProgress(itemId, 1, `Dropped ${byId[itemId].emoji}`)
  }

  function deliver(taskId: string) {
    const task = tasks.find((t) => t.id === taskId)
    if (!task || task.have >= task.need) return
    const idx = board.findIndex((c) => c?.itemId === task.itemId)
    if (idx < 0) {
      setMessage(`Put ${byId[task.itemId].emoji} on the board, then tap the task.`)
      return
    }
    const next = [...board]
    next[idx] = null
    setBoard(next)
    setSelected(null)
    noteTaskProgress(task.itemId, byId[task.itemId].value, `Delivered ${byId[task.itemId].emoji}`)
  }

  function tap(index: number) {
    if (stuck) return
    const cell = board[index]
    if (!cell) {
      setSelected(null)
      return
    }
    const def = byId[cell.itemId]

    if (selected == null) {
      setSelected(index)
      setMessage(`Selected ${def.emoji} ${def.name} — tap a match.`)
      return
    }

    if (selected === index) {
      setSelected(null)
      setMessage('Deselected.')
      return
    }

    const a = board[selected]
    const b = board[index]
    if (!a || !b || a.itemId !== b.itemId) {
      setSelected(index)
      setMessage(`Selected ${def.emoji} ${def.name} — tap a match.`)
      return
    }

    const src = byId[a.itemId]
    const next = [...board]
    next[selected] = null

    if (!src.mergesTo) {
      next[index] = null
      setBoard(next)
      setSelected(null)
      noteTaskProgress(src.id, src.value * 8, `Cleared max ${src.emoji}`)
      return
    }

    const result = byId[src.mergesTo]
    next[index] = { id: uid(), itemId: result.id }
    setFlash(index)
    window.setTimeout(() => setFlash(null), 380)
    const after = spawnOn(next, randomSpawnId())
    setBoard(after ?? next)
    setSelected(null)
    noteTaskProgress(
      result.id,
      result.value * 5,
      `Merged → ${result.emoji} ${result.name} · value ${result.value}`,
    )
  }

  return (
    <div className="merge-game">
      <div className="merge-paths" aria-label="Merge pathways">
        {pathways.map((p) => (
          <div key={p.name} className="merge-path-row">
            <span className="merge-path-label meta">{p.name}</span>
            <div className="merge-chain merge-chain-inline">
              {p.ids.map((id, i) => {
                const it = byId[id]
                return (
                  <span
                    key={`${p.name}-${id}-${i}`}
                    className={`merge-chain-item${seen.has(id) ? ' is-unlocked' : ''}`}
                    title={`${it.name} · value ${it.value}`}
                  >
                    <span aria-hidden>{it.emoji}</span>
                    {i < p.ids.length - 1 && <span className="merge-chain-arrow">›</span>}
                  </span>
                )
              })}
            </div>
            <span className="meta merge-path-note">{p.note}</span>
          </div>
        ))}
      </div>

      <div className="merge-tasks" aria-label="Orders">
        <p className="meta" style={{ margin: '0 0 8px' }}>
          Tasks · craft/drop counts · or tap a card to deliver from the board · {tasksDone} done
        </p>
        <div className="merge-task-grid">
          {tasks.map((t) => {
            const it = byId[t.itemId]
            const ready = board.some((c) => c?.itemId === t.itemId)
            const pct = Math.min(100, Math.round((t.have / t.need) * 100))
            return (
              <button
                key={t.id}
                type="button"
                className={`merge-task${ready ? ' is-ready' : ''}`}
                onClick={() => deliver(t.id)}
              >
                <span className="merge-task-emoji" aria-hidden>
                  {it.emoji}
                </span>
                <span className="merge-task-body">
                  <strong>
                    {t.have}/{t.need} {it.name}
                  </strong>
                  <span className="meta">
                    +{t.reward} pts · value {it.value}
                  </span>
                  <span className="merge-task-bar" aria-hidden>
                    <span style={{ width: `${pct}%` }} />
                  </span>
                </span>
              </button>
            )
          })}
        </div>
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
        {board.map((cell, i) => {
          const def = cell ? byId[cell.itemId] : null
          return (
            <button
              key={cell?.id ?? `empty-${i}`}
              type="button"
              role="gridcell"
              className={`merge-cell${cell ? '' : ' is-empty'}${selected === i ? ' is-selected' : ''}${flash === i ? ' is-flash' : ''}`}
              onClick={() => tap(i)}
              disabled={stuck && !cell}
              aria-label={def ? `${def.name} value ${def.value}` : 'Empty'}
            >
              {def?.emoji ?? ''}
            </button>
          )
        })}
      </div>

      {stuck && (
        <p className="meta" style={{ marginTop: 12 }}>
          No moves left. Hit New game for another round.
        </p>
      )}
    </div>
  )
}
