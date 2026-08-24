import { useEffect, useState } from 'react'

type Item = { id: string; text: string; done: boolean }

const seed: Item[] = [
  { id: '1', text: 'Print CAS reflection before advisory', done: false },
  { id: '2', text: 'Refill water · Maple Leaf Café after P3', done: false },
  { id: '3', text: 'Charge iPad — bio lab needs the probe', done: true },
]

export default function Todo() {
  const [items, setItems] = useState<Item[]>(() => {
    const raw = localStorage.getItem('cis-todo')
    return raw ? JSON.parse(raw) : seed
  })
  const [text, setText] = useState('')

  useEffect(() => {
    localStorage.setItem('cis-todo', JSON.stringify(items))
  }, [items])

  return (
    <div>
      {items.map((item) => (
        <label key={item.id} className={`todo-row ${item.done ? 'done' : ''}`}>
          <input
            type="checkbox"
            checked={item.done}
            onChange={() =>
              setItems((xs) =>
                xs.map((x) => (x.id === item.id ? { ...x, done: !x.done } : x)),
              )
            }
          />
          <span>{item.text}</span>
        </label>
      ))}
      <form
        className="todo-add"
        onSubmit={(e) => {
          e.preventDefault()
          if (!text.trim()) return
          setItems((xs) => [
            ...xs,
            { id: crypto.randomUUID(), text: text.trim(), done: false },
          ])
          setText('')
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a tiny mission…"
        />
        <button className="btn" type="submit">
          Add
        </button>
      </form>
    </div>
  )
}
