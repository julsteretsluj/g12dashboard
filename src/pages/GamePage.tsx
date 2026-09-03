import MemoryGame from '../components/MemoryGame'
import MergeGame from '../components/MergeGame'
import SudokuGame from '../components/SudokuGame'

export default function GamePage() {
  return (
    <>
      <p className="kicker">Desk break</p>
      <h2 style={{ marginTop: 0, fontSize: 36, letterSpacing: '-0.04em' }}>Games</h2>
      <p className="meta" style={{ maxWidth: '54ch', marginBottom: 8 }}>
        Memory, merge, and sudoku — quick breaks between blocks.
      </p>

      <section className="card" style={{ marginTop: 20 }}>
        <h3>Emoji merge</h3>
        <p className="meta" style={{ marginTop: 0 }}>
          Gossip Harbor–style: tap two of the same emoji to fuse the next one up the chain. Drop
          items when you need more pieces.
        </p>
        <MergeGame />
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <h3>Emoji memory</h3>
        <p className="meta" style={{ marginTop: 0 }}>
          Pick a level — more pairs on Expert. Match emojis from your desk and a few extras.
        </p>
        <MemoryGame />
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <h3>Sudoku</h3>
        <p className="meta" style={{ marginTop: 0 }}>
          Classic 9×9 — tap a cell, then pick a number from the keypad.
        </p>
        <SudokuGame />
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <h3>Emoji sudoku</h3>
        <p className="meta" style={{ marginTop: 0 }}>
          Same rules — digits 1–9 are desk emojis instead of numbers.
        </p>
        <SudokuGame emoji title="Emoji sudoku" />
      </section>
    </>
  )
}
