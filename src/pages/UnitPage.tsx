import { Link, useNavigate, useParams } from 'react-router-dom'
import { classes } from '../data/school'
import { useWorkspace } from '../lib/useWorkspace'
import { newId, pct, blankNote, blankTask, childTasks, unitNotes } from '../lib/workspace'
import { cloneNeuronPractice } from '../data/practiceNeurons'
import DateField, { prettyDate } from '../components/DateField'
import NoteList from '../components/NoteList'
import EmojiPick from '../components/EmojiPick'
import { useState, type FormEvent } from 'react'

export default function UnitPage() {
  const { id, unitId } = useParams()
  const course = classes.find((c) => c.id === id)
  const { ws, update } = useWorkspace(id)
  const nav = useNavigate()
  const unit = ws.units.find((u) => u.id === unitId)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDue, setTaskDue] = useState('')
  const [testName, setTestName] = useState('')
  const [testDate, setTestDate] = useState('')
  const tasks = ws.tasks.filter((t) => t.unitId === unitId && !t.parentId)
  const tests = ws.tests.filter((t) => t.unitId === unitId)
  const notes = unitNotes(ws.notes, unitId ?? '')

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
        blankTask({
          id: taskId,
          title: taskTitle.trim(),
          due: taskDue,
          unitId,
        }),
      ],
    })
    setTaskTitle('')
    setTaskDue('')
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
          date: testDate,
          score: '',
          outOf: '100',
          unitId,
          emoji: '',
          practice: /neuron|nervous|synapse|action potential/i.test(testName)
            ? cloneNeuronPractice(newId)
            : [],
        },
      ],
    })
    setTestName('')
    setTestDate('')
    nav(`/class/${id}/unit/${unitId}/test/${testId}`)
  }

  return (
    <>
      <p className="crumbs">
        <Link to={`/class/${id}`}>{course.short}</Link>
        <span> / {unit.emoji ? `${unit.emoji} ` : ''}{unit.name}</span>
      </p>
      <header className="page-head">
        <div className="page-head-title">
          <EmojiPick
            value={unit.emoji}
            fallback="📦"
            onChange={(emoji) =>
              update({
                ...ws,
                units: ws.units.map((u) => (u.id === unit.id ? { ...u, emoji } : u)),
              })
            }
            label="Unit emoji"
          />
          <div>
            <p className="kicker">{unit.status}</p>
            <h2 style={{ margin: 0, fontSize: 36, letterSpacing: '-0.04em' }}>{unit.name}</h2>
          </div>
        </div>
        <Link className="btn ghost" to={`/class/${id}`}>
          All units
        </Link>
      </header>

      <section className="card" style={{ marginBottom: 16 }}>
        <h3>This unit</h3>
        <label className="field">
          <span className="meta">Status</span>
          <select
            className="note-box field-control"
            value={unit.status}
            onChange={(e) =>
              update({
                ...ws,
                units: ws.units.map((u) =>
                  u.id === unit.id ? { ...u, status: e.target.value as typeof unit.status } : u,
                ),
              })
            }
          >
            <option value="upcoming">upcoming</option>
            <option value="current">current</option>
            <option value="done">done</option>
          </select>
        </label>
        <label className="field">
          <span className="meta">Big ideas</span>
          <textarea
            className="note-box field-control"
            rows={4}
            placeholder="Labs, pages, what this unit is actually about…"
            value={unit.focus}
            onChange={(e) =>
              update({
                ...ws,
                units: ws.units.map((u) => (u.id === unit.id ? { ...u, focus: e.target.value } : u)),
              })
            }
          />
        </label>
      </section>

      <div className="two">
        <section className="card">
          <h3>Assignments</h3>
          {tasks.length === 0 && <p className="meta">None yet.</p>}
          {tasks.map((t) => {
            const steps = childTasks(ws.tasks, t.id)
            const settled = steps.filter((s) => s.done).length
            return (
              <Link key={t.id} className="class-tile" to={`/class/${id}/unit/${unitId}/task/${t.id}`} style={{ marginBottom: 8 }}>
                <h4>
                  {t.emoji ? `${t.emoji} ` : ''}
                  {t.title || 'Untitled'}
                </h4>
                <p>
                  {t.done ? 'Settled' : t.due ? `Due ${prettyDate(t.due)}` : 'Open'}
                  {steps.length ? ` · ${settled}/${steps.length} sub-tasks` : ''}
                </p>
              </Link>
            )
          })}
          <form onSubmit={addTask} style={{ marginTop: 12 }}>
            <div className="todo-add">
              <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="New assignment" />
              <button className="btn" type="submit">
                Add
              </button>
            </div>
            <DateField label="Due" value={taskDue} onChange={setTaskDue} />
          </form>
        </section>
        <section className="card">
          <h3>Tests</h3>
          {tests.length === 0 && <p className="meta">None yet.</p>}
          {tests.map((t) => {
            const p = pct(t.score, t.outOf)
            return (
              <Link key={t.id} className="class-tile" to={`/class/${id}/unit/${unitId}/test/${t.id}`} style={{ marginBottom: 8 }}>
                <h4>
                  {t.emoji ? `${t.emoji} ` : ''}
                  {t.name || 'Untitled'}
                </h4>
                <p>
                  {t.kind}
                  {t.date ? ` · ${prettyDate(t.date)}` : ''}
                  {p != null ? ` · ${p.toFixed(0)}%` : ''}
                </p>
              </Link>
            )
          })}
          <form onSubmit={addTest} style={{ marginTop: 12 }}>
            <div className="todo-add">
              <input value={testName} onChange={(e) => setTestName(e.target.value)} placeholder="New test or quiz" />
              <button className="btn" type="submit">
                Add
              </button>
            </div>
            <DateField label="Test date" value={testDate} onChange={setTestDate} />
          </form>
        </section>
      </div>

      <section className="card" style={{ marginTop: 16 }}>
        <h3>Notes</h3>
        <NoteList
          notes={notes}
          hrefFor={(noteId) => `/class/${id}/unit/${unitId}/note/${noteId}`}
          onCreate={(title) => {
            const noteId = newId()
            update({
              ...ws,
              notes: [...ws.notes, blankNote({ id: noteId, title, unitId })],
            })
            nav(`/class/${id}/unit/${unitId}/note/${noteId}`)
          }}
          empty="No notes in this unit."
        />
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
