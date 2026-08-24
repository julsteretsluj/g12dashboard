import { Link, useParams } from 'react-router-dom'
import { classes } from '../data/school'
import { useEffect, useState } from 'react'

export default function ClassPage() {
  const { id } = useParams()
  const course = classes.find((c) => c.id === id)
  const storageKey = `cis-notes-${id}`
  const [scratch, setScratch] = useState('')

  useEffect(() => {
    setScratch(localStorage.getItem(storageKey) ?? '')
  }, [storageKey])

  if (!course) {
    return (
      <p>
        No class here. <Link to="/">Home</Link>
      </p>
    )
  }

  return (
    <>
      <header className="page-head">
        <div>
          <p className="kicker">{course.emoji} {course.room}</p>
          <h2 style={{ margin: 0, fontSize: 36, letterSpacing: '-0.04em' }}>{course.name}</h2>
          <p className="meta" style={{ marginTop: 8 }}>
            {course.teacher} · {course.blurb}
          </p>
        </div>
        <Link className="btn ghost" to="/">
          Back to desk
        </Link>
      </header>

      <div className="two">
        <section className="card">
          <h3>Assignments</h3>
          {course.assignments.map((a) => (
            <article key={a.title} className="assignment">
              <div className="due">{a.done ? 'Settled' : `Due ${a.due}`}</div>
              <h4>{a.title}</h4>
              <p>{a.note}</p>
            </article>
          ))}
        </section>
        <section className="card">
          <h3>Notes</h3>
          <div className="notes-grid">
            {course.notes.map((n) => (
              <div className="sticky" key={n.title}>
                <h4>{n.title}</h4>
                <p>{n.body}</p>
              </div>
            ))}
          </div>
          <h3 style={{ marginTop: 18 }}>Scratch pad</h3>
          <textarea
            className="note-box"
            rows={6}
            value={scratch}
            onChange={(e) => {
              setScratch(e.target.value)
              localStorage.setItem(storageKey, e.target.value)
            }}
            placeholder="Dump the thought before the bell…"
          />
        </section>
      </div>

      <section className="card" style={{ marginTop: 16 }}>
        <h3>Resources & little portals</h3>
        <div className="tz">
          {course.resources.map((r) => (
            <a key={r.href} className="pill" href={r.href} target="_blank" rel="noreferrer">
              {r.label}
            </a>
          ))}
        </div>
        {course.id === 'math' && (
          <iframe
            className="embed tall"
            style={{ marginTop: 14, minHeight: 360 }}
            title="Desmos"
            src="https://www.desmos.com/calculator"
          />
        )}
        {course.id === 'bio' && (
          <iframe
            className="embed tall"
            style={{ marginTop: 14 }}
            title="Cells"
            src="https://en.wikipedia.org/wiki/Cell_(biology)"
          />
        )}
        {course.id === 'social' && (
          <iframe
            className="embed tall"
            style={{ marginTop: 14 }}
            title="Liberalism"
            src="https://en.wikipedia.org/wiki/Liberalism"
          />
        )}
        {course.id === 'cts' && (
          <iframe
            className="embed tall"
            style={{ marginTop: 14, minHeight: 360 }}
            title="Tinkercad"
            src="https://www.tinkercad.com/"
          />
        )}
        {course.id === 'art' && (
          <iframe
            className="embed tall"
            style={{ marginTop: 14 }}
            title="Met collection"
            src="https://www.metmuseum.org/art/collection"
          />
        )}
      </section>
    </>
  )
}
