import { useCallback, useEffect, useState } from 'react'

const emojiPool = [
  '🧬',
  '🗺️',
  '🛠️',
  '🎨',
  '🐻',
  '🍁',
  '📚',
  '✏️',
  '🧪',
  '📝',
  '🎯',
  '⏰',
] as const

export type MemoryLevel = 'easy' | 'medium' | 'hard' | 'expert'

const levels: Record<
  MemoryLevel,
  { label: string; pairs: number; cols: number; blurb: string }
> = {
  easy: { label: 'Easy', pairs: 4, cols: 4, blurb: '4 pairs · 2×4 grid' },
  medium: { label: 'Medium', pairs: 6, cols: 4, blurb: '6 pairs · 3×4 grid' },
  hard: { label: 'Hard', pairs: 8, cols: 4, blurb: '8 pairs · 4×4 grid' },
  expert: { label: 'Expert', pairs: 10, cols: 5, blurb: '10 pairs · 4×5 grid' },
}

type Card = {
  id: string
  emoji: string
  flipped: boolean
  matched: boolean
}

function buildDeck(level: MemoryLevel): Card[] {
  const { pairs } = levels[level]
  const picked = emojiPool.slice(0, pairs)
  const deck = [...picked, ...picked]
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck.map((emoji, i) => ({
    id: `${level}-${i}-${emoji}`,
    emoji,
    flipped: false,
    matched: false,
  }))
}

export default function MemoryGame() {
  const [level, setLevel] = useState<MemoryLevel>('medium')
  const [cards, setCards] = useState<Card[]>(() => buildDeck('medium'))
  const [moves, setMoves] = useState(0)
  const [locked, setLocked] = useState(false)
  const [won, setWon] = useState(false)

  const config = levels[level]
  const matched = cards.filter((c) => c.matched).length / 2
  const total = config.pairs

  const reset = useCallback((nextLevel: MemoryLevel = level) => {
    setCards(buildDeck(nextLevel))
    setMoves(0)
    setLocked(false)
    setWon(false)
  }, [level])

  function pickLevel(next: MemoryLevel) {
    setLevel(next)
    reset(next)
  }

  useEffect(() => {
    if (matched === total && moves > 0) setWon(true)
  }, [matched, moves, total])

  function flip(id: string) {
    if (locked || won) return
    const card = cards.find((c) => c.id === id)
    if (!card || card.flipped || card.matched) return

    const flipped = cards.filter((c) => c.flipped && !c.matched)
    if (flipped.length >= 2) return

    const next = cards.map((c) => (c.id === id ? { ...c, flipped: true } : c))
    setCards(next)

    const open = next.filter((c) => c.flipped && !c.matched)
    if (open.length < 2) return

    setLocked(true)
    setMoves((m) => m + 1)

    const [a, b] = open
    if (a.emoji === b.emoji) {
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) => (c.id === a.id || c.id === b.id ? { ...c, matched: true, flipped: true } : c)),
        )
        setLocked(false)
      }, 320)
    } else {
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) => (c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c)),
        )
        setLocked(false)
      }, 700)
    }
  }

  return (
    <div className="memory-game">
      <div className="memory-levels" role="tablist" aria-label="Difficulty">
        {(Object.keys(levels) as MemoryLevel[]).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={level === id}
            className={`btn ghost memory-level${level === id ? ' is-active' : ''}`}
            onClick={() => pickLevel(id)}
          >
            {levels[id].label}
          </button>
        ))}
      </div>
      <p className="meta memory-level-hint">{config.blurb}</p>

      <div className="memory-head">
        <p className="meta" style={{ margin: 0 }}>
          {won
            ? `${config.label} cleared in ${moves} moves — nice.`
            : `${matched} / ${total} pairs · ${moves} moves`}
        </p>
        <button className="btn ghost" type="button" onClick={() => reset()}>
          New game
        </button>
      </div>

      <div
        className={`memory-grid memory-grid-cols-${config.cols}`}
        role="grid"
        aria-label={`Memory card grid, ${config.label}`}
      >
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            className={`memory-card${card.flipped || card.matched ? ' is-flipped' : ''}${card.matched ? ' is-matched' : ''}`}
            onClick={() => flip(card.id)}
            disabled={locked || card.matched}
            aria-label={card.flipped || card.matched ? card.emoji : 'Hidden card'}
          >
            <span className="memory-card-inner">
              <span className="memory-card-face memory-card-back" aria-hidden>
                ?
              </span>
              <span className="memory-card-face memory-card-front" aria-hidden>
                {card.emoji}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
