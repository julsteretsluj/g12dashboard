import { events } from '../data/school'

export default function MiniCalendar() {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const first = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startPad = (first + 6) % 7
  const cells = [...Array(startPad).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  const eventDays = new Set(events.map((e) => Number(e.date.slice(-2))))

  return (
    <>
      <div className="cal-grid">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div className="dow" key={i}>
            {d}
          </div>
        ))}
        {cells.map((d, i) => (
          <div
            key={i}
            className={`cal-cell ${d === today.getDate() ? 'today' : ''} ${d && eventDays.has(d) ? 'event' : ''}`}
          >
            {d ?? ''}
          </div>
        ))}
      </div>
      <ul className="event-list">
        {events.slice(0, 4).map((e) => (
          <li key={e.date + e.title}>
            <time>{e.date.slice(5)}</time>
            {e.title}
          </li>
        ))}
      </ul>
    </>
  )
}
