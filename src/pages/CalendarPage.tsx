import MiniCalendar from '../components/MiniCalendar'
import { events } from '../data/school'

export default function CalendarPage() {
  return (
    <>
      <p className="kicker">2026–27 official calendar · updated 17 June 2026</p>
      <h2 style={{ marginTop: 0, fontSize: 36, letterSpacing: '-0.04em' }}>What’s coming</h2>
      <p className="meta" style={{ maxWidth: '54ch', marginBottom: 8 }}>
        From CIS External Calendar V5. School may change dates; parents are informed. Offices
        open Saturdays 8:30–11:30 a.m.
      </p>
      <div className="two" style={{ marginTop: 20 }}>
        <section className="card">
          <h3>This month</h3>
          <MiniCalendar />
        </section>
        <section className="card">
          <h3>Full year</h3>
          <ul className="event-list">
            {events.map((e) => (
              <li key={e.date + e.title}>
                <time>{e.end ? `${e.date} – ${e.end}` : e.date}</time>
                <span>
                  {e.title}
                  <div className="meta">{e.tag}</div>
                </span>
              </li>
            ))}
          </ul>
          <h3 style={{ marginTop: 20 }}>Official PDF</h3>
          <iframe
            className="embed tall"
            title="CIS 2026–27 calendar"
            src="https://drive.google.com/file/d/1ACfVQUHFN8P8W3zbWNVLCjfjUkQHTdXn/preview"
          />
        </section>
      </div>
    </>
  )
}
