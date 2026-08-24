import MiniCalendar from '../components/MiniCalendar'
import { events } from '../data/school'

export default function CalendarPage() {
  return (
    <>
      <p className="kicker">Campus calendar</p>
      <h2 style={{ marginTop: 0, fontSize: 36, letterSpacing: '-0.04em' }}>What’s coming</h2>
      <div className="two" style={{ marginTop: 20 }}>
        <section className="card">
          <h3>This month</h3>
          <MiniCalendar />
        </section>
        <section className="card">
          <h3>Full list</h3>
          <ul className="event-list">
            {events.map((e) => (
              <li key={e.title}>
                <time>{e.date}</time>
                <span>
                  {e.title}
                  <div className="meta">{e.tag}</div>
                </span>
              </li>
            ))}
          </ul>
          <h3 style={{ marginTop: 20 }}>School calendar embed</h3>
          <iframe
            className="embed tall"
            title="CIS site"
            src="https://www.cisp.edu.kh/"
          />
        </section>
      </div>
    </>
  )
}
