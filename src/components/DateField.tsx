import { useMemo, useState } from 'react'
import { classesOnIso, nextClassMeeting } from '../data/school'

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
  classId,
}: {
  value: string
  onChange: (next: string) => void
  label?: string
  classId?: string
}) {
  const picked = parseIso(value)
  const today = new Date()
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() =>
    picked ? { y: picked.y, m: picked.m } : { y: today.getFullYear(), m: today.getMonth() },
  )
  const [focusIso, setFocusIso] = useState(value || '')
  const nextClass = useMemo(() => (classId ? nextClassMeeting(classId) : null), [classId])
  const dayClasses = useMemo(() => (focusIso ? classesOnIso(focusIso) : []), [focusIso])

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

  function pickDate(iso: string) {
    onChange(iso)
    setFocusIso(iso)
    setOpen(false)
  }

  return (
    <div className={`date-field ${open ? 'is-open' : ''}`}>
      <div className="date-field-head">
        <button
          className="date-field-toggle"
          type="button"
          aria-expanded={open}
          onClick={() => {
            if (!open) {
              if (picked) setView({ y: picked.y, m: picked.m })
              setFocusIso(value || todayIso)
            }
            setOpen((v) => !v)
          }}
        >
          <span className="meta">{label}</span>
          <strong>{picked ? prettyDate(value) : 'Pick a date'}</strong>
        </button>
        {classId && nextClass && (
          <button
            className="btn ghost"
            type="button"
            onClick={() => pickDate(nextClass.iso)}
            title={`${nextClass.day} ${nextClass.start}–${nextClass.end}`}
          >
            Next class
          </button>
        )}
        {value && (
          <button
            className="btn ghost"
            type="button"
            onClick={() => {
              onChange('')
              setFocusIso('')
              setOpen(false)
            }}
          >
            Clear
          </button>
        )}
      </div>
      {classId && nextClass && value === nextClass.iso && (
        <p className="meta" style={{ margin: '6px 0 0' }}>
          Due next {nextClass.day} class · {nextClass.start}–{nextClass.end}
        </p>
      )}
      {open && (
        <>
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
              const isNext = nextClass?.iso === iso
              const isFocus = focusIso === iso
              const hasClasses = classesOnIso(iso).length > 0
              return (
                <button
                  key={i}
                  type="button"
                  className={`cal-cell date-day ${isPicked ? 'picked' : ''} ${isToday ? 'today' : ''} ${isNext ? 'next-class' : ''} ${isFocus ? 'is-focus' : ''} ${hasClasses ? 'has-class' : ''}`}
                  onClick={() => setFocusIso(iso)}
                >
                  {d}
                </button>
              )
            })}
          </div>

          <div className="date-day-classes">
            <p className="meta" style={{ margin: 0 }}>
              {focusIso
                ? `Classes on ${prettyDate(focusIso)} — tap one to set due`
                : 'Tap a day, then a class'}
            </p>
            {focusIso && dayClasses.length === 0 && (
              <p className="meta" style={{ margin: '6px 0 0' }}>
                No MH classes that day (weekend / blank).
              </p>
            )}
            {dayClasses.length > 0 && (
              <div className="date-class-chips">
                {dayClasses.map((c) => (
                  <button
                    key={`${c.id}-${c.period}`}
                    type="button"
                    className={`date-class-chip ${classId === c.id ? 'is-preferred' : ''}`}
                    style={{ borderLeftColor: c.color }}
                    onClick={() => pickDate(focusIso)}
                    title={`${c.day} ${c.start}–${c.end}`}
                  >
                    <span aria-hidden>{c.emoji}</span>
                    <span>
                      {c.short}
                      <small>
                        {c.start}–{c.end}
                      </small>
                    </span>
                  </button>
                ))}
              </div>
            )}
            {focusIso && (
              <button className="btn ghost" type="button" style={{ marginTop: 8 }} onClick={() => pickDate(focusIso)}>
                Use {prettyDate(focusIso)} only
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
