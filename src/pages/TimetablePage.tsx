import TimetableGrid from '../components/TimetableGrid'

export default function TimetablePage() {
  return (
    <>
      <p className="kicker">Koh Pich bells</p>
      <h2 style={{ marginTop: 0, fontSize: 36, letterSpacing: '-0.04em' }}>Timetable</h2>
      <p className="lede" style={{ color: 'var(--muted)', maxWidth: '52ch' }}>
        A sample senior timetable — tap a block to open the class page. Flex
        periods are for IA drafts, library wandering, or staring at the river.
      </p>
      <section className="card wide" style={{ marginTop: 20 }}>
        <TimetableGrid />
      </section>
    </>
  )
}
