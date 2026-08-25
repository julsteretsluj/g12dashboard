import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import EmojiPick from './EmojiPick'

export default function Todo() {
  const { studio, patchTodo } = useAuth()
  const items = studio.todo
  const [text, setText] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  function setItems(updater: typeof items | ((xs: typeof items) => typeof items)) {
    const next = typeof updater === 'function' ? updater(items) : updater
    patchTodo(next)
  }

  return (
    <div>
      {items.length === 0 && <p className="meta">No tasks yet.</p>}
      {items.map((item) => (
        <div key={item.id} className={`todo-row ${item.done ? 'done' : ''}`}>
          <EmojiPick
            size="sm"
            value={item.emoji}
            fallback="☑️"
            onChange={(emoji) =>
              setItems((xs) => xs.map((x) => (x.id === item.id ? { ...x, emoji } : x)))
            }
            label="To-do emoji"
          />
          <input
            type="checkbox"
            checked={item.done}
            onChange={() =>
              setItems((xs) =>
                xs.map((x) => (x.id === item.id ? { ...x, done: !x.done } : x)),
              )
            }
            aria-label={item.text}
          />
          {editing === item.id ? (
            <input
              className="note-box"
              value={draft}
              autoFocus
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const next = draft.trim()
                  if (next) {
                    setItems((xs) =>
                      xs.map((x) => (x.id === item.id ? { ...x, text: next } : x)),
                    )
                  }
                  setEditing(null)
                }
                if (e.key === 'Escape') setEditing(null)
              }}
            />
          ) : (
            <span>{item.text}</span>
          )}
          <div className="todo-actions">
            {editing === item.id ? (
              <button
                className="btn"
                type="button"
                onClick={() => {
                  const next = draft.trim()
                  if (next) {
                    setItems((xs) =>
                      xs.map((x) => (x.id === item.id ? { ...x, text: next } : x)),
                    )
                  }
                  setEditing(null)
                }}
              >
                Save
              </button>
            ) : (
              <button
                className="btn ghost"
                type="button"
                onClick={() => {
                  setEditing(item.id)
                  setDraft(item.text)
                }}
              >
                Edit
              </button>
            )}
            <button
              className="btn ghost"
              type="button"
              onClick={() => setItems((xs) => xs.filter((x) => x.id !== item.id))}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      <form
        className="todo-add"
        onSubmit={(e) => {
          e.preventDefault()
          if (!text.trim()) return
          setItems((xs) => [
            ...xs,
            { id: crypto.randomUUID(), text: text.trim(), done: false, emoji: '' },
          ])
          setText('')
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a task…"
        />
        <button className="btn" type="submit">
          Add
        </button>
      </form>
    </div>
  )
}
