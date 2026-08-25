import { Link, useNavigate, useParams } from 'react-router-dom'
import { classes } from '../data/school'
import { type FormEvent, useState } from 'react'
import DocShelf from '../components/DocShelf'
import { blankNote, classNotes, newId, taskNotes, type TaskItem } from '../lib/workspace'
import { useWorkspace } from '../lib/useWorkspace'
import ClassAcademics from '../components/ClassAcademics'
import DateField from '../components/DateField'
import NoteList from '../components/NoteList'
import EmojiPick from '../components/EmojiPick'
import { subjectEmoji } from '../lib/emoji'

export default function ClassPage() {
  const { id } = useParams()
  const course = classes.find((c) => c.id === id)
  const { ws, update } = useWorkspace(id)
  const nav = useNavigate()
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDue, setTaskDue] = useState('')

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
      emoji: '',
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
        <div className="page-head-title">
          <EmojiPick
            value={ws.classEmoji}
            fallback={course.emoji}
            onChange={(classEmoji) => update({ ...ws, classEmoji })}
            label="Class emoji"
          />
          <div>
            <p className="kicker">
              {subjectEmoji(course.id, ws.classEmoji)} {course.room}
            </p>
            <h2 style={{ margin: 0, fontSize: 36, letterSpacing: '-0.04em' }}>{course.name}</h2>
            <p className="meta" style={{ marginTop: 8 }}>
              {course.teacher} · {course.blurb}
            </p>
          </div>
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
                <EmojiPick
                  size="sm"
                  value={task.emoji}
                  fallback="📌"
                  onChange={(emoji) => patchTask(task.id, { emoji })}
                  label="Task emoji"
                />
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
                  onClick={() =>
                    update({
                      ...ws,
                      tasks: ws.tasks.filter((t) => t.id !== task.id),
                      notes: ws.notes.filter((n) => n.taskId !== task.id),
                    })
                  }
                >
                  Delete
                </button>
              </div>
              <div style={{ marginTop: 10 }}>
                <NoteList
                  notes={taskNotes(ws.notes, task.id)}
                  hrefFor={(noteId) => `/class/${id}/task/${task.id}/note/${noteId}`}
                  onCreate={(title) => {
                    const noteId = newId()
                    update({
                      ...ws,
                      notes: [...ws.notes, blankNote({ id: noteId, title, taskId: task.id })],
                    })
                    nav(`/class/${id}/task/${task.id}/note/${noteId}`)
                  }}
                  empty=""
                />
              </div>
            </article>
          ))}
          <form onSubmit={addTask} style={{ marginTop: 12 }}>
            <div className="todo-add">
              <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="New task" />
              <button className="btn" type="submit">
                Add
              </button>
            </div>
            <DateField label="Due" value={taskDue} onChange={setTaskDue} />
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
          <NoteList
            notes={classNotes(ws.notes)}
            hrefFor={(noteId) => `/class/${id}/note/${noteId}`}
            onCreate={(title) => {
              const noteId = newId()
              update({
                ...ws,
                notes: [...ws.notes, blankNote({ id: noteId, title })],
              })
              nav(`/class/${id}/note/${noteId}`)
            }}
            empty="Notes are empty."
          />
        </section>
      </div>
    </>
  )
}
