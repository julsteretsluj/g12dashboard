import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import DateField, { prettyDate } from './DateField'
import type { TaskItem } from '../lib/workspace'

export default function Subtasks({
  items,
  hrefFor,
  onAdd,
  onToggle,
  classId,
}: {
  items: TaskItem[]
  hrefFor: (id: string) => string
  onAdd: (title: string, due: string) => void
  onToggle: (id: string, done: boolean) => void
  classId?: string
}) {
  const [title, setTitle] = useState('')
  const [due, setDue] = useState('')
  const done = items.filter((t) => t.done).length

  function add(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title.trim(), due)
    setTitle('')
    setDue('')
  }

  return (
    <div className="subtasks">
      <h3 style={{ marginTop: 18 }}>Sub-tasks</h3>
      <p className="meta">
        {items.length === 0
          ? 'Break this assignment into smaller steps.'
          : `${done} / ${items.length} done`}
      </p>
      {items.map((t) => (
        <div key={t.id} className="subtask-row">
          <input
            type="checkbox"
            checked={t.done}
            onChange={() => onToggle(t.id, !t.done)}
            aria-label={`Mark ${t.title || 'sub-task'} done`}
          />
          <Link to={hrefFor(t.id)}>
            <strong>
              {t.emoji ? `${t.emoji} ` : ''}
              {t.title || 'Untitled'}
            </strong>
            <span>{t.done ? 'Settled' : t.due ? `Due ${prettyDate(t.due)}` : 'Open'}</span>
          </Link>
        </div>
      ))}
      <form onSubmit={add} style={{ marginTop: 10 }}>
        <div className="todo-add">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New sub-task" />
          <button className="btn" type="submit">
            Add
          </button>
        </div>
        <DateField label="Due" value={due} onChange={setDue} classId={classId} />
      </form>
    </div>
  )
}
