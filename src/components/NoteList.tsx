import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { NoteItem } from '../lib/workspace'
import { prettyDate } from './DateField'

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
      {notes.map((n) => {
        const when = n.date ? prettyDate(n.date) : ''
        const topic = n.topic.trim()
        const meta = [topic, when].filter(Boolean).join(' · ') || 'Open'
        return (
          <Link key={n.id} className="class-tile" to={hrefFor(n.id)} style={{ marginBottom: 8 }}>
            <h4>
              {n.emoji ? `${n.emoji} ` : ''}
              {n.title || 'Untitled'}
            </h4>
            <p>{meta}</p>
            {n.body.trim() ? <p className="class-tile-blurb">{n.body.trim()}</p> : null}
          </Link>
        )
      })}
      <form className="todo-add" style={{ marginTop: 12 }} onSubmit={add}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New note" />
        <button className="btn" type="submit">
          Add
        </button>
      </form>
    </>
  )
}
