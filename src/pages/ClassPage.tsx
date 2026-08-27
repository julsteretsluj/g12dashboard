import { Link, useNavigate, useParams } from 'react-router-dom'
import { classes } from '../data/school'
import { type FormEvent, useState } from 'react'
import DocShelf from '../components/DocShelf'
import { blankNote, blankTask, classNotes, dropTaskTree, newId, taskNotes, type TaskItem } from '../lib/workspace'
import { useWorkspace } from '../lib/useWorkspace'
import ClassAcademics from '../components/ClassAcademics'
import DateField from '../components/DateField'
import NoteList from '../components/NoteList'
import EmojiPick from '../components/EmojiPick'
import TaskTagPick from '../components/TaskTagPick'
import { subjectEmoji } from '../lib/emoji'

export default function ClassPage() {
  const { id } = useParams()
  const course = classes.find((c) => c.id === id)
  const { ws, update } = useWorkspace(id)
  const nav = useNavigate()
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDue, setTaskDue] = useState('')
  const [taskTag, setTaskTag] = useState<'homework' | 'classwork'>('homework')

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
    const task: TaskItem = blankTask({
      id: newId(),
      title: taskTitle.trim(),
      due: taskDue.trim(),
      tag: taskTag,
    })
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

  const loose = ws.tasks.filter((t) => !t.unitId && !t.parentId)

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

      <section className="card" style={{ marginBottom: 16 }}>
        <h3>Assignments</h3>
        <p className="meta" style={{ marginTop: 0 }}>
          Tag each item as homework or class work. Dated homework also shows in Work center and gets the
          24-hour email.
        </p>
        {loose.length === 0 && <p className="meta">Nothing here yet.</p>}
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
                onClick={() => update(dropTaskTree(ws, task.id))}
              >
                Delete
              </button>
            </div>
            <div style={{ marginTop: 10 }}>
              <TaskTagPick value={task.tag} onChange={(tag) => patchTask(task.id, { tag })} />
            </div>
            <div style={{ marginTop: 10 }}>
              <DateField
                label="Due"
                value={task.due}
                onChange={(due) => patchTask(task.id, { due })}
                classId={id}
              />
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
          <TaskTagPick value={taskTag} onChange={setTaskTag} />
          <div className="todo-add" style={{ marginTop: 10 }}>
            <input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder={taskTag === 'classwork' ? 'New class work' : 'New homework'}
            />
            <button className="btn" type="submit">
              Add
            </button>
          </div>
          <DateField label="Due" value={taskDue} onChange={setTaskDue} classId={id} />
        </form>
      </section>

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
