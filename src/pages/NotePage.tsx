import { Link, useNavigate, useParams } from 'react-router-dom'
import { classes } from '../data/school'
import { useWorkspace } from '../lib/useWorkspace'
import type { NoteItem } from '../lib/workspace'
import EmojiPick from '../components/EmojiPick'

export default function NotePage() {
  const { id, unitId, taskId, testId, noteId } = useParams()
  const course = classes.find((c) => c.id === id)
  const { ws, update } = useWorkspace(id)
  const nav = useNavigate()
  const note = ws.notes.find((n) => n.id === noteId)
  const unit = (unitId || note?.unitId) ? ws.units.find((u) => u.id === (unitId || note?.unitId)) : undefined
  const task = (taskId || note?.taskId) ? ws.tasks.find((t) => t.id === (taskId || note?.taskId)) : undefined
  const test = (testId || note?.testId) ? ws.tests.find((t) => t.id === (testId || note?.testId)) : undefined

  const back = (() => {
    if (!id) return '/'
    if (task && unit) return `/class/${id}/unit/${unit.id}/task/${task.id}`
    if (test && unit) return `/class/${id}/unit/${unit.id}/test/${test.id}`
    if (task) return `/class/${id}`
    if (unit) return `/class/${id}/unit/${unit.id}`
    return `/class/${id}`
  })()

  if (!course || !note || !id) {
    return (
      <p>
        Missing note. <Link to={`/class/${id ?? ''}`}>Back</Link>
      </p>
    )
  }

  const current = note

  function patch(next: Partial<NoteItem>) {
    update({
      ...ws,
      notes: ws.notes.map((n) => (n.id === current.id ? { ...n, ...next } : n)),
    })
  }

  return (
    <>
      <p className="crumbs">
        <Link to={`/class/${id}`}>{course.short}</Link>
        {unit && (
          <>
            {' / '}
            <Link to={`/class/${id}/unit/${unit.id}`}>{unit.name}</Link>
          </>
        )}
        {task && unit && (
          <>
            {' / '}
            <Link to={`/class/${id}/unit/${unit.id}/task/${task.id}`}>{task.title || 'Assignment'}</Link>
          </>
        )}
        {task && !unit && <span> / {task.title || 'Task'}</span>}
        {test && unit && (
          <>
            {' / '}
            <Link to={`/class/${id}/unit/${unit.id}/test/${test.id}`}>{test.name || 'Test'}</Link>
          </>
        )}
        <span> / {current.emoji ? `${current.emoji} ` : ''}{current.title || 'Note'}</span>
      </p>
      <header className="page-head">
        <div className="page-head-title">
          <EmojiPick
            value={current.emoji}
            fallback="🗒️"
            onChange={(emoji) => patch({ emoji })}
            label="Note emoji"
          />
          <div>
            <p className="kicker">Note</p>
            <h2 style={{ margin: 0, fontSize: 32, letterSpacing: '-0.04em' }}>{current.title || 'Untitled'}</h2>
          </div>
        </div>
        <Link className="btn ghost" to={back}>
          Close
        </Link>
      </header>

      <section className="card note-sheet">
        <input
          className="note-title-input"
          value={current.title}
          onChange={(e) => patch({ title: e.target.value })}
          placeholder="Title"
        />
        <textarea
          className="note-body-input"
          value={current.body}
          onChange={(e) => patch({ body: e.target.value })}
          placeholder="Write here…"
          rows={16}
        />
        <button
          className="btn ghost"
          type="button"
          style={{ marginTop: 12 }}
          onClick={() => {
            update({ ...ws, notes: ws.notes.filter((n) => n.id !== current.id) })
            nav(back)
          }}
        >
          Delete note
        </button>
      </section>
    </>
  )
}
