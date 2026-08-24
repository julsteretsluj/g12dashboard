import { events } from '../data/school'

function inMonth(date: string, year: number, month: number) {
  const [y, m] = date.split('-').map(Number)
  return y === year && m === month + 1
}

export default function MiniCalendar() {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const first = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startPad = (first + 6) % 7
  const cells = [...Array(startPad).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  const monthEvents = events.filter((e) => inMonth(e.date, year, month) || (e.end && inMonth(e.end, year, month)))
  const eventDays = new Set(
    monthEvents.flatMap((e) => {
      const start = Number(e.date.slice(-2))
      const finish = e.end && inMonth(e.end, year, month) ? Number(e.end.slice(-2)) : start
      return Array.from({ length: finish - start + 1 }, (_, i) => start + i)
    }),
  )
  const upcoming = events.filter((e) => e.date >= today.toISOString().slice(0, 10)).slice(0, 5)

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
        {upcoming.map((e) => (
          <li key={e.date + e.title}>
            <time>{e.end ? `${e.date.slice(5)}–${e.end.slice(5)}` : e.date.slice(5)}</time>
            {e.title}
          </li>
        ))}
      </ul>
    </>
  )
}
