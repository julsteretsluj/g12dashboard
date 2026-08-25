import { useEffect, useRef } from 'react'
import { sanitizeNoteHtml, toNoteHtml } from '../lib/noteHtml'

const actions: { label: string, cmd: string, arg?: string }[] = [
  { label: 'Bold', cmd: 'bold' },
  { label: 'Italic', cmd: 'italic' },
  { label: 'Underline', cmd: 'underline' },
  { label: 'Heading', cmd: 'formatBlock', arg: '<h3>' },
  { label: 'Bullets', cmd: 'insertUnorderedList' },
  { label: 'Numbers', cmd: 'insertOrderedList' },
  { label: 'Body', cmd: 'formatBlock', arg: '<p>' },
]

export default function NoteEditor({
  html,
  onChange,
}: {
  html: string
  onChange: (next: string) => void
}) {
  const canvas = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = canvas.current
    if (!el) return
    el.innerHTML = toNoteHtml(html)
  }, [])

  function emit() {
    const el = canvas.current
    if (!el) return
    onChange(sanitizeNoteHtml(el.innerHTML))
  }

  function run(cmd: string, arg?: string) {
    canvas.current?.focus()
    document.execCommand(cmd, false, arg)
    emit()
  }

  return (
    <div className="note-editor">
      <div className="note-toolbar" role="toolbar" aria-label="Formatting">
        {actions.map((a) => (
          <button
            key={a.label}
            className="btn ghost"
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => run(a.cmd, a.arg)}
          >
            {a.label}
          </button>
        ))}
      </div>
      <div
        ref={canvas}
        className="note-canvas"
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-label="Notes"
        data-placeholder="Write here…"
        onInput={emit}
        onBlur={emit}
      />
    </div>
  )
}
