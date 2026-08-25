import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { NoteItem } from '../lib/workspace'

type Props = {
  notes: NoteItem[]
  hrefFor: (id: string) => string
  onCreate: (title: string) => void
  empty?: string
}

export default function NoteList({ notes, hrefFor, onCreate, empty = 'No notes yet.' }: Props) {
  const [title, setTitle] = useState('')

  function add(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onCreate(title.trim())
    setTitle('')
  }

  return (
    <>
      {notes.length === 0 && empty && <p className="meta">{empty}</p>}
      <div className="notes-grid">
        {notes.map((n) => (
          <Link key={n.id} className="sticky sticky-link" to={hrefFor(n.id)}>
            <h4>
              {n.emoji ? `${n.emoji} ` : ''}
              {n.title || 'Untitled'}
            </h4>
            <p>{n.body.slice(0, 120) || 'Empty'}</p>
          </Link>
        ))}
      </div>
      <form className="todo-add" style={{ marginTop: 12 }} onSubmit={add}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New note" />
        <button className="btn" type="submit">
          Add
        </button>
      </form>
    </>
  )
}
