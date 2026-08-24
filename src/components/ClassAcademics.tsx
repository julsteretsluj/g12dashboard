import { useState, type FormEvent } from 'react'
import {
  newId,
  pct,
  schoolAverage,
  type TestItem,
  type UnitItem,
  type Workspace,
} from '../lib/workspace'

const kinds: TestItem['kind'][] = ['quiz', 'test', 'lab', 'project', 'diploma']
const statuses: UnitItem['status'][] = ['upcoming', 'current', 'done']

export default function ClassAcademics({
  ws,
  update,
}: {
  ws: Workspace
  update: (next: Workspace) => void
}) {
  const [unitName, setUnitName] = useState('')
  const [testName, setTestName] = useState('')
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
        { id: newId(), name: unitName.trim(), status: 'upcoming', focus: '' },
      ],
    })
    setUnitName('')
  }

  function addTest(e: FormEvent) {
    e.preventDefault()
    if (!testName.trim()) return
    update({
      ...ws,
      tests: [
        ...ws.tests,
        {
          id: newId(),
          name: testName.trim(),
          kind: 'test',
          date: '',
          score: '',
          outOf: '100',
          unitId: '',
        },
      ],
    })
    setTestName('')
  }

  function patchTest(id: string, patch: Partial<TestItem>) {
    update({ ...ws, tests: ws.tests.map((t) => (t.id === id ? { ...t, ...patch } : t)) })
  }

  function patchUnit(id: string, patch: Partial<UnitItem>) {
    update({ ...ws, units: ws.units.map((u) => (u.id === id ? { ...u, ...patch } : u)) })
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

      <div className="two" style={{ marginBottom: 16 }}>
        <section className="card">
          <h3>Units</h3>
          <p className="meta">Mark where you are in the course — current, upcoming, or done.</p>
          {ws.units.length === 0 && <p className="meta">No units yet.</p>}
          {ws.units.map((u) => (
            <article key={u.id} className="assignment">
              <div className="todo-add">
                <input
                  className="note-box"
                  value={u.name}
                  onChange={(e) => patchUnit(u.id, { name: e.target.value })}
                  placeholder="Unit name"
                />
                <select
                  className="note-box"
                  value={u.status}
                  onChange={(e) => patchUnit(u.id, { status: e.target.value as UnitItem['status'] })}
                  style={{ maxWidth: 140 }}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                className="note-box"
                rows={2}
                placeholder="Big ideas, labs, pages to finish…"
                value={u.focus}
                onChange={(e) => patchUnit(u.id, { focus: e.target.value })}
              />
              <button
                className="btn ghost"
                type="button"
                style={{ marginTop: 8 }}
                onClick={() => update({ ...ws, units: ws.units.filter((x) => x.id !== u.id) })}
              >
                Delete unit
              </button>
            </article>
          ))}
          <form className="todo-add" onSubmit={addUnit}>
            <input value={unitName} onChange={(e) => setUnitName(e.target.value)} placeholder="Add a unit" />
            <button className="btn" type="submit">
              Add
            </button>
          </form>
        </section>

        <section className="card">
          <h3>Tests & scores</h3>
          <p className="meta">Quizzes, labs, projects, diploma practice. Leave score blank until it’s back.</p>
          {ws.tests.length === 0 && <p className="meta">No assessments yet.</p>}
          {ws.tests.map((t) => {
            const p = pct(t.score, t.outOf)
            return (
              <article key={t.id} className="assignment">
                <div className="todo-add">
                  <input
                    className="note-box"
                    value={t.name}
                    onChange={(e) => patchTest(t.id, { name: e.target.value })}
                    placeholder="Name"
                  />
                  <select
                    className="note-box"
                    value={t.kind}
                    onChange={(e) => patchTest(t.id, { kind: e.target.value as TestItem['kind'] })}
                    style={{ maxWidth: 120 }}
                  >
                    {kinds.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="todo-add">
                  <input
                    className="note-box"
                    value={t.date}
                    onChange={(e) => patchTest(t.id, { date: e.target.value })}
                    placeholder="Date"
                    style={{ maxWidth: 140 }}
                  />
                  <select
                    className="note-box"
                    value={t.unitId}
                    onChange={(e) => patchTest(t.id, { unitId: e.target.value })}
                  >
                    <option value="">No unit</option>
                    {ws.units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                  <input
                    className="note-box"
                    value={t.score}
                    onChange={(e) => patchTest(t.id, { score: e.target.value })}
                    placeholder="Score"
                    style={{ maxWidth: 80 }}
                  />
                  <span className="meta">/</span>
                  <input
                    className="note-box"
                    value={t.outOf}
                    onChange={(e) => patchTest(t.id, { outOf: e.target.value })}
                    placeholder="Out of"
                    style={{ maxWidth: 80 }}
                  />
                  <span className="pill">{p != null ? `${p.toFixed(0)}%` : '—'}</span>
                </div>
                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => update({ ...ws, tests: ws.tests.filter((x) => x.id !== t.id) })}
                >
                  Delete
                </button>
              </article>
            )
          })}
          <form className="todo-add" onSubmit={addTest}>
            <input value={testName} onChange={(e) => setTestName(e.target.value)} placeholder="Add a test or quiz" />
            <button className="btn" type="submit">
              Add
            </button>
          </form>
        </section>
      </div>

      <div className="two" style={{ marginBottom: 16 }}>
        <section className="card">
          <h3>Diploma watch</h3>
          <p className="meta">
            Alberta 30-level courses blend school-awarded mark with the diploma exam. Set the split
            you were told (often 70 / 30).
          </p>
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
          <p className="meta">Dump the bits that refuse to stick. Check them off when they land.</p>
          {ws.reviews.map((r) => (
            <label key={r.id} className={`todo-row ${r.done ? 'done' : ''}`}>
              <input
                type="checkbox"
                checked={r.done}
                onChange={() =>
                  update({
                    ...ws,
                    reviews: ws.reviews.map((x) => (x.id === r.id ? { ...x, done: !x.done } : x)),
                  })
                }
              />
              <span>{r.text}</span>
              <button
                className="btn ghost"
                type="button"
                onClick={() => update({ ...ws, reviews: ws.reviews.filter((x) => x.id !== r.id) })}
              >
                Delete
              </button>
            </label>
          ))}
          <form
            className="todo-add"
            onSubmit={(e) => {
              e.preventDefault()
              if (!review.trim()) return
              update({
                ...ws,
                reviews: [...ws.reviews, { id: newId(), text: review.trim(), done: false }],
              })
              setReview('')
            }}
          >
            <input
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="e.g. dihybrid ratios, Cold War orthodox view…"
            />
            <button className="btn" type="submit">
              Add
            </button>
          </form>
        </section>
      </div>
    </>
  )
}
