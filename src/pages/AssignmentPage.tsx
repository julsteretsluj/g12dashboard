import { Link, useNavigate, useParams } from 'react-router-dom'
import { classes } from '../data/school'
import { useWorkspace } from '../lib/useWorkspace'
import DocShelf from '../components/DocShelf'
import DateField from '../components/DateField'
import NoteList from '../components/NoteList'
import { blankNote, newId, taskNotes } from '../lib/workspace'

export default function AssignmentPage() {
  const { id, unitId, taskId } = useParams()
  const course = classes.find((c) => c.id === id)
  const { ws, update } = useWorkspace(id)
  const nav = useNavigate()
  const unit = ws.units.find((u) => u.id === unitId)
  const task = ws.tasks.find((t) => t.id === taskId)

  if (!course || !unit || !task || !id || !unitId) {
    return (
      <p>
        Missing assignment. <Link to={`/class/${id ?? ''}`}>Back</Link>
      </p>
    )
  }

  const current = task

  function patch(patch: Partial<typeof current>) {
    update({
      ...ws,
      tasks: ws.tasks.map((t) => (t.id === current.id ? { ...t, ...patch } : t)),
    })
  }

  return (
    <>
      <p className="crumbs">
        <Link to={`/class/${id}`}>{course.short}</Link>
        {' / '}
        <Link to={`/class/${id}/unit/${unitId}`}>{unit.name}</Link>
        <span> / {task.title || 'Assignment'}</span>
      </p>
      <header className="page-head">
        <div>
          <p className="kicker">Assignment</p>
          <h2 style={{ margin: 0, fontSize: 32, letterSpacing: '-0.04em' }}>{task.title || 'Untitled'}</h2>
        </div>
        <Link className="btn ghost" to={`/class/${id}/unit/${unitId}`}>
          Back to unit
        </Link>
      </header>

      <section className="card">
        <div className="todo-add">
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => patch({ done: !task.done })}
          />
          <input
            className="note-box"
            value={task.title}
            onChange={(e) => patch({ title: e.target.value })}
            placeholder="Title"
          />
        </div>
        <DateField label="Due" value={task.due} onChange={(due) => patch({ due })} />
        <textarea
          className="note-box"
          rows={4}
          placeholder="What this assignment is…"
          value={task.note}
          onChange={(e) => patch({ note: e.target.value })}
          style={{ marginTop: 10 }}
        />
        <h3 style={{ marginTop: 18 }}>Notes</h3>
        <NoteList
          notes={taskNotes(ws.notes, task.id)}
          hrefFor={(noteId) => `/class/${id}/unit/${unitId}/task/${task.id}/note/${noteId}`}
          onCreate={(title) => {
            const noteId = newId()
            update({
              ...ws,
              notes: [
                ...ws.notes,
                blankNote({ id: noteId, title, unitId, taskId: task.id }),
              ],
            })
            nav(`/class/${id}/unit/${unitId}/task/${task.id}/note/${noteId}`)
          }}
          empty="Notes for this assignment."
        />
        <h3 style={{ marginTop: 18 }}>Documents & embeds</h3>
        <DocShelf
          items={task.attachments}
          onChange={(attachments) => patch({ attachments })}
          addLabel="Task"
        />
        <h3 style={{ marginTop: 18 }}>Submissions</h3>
        <DocShelf
          items={task.submissions}
          onChange={(submissions) => patch({ submissions })}
          addLabel="Submission"
        />
        <button
          className="btn ghost"
          type="button"
          style={{ marginTop: 16 }}
          onClick={() => {
            update({
              ...ws,
              tasks: ws.tasks.filter((t) => t.id !== task.id),
              notes: ws.notes.filter((n) => n.taskId !== task.id),
            })
            nav(`/class/${id}/unit/${unitId}`)
          }}
        >
          Delete assignment
        </button>
      </section>
    </>
  )
}
