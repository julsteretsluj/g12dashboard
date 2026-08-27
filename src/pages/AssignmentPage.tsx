import { Link, useNavigate, useParams } from 'react-router-dom'
import { classes } from '../data/school'
import { useWorkspace } from '../lib/useWorkspace'
import DocShelf from '../components/DocShelf'
import DateField from '../components/DateField'
import NoteList from '../components/NoteList'
import EmojiPick from '../components/EmojiPick'
import Subtasks from '../components/Subtasks'
import { blankNote, blankTask, childTasks, dropTaskTree, newId, taskNotes } from '../lib/workspace'

export default function AssignmentPage() {
  const { id, unitId, taskId } = useParams()
  const course = classes.find((c) => c.id === id)
  const { ws, update } = useWorkspace(id)
  const nav = useNavigate()
  const unit = ws.units.find((u) => u.id === unitId)
  const task = ws.tasks.find((t) => t.id === taskId)
  const parent = task?.parentId ? ws.tasks.find((t) => t.id === task.parentId) : undefined
  const steps = task ? childTasks(ws.tasks, task.id) : []

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
        {parent && (
          <>
            {' / '}
            <Link to={`/class/${id}/unit/${unitId}/task/${parent.id}`}>{parent.title || 'Assignment'}</Link>
          </>
        )}
        <span> / {task.emoji ? `${task.emoji} ` : ''}{task.title || (parent ? 'Sub-task' : 'Assignment')}</span>
      </p>
      <header className="page-head">
        <div className="page-head-title">
          <EmojiPick
            value={task.emoji}
            fallback="📌"
            onChange={(emoji) => patch({ emoji })}
            label="Assignment emoji"
          />
          <div>
            <p className="kicker">{parent ? 'Sub-task' : 'Assignment'}</p>
            <h2 style={{ margin: 0, fontSize: 32, letterSpacing: '-0.04em' }}>{task.title || 'Untitled'}</h2>
          </div>
        </div>
        <Link
          className="btn ghost"
          to={parent ? `/class/${id}/unit/${unitId}/task/${parent.id}` : `/class/${id}/unit/${unitId}`}
        >
          {parent ? 'Back to assignment' : 'Back to unit'}
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
        <DateField label="Due" value={task.due} onChange={(due) => patch({ due })} classId={id} />
        <textarea
          className="note-box"
          rows={4}
          placeholder="What this assignment is…"
          value={task.note}
          onChange={(e) => patch({ note: e.target.value })}
          style={{ marginTop: 10 }}
        />
        <Subtasks
          items={steps}
          classId={id}
          hrefFor={(stepId) => `/class/${id}/unit/${unitId}/task/${stepId}`}
          onAdd={(title, due) =>
            update({
              ...ws,
              tasks: [
                ...ws.tasks,
                blankTask({
                  id: newId(),
                  title,
                  due,
                  unitId,
                  parentId: task.id,
                }),
              ],
            })
          }
          onToggle={(stepId, done) =>
            update({
              ...ws,
              tasks: ws.tasks.map((t) => (t.id === stepId ? { ...t, done } : t)),
            })
          }
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
            const parentId = parent?.id
            update(dropTaskTree(ws, task.id))
            nav(parentId ? `/class/${id}/unit/${unitId}/task/${parentId}` : `/class/${id}/unit/${unitId}`)
          }}
        >
          {parent ? 'Delete sub-task' : 'Delete assignment'}
        </button>
      </section>
    </>
  )
}
