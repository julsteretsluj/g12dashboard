import { Link, useNavigate, useParams } from 'react-router-dom'
import { classes } from '../data/school'
import { useWorkspace } from '../lib/useWorkspace'
import { pct, type TestItem } from '../lib/workspace'

const kinds: TestItem['kind'][] = ['quiz', 'test', 'lab', 'project', 'diploma']

export default function TestPage() {
  const { id, unitId, testId } = useParams()
  const course = classes.find((c) => c.id === id)
  const { ws, update } = useWorkspace(id)
  const nav = useNavigate()
  const unit = ws.units.find((u) => u.id === unitId)
  const test = ws.tests.find((t) => t.id === testId)
  const p = test ? pct(test.score, test.outOf) : null

  if (!course || !unit || !test || !id || !unitId) {
    return (
      <p>
        Missing test. <Link to={`/class/${id ?? ''}`}>Back</Link>
      </p>
    )
  }

  const current = test

  function patch(next: Partial<TestItem>) {
    update({
      ...ws,
      tests: ws.tests.map((t) => (t.id === current.id ? { ...t, ...next } : t)),
    })
  }

  return (
    <>
      <p className="crumbs">
        <Link to={`/class/${id}`}>{course.short}</Link>
        {' / '}
        <Link to={`/class/${id}/unit/${unitId}`}>{unit.name}</Link>
        <span> / {test.name || 'Test'}</span>
      </p>
      <header className="page-head">
        <div>
          <p className="kicker">{test.kind}</p>
          <h2 style={{ margin: 0, fontSize: 32, letterSpacing: '-0.04em' }}>{test.name || 'Untitled'}</h2>
        </div>
        <Link className="btn ghost" to={`/class/${id}/unit/${unitId}`}>
          Back to unit
        </Link>
      </header>

      <section className="card">
        <div className="todo-add">
          <input
            className="note-box"
            value={test.name}
            onChange={(e) => patch({ name: e.target.value })}
            placeholder="Name"
          />
          <select
            className="note-box"
            value={test.kind}
            onChange={(e) => patch({ kind: e.target.value as TestItem['kind'] })}
            style={{ maxWidth: 140 }}
          >
            {kinds.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
        <div className="todo-add" style={{ marginTop: 10 }}>
          <input
            className="note-box"
            value={test.date}
            onChange={(e) => patch({ date: e.target.value })}
            placeholder="Date"
            style={{ maxWidth: 160 }}
          />
          <input
            className="note-box"
            value={test.score}
            onChange={(e) => patch({ score: e.target.value })}
            placeholder="Score"
            style={{ maxWidth: 100 }}
          />
          <span className="meta">/</span>
          <input
            className="note-box"
            value={test.outOf}
            onChange={(e) => patch({ outOf: e.target.value })}
            placeholder="Out of"
            style={{ maxWidth: 100 }}
          />
          <span className="pill">{p != null ? `${p.toFixed(1)}%` : 'No score yet'}</span>
        </div>
        <button
          className="btn ghost"
          type="button"
          style={{ marginTop: 16 }}
          onClick={() => {
            update({ ...ws, tests: ws.tests.filter((t) => t.id !== test.id) })
            nav(`/class/${id}/unit/${unitId}`)
          }}
        >
          Delete test
        </button>
      </section>
    </>
  )
}
