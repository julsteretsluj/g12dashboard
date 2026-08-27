import { Link } from 'react-router-dom'
import { useMemo, useState, type FormEvent } from 'react'
import { classes, nextClassMeeting } from '../data/school'
import { useAuth, workspaceOf } from '../lib/AuthContext'
import { blankTask, newId, type WorkTag } from '../lib/workspace'
import { homeworkFromWorkspaces, type HomeworkItem } from '../lib/homework'
import { DUE_MAIL_TO, prettyDue } from '../lib/dueMail'
import { prettyDate } from '../components/DateField'
import DateField from '../components/DateField'
import TaskTagPick from '../components/TaskTagPick'
import { subjectEmoji } from '../lib/emoji'

type Filter = 'all' | WorkTag

export default function HomeworkPage() {
  const { studio, patchWorkspace } = useAuth()
  const items = useMemo(() => homeworkFromWorkspaces(studio.workspaces), [studio.workspaces])
  const [filter, setFilter] = useState<Filter>('all')
  const visible = items.filter((i) => filter === 'all' || i.tag === filter)
  const open = visible.filter((i) => !i.done)
  const done = visible.filter((i) => i.done)
  const mailSoon = items.filter((i) => !i.done && i.dueTomorrow && i.tag === 'homework')

  const academic = classes.filter((c) => c.id !== 'homeroom')
  const [classId, setClassId] = useState(academic[0]?.id ?? 'bio')
  const [unitId, setUnitId] = useState('')
  const [title, setTitle] = useState('')
  const [due, setDue] = useState('')
  const [tag, setTag] = useState<WorkTag>('homework')

  const ws = workspaceOf(studio, classId)
  const units = ws.units
  const next = nextClassMeeting(classId)

  function addWork(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    const task = blankTask({
      id: newId(),
      title: title.trim(),
      due: due.trim(),
      unitId: unitId || '',
      tag,
    })
    patchWorkspace(classId, { ...ws, tasks: [...ws.tasks, task] })
    setTitle('')
    setDue('')
  }

  function patchItem(classKey: string, taskId: string, patch: Partial<{ done: boolean; due: string; tag: WorkTag }>) {
    const desk = workspaceOf(studio, classKey)
    patchWorkspace(classKey, {
      ...desk,
      tasks: desk.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)),
    })
  }

  return (
    <>
      <p className="kicker">Homework and class work across every class</p>
      <h2 style={{ marginTop: 0, fontSize: 36, letterSpacing: '-0.04em' }}>Work center</h2>
      <p className="meta" style={{ maxWidth: '56ch', marginBottom: 8 }}>
        Tag each assignment as <strong>Homework</strong> or <strong>Class work</strong>. Homework with a due
        date gets an email to {DUE_MAIL_TO} about 24 hours before.
      </p>

      <div className="work-filter" role="tablist" aria-label="Filter by tag">
        {(
          [
            { id: 'all' as const, label: 'All' },
            { id: 'homework' as const, label: 'Homework' },
            { id: 'classwork' as const, label: 'Class work' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={filter === t.id}
            className={filter === t.id ? 'on' : ''}
            onClick={() => setFilter(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {mailSoon.length > 0 && (
        <section className="card" style={{ marginTop: 16, borderColor: 'rgba(192, 41, 45, 0.35)' }}>
          <h3>Homework due tomorrow · email reminder</h3>
          <p className="meta" style={{ marginTop: 0 }}>
            {mailSoon.length} homework item{mailSoon.length === 1 ? '' : 's'} queued for the 24-hour heads-up.
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
        <h3>Add assignment</h3>
        <form onSubmit={addWork}>
          <TaskTagPick value={tag} onChange={setTag} />
          <div className="todo-add" style={{ flexWrap: 'wrap', marginTop: 10 }}>
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
              placeholder={tag === 'classwork' ? 'Class work title' : 'Homework title'}
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

      <WorkList
        title={`Open (${open.length})`}
        empty="Nothing open in this filter."
        items={open}
        onToggle={(item) => patchItem(item.classId, item.taskId, { done: true })}
        onDue={(item, nextDue) => patchItem(item.classId, item.taskId, { due: nextDue })}
        onTag={(item, nextTag) => patchItem(item.classId, item.taskId, { tag: nextTag })}
      />

      {done.length > 0 && (
        <WorkList
          title={`Done (${done.length})`}
          empty=""
          items={done.slice(0, 16)}
          done
          onToggle={(item) => patchItem(item.classId, item.taskId, { done: false })}
          onDue={(item, nextDue) => patchItem(item.classId, item.taskId, { due: nextDue })}
          onTag={(item, nextTag) => patchItem(item.classId, item.taskId, { tag: nextTag })}
        />
      )}
    </>
  )
}

function WorkList({
  title,
  empty,
  items,
  done = false,
  onToggle,
  onDue,
  onTag,
}: {
  title: string
  empty: string
  items: HomeworkItem[]
  done?: boolean
  onToggle: (item: HomeworkItem) => void
  onDue: (item: HomeworkItem, due: string) => void
  onTag: (item: HomeworkItem, tag: WorkTag) => void
}) {
  return (
    <section className="card" style={{ marginTop: 16 }}>
      <h3>{title}</h3>
      {items.length === 0 && empty && <p className="meta">{empty}</p>}
      <div className="coming-list" style={{ marginTop: 8 }}>
        {items.map((item) => (
          <div
            key={item.key}
            className={`homework-row ${done ? 'is-done' : ''} tag-${item.tag}`}
            style={{ borderLeftColor: item.color }}
          >
            <input
              type="checkbox"
              checked={done}
              onChange={() => onToggle(item)}
              aria-label={done ? `Reopen ${item.title}` : `Mark ${item.title} done`}
            />
            <span className="coming-emoji" aria-hidden>
              {item.emoji}
            </span>
            <div className="homework-row-main">
              <Link to={item.href}>
                <strong>{item.title}</strong>
              </Link>
              <p>
                <span className={`work-tag-pill tag-${item.tag}`}>{item.tagLabel}</span>
                {' · '}
                {item.classShort}
                {item.unitName ? ` · ${item.unitName}` : ''}
                {!done && item.overdue ? ' · Overdue' : ''}
                {!done && item.dueTomorrow && item.tag === 'homework' ? ' · Due tomorrow' : ''}
                {done && item.due ? ` · ${prettyDate(item.due)}` : ''}
              </p>
              {!done && (
                <>
                  <TaskTagPick value={item.tag} onChange={(next) => onTag(item, next)} />
                  <DateField
                    label="Due"
                    value={item.due}
                    onChange={(nextDue) => onDue(item, nextDue)}
                    classId={item.classId}
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
