import { useMemo, useState, type FormEvent } from 'react'
import type { MoodBook } from '../lib/studio'
import { phnomPenhIso } from '../lib/dueMail'
import { newId } from '../lib/workspace'
import { prettyDate } from './DateField'
import EmojiPick from './EmojiPick'

const monthLabel = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' })

function isoFor(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function EmojiLogCalendar({
  book,
  onChange,
  keyKicker = 'Key',
  keyHeading = 'Make your own meanings',
  keyHint = 'Pick an emoji and write what it means. You’ll read the pattern back later.',
  pickEmpty = 'Pick a key emoji for this day.',
  draftFallback = '🙂',
  emojiLabel = 'Key emoji',
  meaningLabel = 'Meaning',
}: {
  book: MoodBook
  onChange: (next: MoodBook) => void
  keyKicker?: string
  keyHeading?: string
  keyHint?: string
  pickEmpty?: string
  draftFallback?: string
  emojiLabel?: string
  meaningLabel?: string
}) {
  const today = phnomPenhIso()
  const [cursor, setCursor] = useState(() => {
    const [y, m] = today.split('-').map(Number)
    return { year: y, month: m - 1 }
  })
  const [selected, setSelected] = useState(today)
  const [draftEmoji, setDraftEmoji] = useState(draftFallback)
  const [draftLabel, setDraftLabel] = useState('')

  const first = new Date(cursor.year, cursor.month, 1).getDay()
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate()
  const startPad = (first + 6) % 7
  const cells = [...Array(startPad).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const selectedEmoji = book.days[selected] ?? ''
  const labelFor = (emoji: string) => book.keys.find((k) => k.emoji === emoji)?.label ?? ''

  const monthStats = useMemo(() => {
    const prefix = `${cursor.year}-${String(cursor.month + 1).padStart(2, '0')}-`
    const counts = new Map<string, number>()
    for (const [date, emoji] of Object.entries(book.days)) {
      if (!date.startsWith(prefix)) continue
      counts.set(emoji, (counts.get(emoji) ?? 0) + 1)
    }
    return [...counts.entries()]
      .map(([emoji, count]) => ({
        emoji,
        count,
        label: book.keys.find((k) => k.emoji === emoji)?.label ?? '',
      }))
      .sort((a, b) => b.count - a.count)
  }, [book.days, book.keys, cursor.month, cursor.year])

  function shiftMonth(delta: number) {
    setCursor((c) => {
      const d = new Date(c.year, c.month + delta, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  function setDayValue(emoji: string) {
    const days = { ...book.days }
    if (!emoji || days[selected] === emoji) delete days[selected]
    else days[selected] = emoji
    onChange({ ...book, days })
  }

  function addKey(e: FormEvent) {
    e.preventDefault()
    const emoji = draftEmoji.trim()
    const label = draftLabel.trim()
    if (!emoji || !label) return
    const existing = book.keys.find((k) => k.emoji === emoji)
    const keys = existing
      ? book.keys.map((k) => (k.emoji === emoji ? { ...k, label } : k))
      : [...book.keys, { id: newId(), emoji, label }]
    onChange({ ...book, keys })
    setDraftLabel('')
  }

  function removeKey(id: string) {
    onChange({ ...book, keys: book.keys.filter((k) => k.id !== id) })
  }

  return (
    <div className="mood-book">
      <div className="mood-book-grid">
        <div>
          <div className="mood-month-nav">
            <button className="btn ghost" type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month">
              ←
            </button>
            <h4>{monthLabel.format(new Date(cursor.year, cursor.month, 1))}</h4>
            <button className="btn ghost" type="button" onClick={() => shiftMonth(1)} aria-label="Next month">
              →
            </button>
          </div>
          <div className="cal-grid mood-cal">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div className="dow" key={i}>
                {d}
              </div>
            ))}
            {cells.map((d, i) => {
              if (!d) return <div key={i} className="cal-cell mood-day is-empty" />
              const iso = isoFor(cursor.year, cursor.month, d)
              const emoji = book.days[iso]
              const meaning = emoji ? labelFor(emoji) : ''
              return (
                <button
                  key={i}
                  type="button"
                  className={`cal-cell mood-day ${iso === today ? 'today' : ''} ${iso === selected ? 'is-selected' : ''} ${emoji ? 'has-mood' : ''}`}
                  onClick={() => setSelected(iso)}
                  title={meaning ? `${prettyDate(iso)} · ${meaning}` : prettyDate(iso)}
                >
                  <span className="mood-day-num">{d}</span>
                  <span className="mood-day-face" aria-hidden>
                    {emoji || '·'}
                  </span>
                </button>
              )
            })}
          </div>
          {monthStats.length > 0 && (
            <p className="meta mood-month-stats">
              This month: {monthStats.map((s) => `${s.emoji}×${s.count}`).join(' · ')}
            </p>
          )}
        </div>

        <div className="mood-side">
          <div>
            <p className="kicker">Selected day</p>
            <h4 style={{ margin: '0 0 8px' }}>{prettyDate(selected)}</h4>
            <p className="meta" style={{ marginTop: 0 }}>
              {selectedEmoji
                ? `${selectedEmoji} ${labelFor(selectedEmoji) || 'No key label yet — add one below.'}`
                : pickEmpty}
            </p>
            <div className="mood-pick">
              {book.keys.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  className={selectedEmoji === k.emoji ? 'on' : ''}
                  title={k.label}
                  onClick={() => setDayValue(k.emoji)}
                >
                  <span aria-hidden>{k.emoji}</span>
                  <span className="mood-pick-label">{k.label}</span>
                </button>
              ))}
            </div>
            {selectedEmoji && (
              <button className="btn ghost" type="button" style={{ marginTop: 8 }} onClick={() => setDayValue('')}>
                Clear day
              </button>
            )}
          </div>

          <div className="mood-key-maker">
            <p className="kicker">{keyKicker}</p>
            <h4 style={{ margin: '0 0 8px' }}>{keyHeading}</h4>
            <p className="meta" style={{ marginTop: 0 }}>
              {keyHint}
            </p>
            <form className="mood-key-form" onSubmit={addKey}>
              <EmojiPick
                value={draftEmoji}
                onChange={setDraftEmoji}
                fallback={draftFallback}
                size="sm"
                label={emojiLabel}
              />
              <input
                className="note-box"
                value={draftLabel}
                onChange={(e) => setDraftLabel(e.target.value)}
                placeholder="What this means…"
                aria-label={meaningLabel}
              />
              <button className="btn" type="submit">
                Save key
              </button>
            </form>
            <ul className="mood-key-list">
              {book.keys.map((k) => (
                <li key={k.id}>
                  <span className="mood-key-emoji" aria-hidden>
                    {k.emoji}
                  </span>
                  <span>{k.label || 'Untitled'}</span>
                  <button className="btn ghost" type="button" onClick={() => removeKey(k.id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
