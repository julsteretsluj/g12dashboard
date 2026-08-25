import { useEffect, useRef, useState } from 'react'
import { emojiPalette, firstGrapheme } from '../lib/emoji'

type Props = {
  value: string
  onChange: (next: string) => void
  fallback?: string
  size?: 'sm' | 'md'
  label?: string
}

export default function EmojiPick({ value, onChange, fallback = '✨', size = 'md', label = 'Pick emoji' }: Props) {
  const [open, setOpen] = useState(false)
  const [typed, setTyped] = useState('')
  const root = useRef<HTMLDivElement>(null)
  const shown = value.trim() || fallback

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={`emoji-pick ${size}`} ref={root}>
      <button
        className="emoji-face"
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {shown}
      </button>
      {open && (
        <div className="emoji-pop">
          <div className="emoji-grid">
            {emojiPalette.map((e) => (
              <button
                key={e}
                type="button"
                className={value === e ? 'on' : ''}
                onClick={() => {
                  onChange(e)
                  setOpen(false)
                }}
              >
                {e}
              </button>
            ))}
          </div>
          <input
            className="note-box"
            value={typed}
            onChange={(e) => {
              const g = firstGrapheme(e.target.value)
              setTyped(g)
              if (g) {
                onChange(g)
                setTyped('')
                setOpen(false)
              }
            }}
            placeholder="Or paste one"
            aria-label="Paste an emoji"
          />
          {value && (
            <button
              className="btn ghost"
              type="button"
              onClick={() => {
                onChange('')
                setOpen(false)
              }}
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  )
}
