import { Link, useNavigate, useParams } from 'react-router-dom'
import { classes } from '../data/school'
import { type FormEvent, useState } from 'react'
import DocShelf from '../components/DocShelf'
import { newId, type TaskItem } from '../lib/workspace'
import { useWorkspace } from '../lib/useWorkspace'
import ClassAcademics from '../components/ClassAcademics'

export default function ClassPage() {
  const { id } = useParams()
  const course = classes.find((c) => c.id === id)
  const { ws, update } = useWorkspace(id)
  const nav = useNavigate()
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDue, setTaskDue] = useState('')
  const [noteTitle, setNoteTitle] = useState('')

  if (!course || !id) {
    return (
      <p>
        No class here. <Link to="/">Home</Link>
      </p>
    )
  }

  function addTask(e: FormEvent) {
    e.preventDefault()
    if (!taskTitle.trim()) return
    const task: TaskItem = {
      id: newId(),
      title: taskTitle.trim(),
      due: taskDue.trim(),
      note: '',
      done: false,
      unitId: '',
      attachments: [],
      submissions: [],
    }
    update({ ...ws, tasks: [...ws.tasks, task] })
    setTaskTitle('')
    setTaskDue('')
  }

  function patchTask(taskId: string, patch: Partial<TaskItem>) {
    update({
      ...ws,
      tasks: ws.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)),
    })
  }

  const loose = ws.tasks.filter((t) => !t.unitId)

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

      {course.id !== 'homeroom' && <ClassAcademics classId={id} ws={ws} update={update} />}

      {course.id === 'homeroom' && (
        <section className="card" style={{ marginBottom: 16 }}>
          <h3>Tasks</h3>
          {loose.length === 0 && <p className="meta">No tasks yet.</p>}
          {loose.map((task) => (
            <article key={task.id} className="assignment">
              <div className="todo-add">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => patchTask(task.id, { done: !task.done })}
                />
                <input
                  className="note-box"
                  value={task.title}
                  onChange={(e) => patchTask(task.id, { title: e.target.value })}
                />
                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => update({ ...ws, tasks: ws.tasks.filter((t) => t.id !== task.id) })}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
          <form className="todo-add" onSubmit={addTask} style={{ marginTop: 12 }}>
            <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="New task" />
            <input
              value={taskDue}
              onChange={(e) => setTaskDue(e.target.value)}
              placeholder="Due"
              style={{ maxWidth: 140 }}
            />
            <button className="btn" type="submit">
              Add
            </button>
          </form>
        </section>
      )}

      <div className="two">
        <section className="card">
          <h3>Class library</h3>
          <DocShelf items={ws.library} onChange={(library) => update({ ...ws, library })} addLabel="Library" />
        </section>
        <section className="card">
          <h3>Notes</h3>
          {ws.notes.filter((n) => !n.unitId).length === 0 && <p className="meta">Notes are empty.</p>}
          <div className="notes-grid">
            {ws.notes
              .filter((n) => !n.unitId)
              .map((n) => (
                <Link key={n.id} className="sticky sticky-link" to={`/class/${id}/note/${n.id}`}>
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
              if (!noteTitle.trim()) return
              const noteId = newId()
              update({
                ...ws,
                notes: [...ws.notes, { id: noteId, title: noteTitle.trim(), body: '', unitId: '' }],
              })
              setNoteTitle('')
              nav(`/class/${id}/note/${noteId}`)
            }}
          >
            <input value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder="New note" />
            <button className="btn" type="submit">
              Add
            </button>
          </form>
        </section>
      </div>
    </>
  )
}
