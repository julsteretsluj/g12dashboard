import { Link } from 'react-router-dom'
import { useMemo, useState, type FormEvent } from 'react'
import { classes, nextClassMeeting } from '../data/school'
import { useAuth, workspaceOf } from '../lib/AuthContext'
import { blankTask, newId } from '../lib/workspace'
import { homeworkFromWorkspaces } from '../lib/homework'
import { DUE_MAIL_TO, prettyDue } from '../lib/dueMail'
import { prettyDate } from '../components/DateField'
import DateField from '../components/DateField'
import { subjectEmoji } from '../lib/emoji'

export default function HomeworkPage() {
  const { studio, patchWorkspace } = useAuth()
  const items = useMemo(() => homeworkFromWorkspaces(studio.workspaces), [studio.workspaces])
  const open = items.filter((i) => !i.done)
  const done = items.filter((i) => i.done)
  const mailSoon = open.filter((i) => i.dueTomorrow)

  const academic = classes.filter((c) => c.id !== 'homeroom')
  const [classId, setClassId] = useState(academic[0]?.id ?? 'bio')
  const [unitId, setUnitId] = useState('')
  const [title, setTitle] = useState('')
  const [due, setDue] = useState('')

  const ws = workspaceOf(studio, classId)
  const units = ws.units
  const next = nextClassMeeting(classId)

  function addHomework(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    const task = blankTask({
      id: newId(),
      title: title.trim(),
      due: due.trim(),
      unitId: unitId || '',
    })
    patchWorkspace(classId, { ...ws, tasks: [...ws.tasks, task] })
    setTitle('')
    setDue('')
  }

  function toggleDone(classKey: string, taskId: string, doneNext: boolean) {
    const desk = workspaceOf(studio, classKey)
    patchWorkspace(classKey, {
      ...desk,
      tasks: desk.tasks.map((t) => (t.id === taskId ? { ...t, done: doneNext } : t)),
    })
  }

  function setItemDue(classKey: string, taskId: string, nextDue: string) {
    const desk = workspaceOf(studio, classKey)
    patchWorkspace(classKey, {
      ...desk,
      tasks: desk.tasks.map((t) => (t.id === taskId ? { ...t, due: nextDue } : t)),
    })
  }

  return (
    <>
      <p className="kicker">Assignments across every class</p>
      <h2 style={{ marginTop: 0, fontSize: 36, letterSpacing: '-0.04em' }}>Homework center</h2>
      <p className="meta" style={{ maxWidth: '56ch', marginBottom: 8 }}>
        Track due work in one place. Set <strong>Next class</strong> from the timetable, and CIS Studio emails{' '}
        {DUE_MAIL_TO} about 24 hours before a due date (when your desk is open, or via the morning cloud job).
      </p>

      {mailSoon.length > 0 && (
        <section className="card" style={{ marginTop: 16, borderColor: 'rgba(192, 41, 45, 0.35)' }}>
          <h3>Due tomorrow · email reminder</h3>
          <p className="meta" style={{ marginTop: 0 }}>
            {mailSoon.length} item{mailSoon.length === 1 ? '' : 's'} will trigger / already queued for the
            24-hour heads-up.
          </p>
          <ul className="event-list">
            {mailSoon.map((item) => (
              <li key={item.key}>
                <time>{prettyDue(item.due)}</time>
                <span>
                  {item.emoji} {item.title}
                  <div className="meta">{item.classShort}</div>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card" style={{ marginTop: 16 }}>
        <h3>Add homework</h3>
        <form onSubmit={addHomework}>
          <div className="todo-add" style={{ flexWrap: 'wrap' }}>
            <select
              className="note-box"
              value={classId}
              onChange={(e) => {
                setClassId(e.target.value)
                setUnitId('')
                setDue('')
              }}
              style={{ maxWidth: 180 }}
              aria-label="Class"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {subjectEmoji(c.id, workspaceOf(studio, c.id).classEmoji)} {c.short}
                </option>
              ))}
            </select>
            {units.length > 0 && (
              <select
                className="note-box"
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
                style={{ maxWidth: 200 }}
                aria-label="Unit"
              >
                <option value="">No unit (class list)</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            )}
            <input
              className="note-box"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Homework title"
              style={{ flex: 1, minWidth: 160 }}
            />
            <button className="btn" type="submit">
              Add
            </button>
          </div>
          <div style={{ marginTop: 10 }}>
            <DateField label="Due" value={due} onChange={setDue} classId={classId} />
          </div>
          {next && (
            <p className="meta" style={{ marginTop: 8 }}>
              Next {classes.find((c) => c.id === classId)?.short} meeting:{' '}
              {prettyDate(next.iso)} · {next.day} {next.start}–{next.end}
            </p>
          )}
        </form>
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <h3>Open ({open.length})</h3>
        {open.length === 0 && <p className="meta">Nothing open. Enjoy the quiet.</p>}
        <div className="coming-list" style={{ marginTop: 8 }}>
          {open.map((item) => (
            <div key={item.key} className="homework-row" style={{ borderLeftColor: item.color }}>
              <input
                type="checkbox"
                checked={false}
                onChange={() => toggleDone(item.classId, item.taskId, true)}
                aria-label={`Mark ${item.title} done`}
              />
              <span className="coming-emoji" aria-hidden>
                {item.emoji}
              </span>
              <div className="homework-row-main">
                <Link to={item.href}>
                  <strong>{item.title}</strong>
                </Link>
                <p>
                  {item.classShort}
                  {item.unitName ? ` · ${item.unitName}` : ''}
                  {item.overdue ? ' · Overdue' : ''}
                  {item.dueTomorrow ? ' · Due tomorrow' : ''}
                </p>
                <DateField
                  label="Due"
                  value={item.due}
                  onChange={(nextDue) => setItemDue(item.classId, item.taskId, nextDue)}
                  classId={item.classId}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {done.length > 0 && (
        <section className="card" style={{ marginTop: 16 }}>
          <h3>Done ({done.length})</h3>
          <div className="coming-list" style={{ marginTop: 8 }}>
            {done.slice(0, 12).map((item) => (
              <div key={item.key} className="homework-row is-done" style={{ borderLeftColor: item.color }}>
                <input
                  type="checkbox"
                  checked
                  onChange={() => toggleDone(item.classId, item.taskId, false)}
                  aria-label={`Reopen ${item.title}`}
                />
                <span className="coming-emoji" aria-hidden>
                  {item.emoji}
                </span>
                <div>
                  <Link to={item.href}>
                    <strong>{item.title}</strong>
                  </Link>
                  <p>
                    {item.classShort}
                    {item.due ? ` · ${prettyDate(item.due)}` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
