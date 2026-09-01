import { useCallback, useEffect, useState } from 'react'

const deck = ['🧬', '🗺️', '🛠️', '🎨', '🐻', '🍁', '📚', '✏️'] as const

type Card = {
  id: string
  emoji: string
  flipped: boolean
  matched: boolean
}

function buildDeck(): Card[] {
  const pairs = [...deck, ...deck]
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pairs[i], pairs[j]] = [pairs[j], pairs[i]]
  }
  return pairs.map((emoji, i) => ({
    id: `${i}-${emoji}`,
    emoji,
    flipped: false,
    matched: false,
  }))
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>(() => buildDeck())
  const [moves, setMoves] = useState(0)
  const [locked, setLocked] = useState(false)
  const [won, setWon] = useState(false)

  const matched = cards.filter((c) => c.matched).length / 2
  const total = deck.length

  const reset = useCallback(() => {
    setCards(buildDeck())
    setMoves(0)
    setLocked(false)
    setWon(false)
  }, [])

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
      <div className="memory-head">
        <p className="meta" style={{ margin: 0 }}>
          {won
            ? `Matched in ${moves} moves — nice.`
            : `${matched} / ${total} pairs · ${moves} moves`}
        </p>
        <button className="btn ghost" type="button" onClick={reset}>
          New game
        </button>
      </div>

      <div className="memory-grid" role="grid" aria-label="Memory card grid">
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
