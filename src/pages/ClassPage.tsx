import { Link, useParams } from 'react-router-dom'
import { classes } from '../data/school'
import { useEffect, useState, type FormEvent } from 'react'
import DocShelf from '../components/DocShelf'
import {
  loadWorkspace,
  newId,
  saveWorkspace,
  type TaskItem,
  type Workspace,
} from '../lib/workspace'
import ClassAcademics from '../components/ClassAcademics'

export default function ClassPage() {
  const { id } = useParams()
  const course = classes.find((c) => c.id === id)
  const [ws, setWs] = useState<Workspace>(() => loadWorkspace(id ?? ''))
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDue, setTaskDue] = useState('')
  const [noteTitle, setNoteTitle] = useState('')
  const [noteBody, setNoteBody] = useState('')

  useEffect(() => {
    if (!id) return
    localStorage.removeItem(`cis-notes-${id}`)
    setWs(loadWorkspace(id))
  }, [id])

  function update(next: Workspace) {
    if (!id) return
    setWs(next)
    saveWorkspace(id, next)
  }

  if (!course) {
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

      {course.id !== 'homeroom' && <ClassAcademics ws={ws} update={update} />}

      <section className="card" style={{ marginBottom: 16 }}>
        <h3>Tasks</h3>
        <p className="meta" style={{ marginBottom: 12 }}>
          Attach briefings and links on the task. Drop finished work under submissions.
        </p>
        {ws.tasks.length === 0 && <p className="meta">No tasks yet — add one below.</p>}
        {ws.tasks.map((task) => (
          <article key={task.id} className="assignment">
            <div className="todo-add" style={{ marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => patchTask(task.id, { done: !task.done })}
                aria-label={task.title}
              />
              <input
                className="note-box"
                value={task.title}
                onChange={(e) => patchTask(task.id, { title: e.target.value })}
                placeholder="Task title"
              />
              <input
                className="note-box"
                value={task.due}
                onChange={(e) => patchTask(task.id, { due: e.target.value })}
                placeholder="Due"
                style={{ maxWidth: 120 }}
              />
            </div>
            <textarea
              className="note-box"
              rows={2}
              placeholder="What this task is…"
              value={task.note}
              onChange={(e) => patchTask(task.id, { note: e.target.value })}
            />
            <h4 style={{ marginTop: 12 }}>Task documents & embeds</h4>
            <DocShelf
              items={task.attachments}
              onChange={(attachments) => patchTask(task.id, { attachments })}
              addLabel="Task"
            />
            <h4 style={{ marginTop: 14 }}>Submissions</h4>
            <DocShelf
              items={task.submissions}
              onChange={(submissions) => patchTask(task.id, { submissions })}
              addLabel="Submission"
            />
            <button
              className="btn ghost"
              type="button"
              style={{ marginTop: 10 }}
              onClick={() => update({ ...ws, tasks: ws.tasks.filter((t) => t.id !== task.id) })}
            >
              Delete task
            </button>
          </article>
        ))}
        <form className="todo-add" onSubmit={addTask} style={{ marginTop: 12 }}>
          <input
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="New task"
          />
          <input
            value={taskDue}
            onChange={(e) => setTaskDue(e.target.value)}
            placeholder="Due (e.g. Fri)"
            style={{ maxWidth: 140 }}
          />
          <button className="btn" type="submit">
            Add task
          </button>
        </form>
      </section>

      <div className="two">
        <section className="card">
          <h3>Class library</h3>
          <p className="meta" style={{ marginBottom: 10 }}>
            Handouts, slides, Drive folders, videos — stored on this device for {course.short}.
          </p>
          <DocShelf
            items={ws.library}
            onChange={(library) => update({ ...ws, library })}
            addLabel="Library"
          />
        </section>
        <section className="card">
          <h3>Notes</h3>
          {ws.notes.length === 0 && <p className="meta">Notes are empty.</p>}
          <div className="notes-grid">
            {ws.notes.map((n) => (
              <div className="sticky" key={n.id}>
                <h4>{n.title}</h4>
                <p>{n.body}</p>
                <button
                  className="btn ghost"
                  type="button"
                  style={{ marginTop: 8 }}
                  onClick={() => update({ ...ws, notes: ws.notes.filter((x) => x.id !== n.id) })}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!noteTitle.trim() && !noteBody.trim()) return
              update({
                ...ws,
                notes: [
                  ...ws.notes,
                  { id: newId(), title: noteTitle.trim() || 'Note', body: noteBody.trim() },
                ],
              })
              setNoteTitle('')
              setNoteBody('')
            }}
            style={{ marginTop: 12 }}
          >
            <input
              className="note-box"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Note title"
              style={{ width: '100%', marginBottom: 8 }}
            />
            <textarea
              className="note-box"
              rows={4}
              value={noteBody}
              onChange={(e) => setNoteBody(e.target.value)}
              placeholder="Write a new note…"
            />
            <button className="btn" type="submit" style={{ marginTop: 8 }}>
              Add note
            </button>
          </form>
        </section>
      </div>
    </>
  )
}
