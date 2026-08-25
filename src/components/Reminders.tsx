import { useState } from 'react'
import { phnomPenhIso } from '../lib/dueMail'

const checks = [
  {
    id: 'classroom' as const,
    title: 'Check Google Classroom',
    hint: 'New work, comments, and anything that did not make the desk yet.',
    href: 'https://classroom.google.com/',
  },
  {
    id: 'gmail' as const,
    title: 'Check Gmail',
    hint: 'Teachers, CIS, and the stuff that only lives in the inbox.',
    href: 'https://mail.google.com/mail/u/0/#inbox',
  },
  {
    id: 'isams' as const,
    title: 'Check iSAMS',
    hint: 'Attendance, reports, and the official student portal.',
    href: 'https://cisp.students.isams.cloud/#/',
  },
]

type CheckId = (typeof checks)[number]['id']

type Saved = { day: string; done: Partial<Record<CheckId, boolean>> }

function load(day: string): Saved {
  try {
    const raw = localStorage.getItem('cis-remind-v1')
    if (!raw) return { day, done: {} }
    const parsed = JSON.parse(raw) as Saved
    if (parsed.day !== day) return { day, done: {} }
    return { day, done: parsed.done ?? {} }
  } catch {
    return { day, done: {} }
  }
}

export default function Reminders() {
  const day = phnomPenhIso()
  const [saved, setSaved] = useState(() => load(day))
  const done = saved.day === day ? saved.done : {}
  const n = checks.filter((c) => done[c.id]).length

  function toggle(id: CheckId) {
    const next: Saved = { day, done: { ...done, [id]: !done[id] } }
    localStorage.setItem('cis-remind-v1', JSON.stringify(next))
    setSaved(next)
  }

  return (
    <section className="card span-12">
      <h3>Reminders</h3>
      <p className="meta">
        {n === checks.length
          ? 'All three checked for today in Phnom Penh.'
          : `${n} / ${checks.length} checked today · resets at midnight here.`}
      </p>
      <div className="remind-list">
        {checks.map((item) => (
          <div key={item.id} className={`remind-row ${done[item.id] ? 'is-done' : ''}`}>
            <input
              type="checkbox"
              checked={Boolean(done[item.id])}
              onChange={() => toggle(item.id)}
              aria-label={item.title}
            />
            <div>
              <strong>{item.title}</strong>
              <p>{item.hint}</p>
            </div>
            <a className="btn ghost" href={item.href} target="_blank" rel="noreferrer">
              Open
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
