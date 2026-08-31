import { Link, useNavigate, useParams } from 'react-router-dom'
import { classes } from '../data/school'
import { useWorkspace } from '../lib/useWorkspace'
import { buildMoveTargets, moveDoc, type NoteItem } from '../lib/workspace'
import EmojiPick from '../components/EmojiPick'
import DateField from '../components/DateField'
import NoteEditor from '../components/NoteEditor'
import DocShelf from '../components/DocShelf'
import NotePractice from '../components/NotePractice'
import { deleteBlob } from '../lib/files'

export default function NotePage() {
  const { id, unitId, taskId, testId, noteId } = useParams()
  const course = classes.find((c) => c.id === id)
  const { ws, update } = useWorkspace(id)
  const nav = useNavigate()
  const note = ws.notes.find((n) => n.id === noteId)
  const unit = (unitId || note?.unitId) ? ws.units.find((u) => u.id === (unitId || note?.unitId)) : undefined
  const task = (taskId || note?.taskId) ? ws.tasks.find((t) => t.id === (taskId || note?.taskId)) : undefined
  const parentTask = task?.parentId ? ws.tasks.find((t) => t.id === task.parentId) : undefined
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
        {parentTask && unit && (
          <>
            {' / '}
            <Link to={`/class/${id}/unit/${unit.id}/task/${parentTask.id}`}>{parentTask.title || 'Assignment'}</Link>
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
            <p className="kicker">{current.topic.trim() || 'Note'}</p>
            <h2 style={{ margin: 0, fontSize: 32, letterSpacing: '-0.04em' }}>{current.title || 'Untitled'}</h2>
          </div>
        </div>
        <Link className="btn ghost" to={back}>
          Back
        </Link>
      </header>

      <section className="card">
        <label className="field">
          <span className="meta">Title</span>
          <input
            className="note-box field-control"
            value={current.title}
            onChange={(e) => patch({ title: e.target.value })}
            placeholder="Title"
          />
        </label>
        <DateField label="Date" value={current.date} onChange={(date) => patch({ date })} />
        <label className="field">
          <span className="meta">Topic</span>
          <input
            className="note-box field-control"
            value={current.topic}
            onChange={(e) => patch({ topic: e.target.value })}
            placeholder="Lecture, lab, chapter…"
          />
        </label>
        <div className="field">
          <span className="meta">Notes</span>
          <NoteEditor key={current.id} html={current.body} onChange={(body) => patch({ body })} />
        </div>
        <NotePractice classId={id} note={current} onPatch={patch} />
        <div className="field" style={{ marginTop: 18 }}>
          <span className="meta">Documents & links</span>
          <DocShelf
            items={current.attachments}
            onChange={(attachments) => patch({ attachments })}
            addLabel="Note"
            moveTargets={buildMoveTargets(ws, { scope: 'note', noteId: current.id })}
            onMove={(item, to) => update(moveDoc(ws, item, { scope: 'note', noteId: current.id }, to))}
          />
        </div>
        <button
          className="btn ghost"
          type="button"
          style={{ marginTop: 12 }}
          onClick={() => {
            void Promise.all(
              current.attachments.map((item) => (item.fileId ? deleteBlob(item.fileId) : Promise.resolve())),
            )
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
