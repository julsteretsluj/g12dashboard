import { Link, useNavigate, useParams } from 'react-router-dom'
import { classes } from '../data/school'
import { useWorkspace } from '../lib/useWorkspace'
import { newId, pct } from '../lib/workspace'
import { useState, type FormEvent } from 'react'

export default function UnitPage() {
  const { id, unitId } = useParams()
  const course = classes.find((c) => c.id === id)
  const { ws, update } = useWorkspace(id)
  const nav = useNavigate()
  const unit = ws.units.find((u) => u.id === unitId)
  const [taskTitle, setTaskTitle] = useState('')
  const [testName, setTestName] = useState('')
  const [noteTitle, setNoteTitle] = useState('')
  const tasks = ws.tasks.filter((t) => t.unitId === unitId)
  const tests = ws.tests.filter((t) => t.unitId === unitId)
  const notes = ws.notes.filter((n) => n.unitId === unitId)

  if (!course || !id) {
    return (
      <p>
        No class here. <Link to="/">Home</Link>
      </p>
    )
  }
  if (!unit || !unitId) {
    return (
      <p>
        No unit here. <Link to={`/class/${id}`}>Back to {course.short}</Link>
      </p>
    )
  }

  function addTask(e: FormEvent) {
    e.preventDefault()
    if (!taskTitle.trim() || !unitId) return
    const taskId = newId()
    update({
      ...ws,
      tasks: [
        ...ws.tasks,
        {
          id: taskId,
          title: taskTitle.trim(),
          due: '',
          note: '',
          done: false,
          unitId,
          attachments: [],
          submissions: [],
        },
      ],
    })
    setTaskTitle('')
    nav(`/class/${id}/unit/${unitId}/task/${taskId}`)
  }

  function addTest(e: FormEvent) {
    e.preventDefault()
    if (!testName.trim() || !unitId) return
    const testId = newId()
    update({
      ...ws,
      tests: [
        ...ws.tests,
        {
          id: testId,
          name: testName.trim(),
          kind: 'test',
          date: '',
          score: '',
          outOf: '100',
          unitId,
        },
      ],
    })
    setTestName('')
    nav(`/class/${id}/unit/${unitId}/test/${testId}`)
  }

  return (
    <>
      <p className="crumbs">
        <Link to={`/class/${id}`}>{course.short}</Link>
        <span> / {unit.name}</span>
      </p>
      <header className="page-head">
        <div>
          <p className="kicker">{unit.status}</p>
          <h2 style={{ margin: 0, fontSize: 36, letterSpacing: '-0.04em' }}>{unit.name}</h2>
        </div>
        <Link className="btn ghost" to={`/class/${id}`}>
          All units
        </Link>
      </header>

      <section className="card" style={{ marginBottom: 16 }}>
        <h3>Unit notes</h3>
        <select
          className="note-box"
          value={unit.status}
          onChange={(e) =>
            update({
              ...ws,
              units: ws.units.map((u) =>
                u.id === unit.id ? { ...u, status: e.target.value as typeof unit.status } : u,
              ),
            })
          }
          style={{ maxWidth: 180, marginBottom: 8 }}
        >
          <option value="upcoming">upcoming</option>
          <option value="current">current</option>
          <option value="done">done</option>
        </select>
        <textarea
          className="note-box"
          rows={3}
          placeholder="Big ideas, labs, pages…"
          value={unit.focus}
          onChange={(e) =>
            update({
              ...ws,
              units: ws.units.map((u) => (u.id === unit.id ? { ...u, focus: e.target.value } : u)),
            })
          }
        />
      </section>

      <div className="two">
        <section className="card">
          <h3>Assignments</h3>
          {tasks.length === 0 && <p className="meta">None yet.</p>}
          {tasks.map((t) => (
            <Link key={t.id} className="class-tile" to={`/class/${id}/unit/${unitId}/task/${t.id}`} style={{ marginBottom: 8 }}>
              <h4>{t.title || 'Untitled'}</h4>
              <p>{t.done ? 'Settled' : t.due ? `Due ${t.due}` : 'Open'}</p>
            </Link>
          ))}
          <form className="todo-add" onSubmit={addTask} style={{ marginTop: 12 }}>
            <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="New assignment" />
            <button className="btn" type="submit">
              Add
            </button>
          </form>
        </section>
        <section className="card">
          <h3>Tests</h3>
          {tests.length === 0 && <p className="meta">None yet.</p>}
          {tests.map((t) => {
            const p = pct(t.score, t.outOf)
            return (
              <Link key={t.id} className="class-tile" to={`/class/${id}/unit/${unitId}/test/${t.id}`} style={{ marginBottom: 8 }}>
                <h4>{t.name || 'Untitled'}</h4>
                <p>
                  {t.kind}
                  {t.date ? ` · ${t.date}` : ''}
                  {p != null ? ` · ${p.toFixed(0)}%` : ''}
                </p>
              </Link>
            )
          })}
          <form className="todo-add" onSubmit={addTest} style={{ marginTop: 12 }}>
            <input value={testName} onChange={(e) => setTestName(e.target.value)} placeholder="New test or quiz" />
            <button className="btn" type="submit">
              Add
            </button>
          </form>
        </section>
      </div>

      <section className="card" style={{ marginTop: 16 }}>
        <h3>Notes</h3>
        {notes.length === 0 && <p className="meta">No notes in this unit.</p>}
        <div className="notes-grid">
          {notes.map((n) => (
            <Link key={n.id} className="sticky sticky-link" to={`/class/${id}/unit/${unitId}/note/${n.id}`}>
              <h4>{n.title || 'Untitled'}</h4>
              <p>{n.body.slice(0, 120) || 'Empty'}</p>
            </Link>
          ))}
        </div>
        <form
          className="todo-add"
          style={{ marginTop: 12 }}
          onSubmit={(e) => {
            e.preventDefault()
            if (!noteTitle.trim() || !unitId) return
            const noteId = newId()
            update({
              ...ws,
              notes: [...ws.notes, { id: noteId, title: noteTitle.trim(), body: '', unitId }],
            })
            setNoteTitle('')
            nav(`/class/${id}/unit/${unitId}/note/${noteId}`)
          }}
        >
          <input value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder="New note" />
          <button className="btn" type="submit">
            Add
          </button>
        </form>
      </section>

      <button
        className="btn ghost"
        type="button"
        style={{ marginTop: 16 }}
        onClick={() => {
          update({
            ...ws,
            units: ws.units.filter((u) => u.id !== unit.id),
            tasks: ws.tasks.filter((t) => t.unitId !== unit.id),
            notes: ws.notes.filter((n) => n.unitId !== unit.id),
          })
          nav(`/class/${id}`)
        }}
      >
        Delete this unit
      </button>
    </>
  )
}
