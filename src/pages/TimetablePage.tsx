import TimetableGrid from '../components/TimetableGrid'
import NextBell from '../components/NextBell'
import { useEffect, useState } from 'react'

export default function TimetablePage() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      <p className="kicker">Week 35 · Semester 1 · MH cycle</p>
      <h2 style={{ marginTop: 0, fontSize: 36, letterSpacing: '-0.04em' }}>Timetable</h2>
      <p className="lede" style={{ color: 'var(--muted)', maxWidth: '56ch' }}>
        From Jules’s school timetable. Homeroom 8:00–8:30, Bio with Brost,
        Social with Biggar, lunch, CTS with Cooper on Days 1 and 4 only, Art
        with Maloney until 15:00. Mon–Fri maps to Days 1–5 this week.
      </p>
      <section className="card" style={{ marginTop: 16, marginBottom: 12 }}>
        <NextBell now={now} />
      </section>
      <section className="card wide" style={{ marginTop: 8 }}>
        <TimetableGrid />
      </section>
    </>
  )
}
