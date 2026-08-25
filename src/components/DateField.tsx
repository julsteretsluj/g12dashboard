import { useMemo, useState } from 'react'

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function isoDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function prettyDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const d = new Date(`${value}T12:00:00`)
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function parseIso(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [y, m, d] = value.split('-').map(Number)
  return { y, m: m - 1, d }
}

export default function DateField({
  value,
  onChange,
  label = 'Date',
}: {
  value: string
  onChange: (next: string) => void
  label?: string
}) {
  const picked = parseIso(value)
  const today = new Date()
  const [view, setView] = useState(() =>
    picked ? { y: picked.y, m: picked.m } : { y: today.getFullYear(), m: today.getMonth() },
  )

  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1).getDay()
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
    const startPad = (first + 6) % 7
    return [...Array(startPad).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  }, [view])

  const todayIso = isoDate(today.getFullYear(), today.getMonth(), today.getDate())

  function shift(delta: number) {
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1)
      return { y: d.getFullYear(), m: d.getMonth() }
    })
  }

  return (
    <div className="date-field">
      <div className="date-field-head">
        <span className="meta">{label}</span>
        <strong>{picked ? prettyDate(value) : 'No date'}</strong>
        {value && (
          <button className="btn ghost" type="button" onClick={() => onChange('')}>
            Clear
          </button>
        )}
      </div>
      <div className="date-field-nav">
        <button className="btn ghost" type="button" onClick={() => shift(-1)} aria-label="Previous month">
          ‹
        </button>
        <span>
          {months[view.m]} {view.y}
        </span>
        <button className="btn ghost" type="button" onClick={() => shift(1)} aria-label="Next month">
          ›
        </button>
      </div>
      <div className="cal-grid date-cal">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div className="dow" key={i}>
            {d}
          </div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="cal-cell empty-day" />
          const iso = isoDate(view.y, view.m, d)
          const isPicked = value === iso
          const isToday = iso === todayIso
          return (
            <button
              key={i}
              type="button"
              className={`cal-cell date-day ${isPicked ? 'picked' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => onChange(iso)}
            >
              {d}
            </button>
          )
        })}
      </div>
    </div>
  )
}
