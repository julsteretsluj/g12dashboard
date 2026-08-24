import TimetableGrid from '../components/TimetableGrid'

export default function TimetablePage() {
  return (
    <>
      <p className="kicker">Koh Pich bells</p>
      <h2 style={{ marginTop: 0, fontSize: 36, letterSpacing: '-0.04em' }}>Timetable</h2>
      <p className="lede" style={{ color: 'var(--muted)', maxWidth: '52ch' }}>
        This is the whole load: homeroom, Bio 30 (504), Social 30-1 (208),
        lunch 11:25–12:10, CTS in the makerspace, Visual Arts in 310. Monday
        order is fixed; other days rotate the same four courses.
      </p>
      <section className="card wide" style={{ marginTop: 20 }}>
        <TimetableGrid />
      </section>
    </>
  )
}
