import MemoryGame from '../components/MemoryGame'

export default function GamePage() {
  return (
    <>
      <p className="kicker">Desk break</p>
      <h2 style={{ marginTop: 0, fontSize: 36, letterSpacing: '-0.04em' }}>Games</h2>
      <p className="meta" style={{ maxWidth: '54ch', marginBottom: 8 }}>
        A quick match between classes — flip two cards and find the emoji pairs.
      </p>

      <section className="card" style={{ marginTop: 20 }}>
        <h3>Emoji memory</h3>
        <p className="meta" style={{ marginTop: 0 }}>
          Pick a level — more pairs on Expert. Match emojis from your desk and a few extras.
        </p>
        <MemoryGame />
      </section>
    </>
  )
}
