import { Link } from 'react-router-dom'
import { useState, type FormEvent } from 'react'
import { newId, pct, schoolAverage, type Workspace } from '../lib/workspace'
import EmojiPick from './EmojiPick'

export default function ClassAcademics({
  classId,
  ws,
  update,
}: {
  classId: string
  ws: Workspace
  update: (next: Workspace) => void
}) {
  const [unitName, setUnitName] = useState('')
  const [review, setReview] = useState('')
  const avg = schoolAverage(ws.tests)
  const target = Number(ws.target) || 0
  const dip = pct(ws.diplomaScore, ws.diplomaOutOf)
  const schoolW = Math.min(100, Math.max(0, Number(ws.schoolWeight) || 70))
  const blend =
    avg != null && dip != null ? avg * (schoolW / 100) + dip * ((100 - schoolW) / 100) : null
  const gap = avg != null ? avg - target : null

  function addUnit(e: FormEvent) {
    e.preventDefault()
    if (!unitName.trim()) return
    update({
      ...ws,
      units: [
        ...ws.units,
        { id: newId(), name: unitName.trim(), status: 'upcoming', focus: '', emoji: '' },
      ],
    })
    setUnitName('')
  }

  return (
    <>
      <div className="stat-row">
        <div className="stat">
          <span className="meta">School average</span>
          <strong>{avg != null ? `${avg.toFixed(1)}%` : '—'}</strong>
        </div>
        <div className="stat">
          <span className="meta">Vs target {target || '—'}%</span>
          <strong style={{ color: gap == null ? undefined : gap >= 0 ? 'var(--palm)' : 'var(--red)' }}>
            {gap == null ? '—' : `${gap >= 0 ? '+' : ''}${gap.toFixed(1)}`}
          </strong>
        </div>
        <div className="stat">
          <span className="meta">Blended (school + diploma)</span>
          <strong>{blend != null ? `${blend.toFixed(1)}%` : 'Need both sides'}</strong>
        </div>
      </div>

      <section className="card" style={{ marginBottom: 16 }}>
        <h3>Units</h3>
        <p className="meta">Open a unit for its assignments and tests.</p>
        {ws.units.length === 0 && <p className="meta">No units yet.</p>}
        <div className="class-grid" style={{ marginTop: 12 }}>
          {ws.units.map((u) => {
            const tasks = ws.tasks.filter((t) => t.unitId === u.id).length
            const tests = ws.tests.filter((t) => t.unitId === u.id).length
            return (
              <Link
                key={u.id}
                className="class-tile"
                to={`/class/${classId}/unit/${u.id}`}
              >
                <h4>
                  {u.emoji ? `${u.emoji} ` : ''}
                  {u.name}
                </h4>
                <p>
                  {u.status} · {tasks} assignments · {tests} tests
                </p>
              </Link>
            )
          })}
        </div>
        <form className="todo-add" onSubmit={addUnit} style={{ marginTop: 14 }}>
          <input value={unitName} onChange={(e) => setUnitName(e.target.value)} placeholder="Add a unit" />
          <button className="btn" type="submit">
            Add unit
          </button>
        </form>
      </section>

      <div className="two" style={{ marginBottom: 16 }}>
        <section className="card">
          <h3>Diploma watch</h3>
          <p className="meta">School-awarded mark blended with the diploma exam (often 70 / 30).</p>
          <div className="todo-add">
            <label className="meta">
              Target %
              <input
                className="note-box"
                value={ws.target}
                onChange={(e) => update({ ...ws, target: e.target.value })}
                style={{ display: 'block', marginTop: 4 }}
              />
            </label>
            <label className="meta">
              School weight %
              <input
                className="note-box"
                value={ws.schoolWeight}
                onChange={(e) => update({ ...ws, schoolWeight: e.target.value })}
                style={{ display: 'block', marginTop: 4 }}
              />
            </label>
          </div>
          <div className="todo-add">
            <label className="meta">
              Diploma / practice score
              <input
                className="note-box"
                value={ws.diplomaScore}
                onChange={(e) => update({ ...ws, diplomaScore: e.target.value })}
                style={{ display: 'block', marginTop: 4 }}
              />
            </label>
            <label className="meta">
              Out of
              <input
                className="note-box"
                value={ws.diplomaOutOf}
                onChange={(e) => update({ ...ws, diplomaOutOf: e.target.value })}
                style={{ display: 'block', marginTop: 4 }}
              />
            </label>
          </div>
        </section>

        <section className="card">
          <h3>Still fuzzy</h3>
          {ws.reviews.map((r) => (
            <div key={r.id} className={`todo-row ${r.done ? 'done' : ''}`}>
              <EmojiPick
                size="sm"
                value={r.emoji}
                fallback="💭"
                onChange={(emoji) =>
                  update({
                    ...ws,
                    reviews: ws.reviews.map((x) => (x.id === r.id ? { ...x, emoji } : x)),
                  })
                }
                label="Idea emoji"
              />
              <input
                type="checkbox"
                checked={r.done}
                onChange={() =>
                  update({
                    ...ws,
                    reviews: ws.reviews.map((x) => (x.id === r.id ? { ...x, done: !x.done } : x)),
                  })
                }
                aria-label={r.text}
              />
              <span>{r.text}</span>
              <button
                className="btn ghost"
                type="button"
                onClick={() => update({ ...ws, reviews: ws.reviews.filter((x) => x.id !== r.id) })}
              >
                Delete
              </button>
            </div>
          ))}
          <form
            className="todo-add"
            onSubmit={(e) => {
              e.preventDefault()
              if (!review.trim()) return
              update({
                ...ws,
                reviews: [...ws.reviews, { id: newId(), text: review.trim(), done: false, emoji: '' }],
              })
              setReview('')
            }}
          >
            <input value={review} onChange={(e) => setReview(e.target.value)} placeholder="A sticky idea…" />
            <button className="btn" type="submit">
              Add
            </button>
          </form>
        </section>
      </div>
    </>
  )
}
