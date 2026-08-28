import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { sanitizeNoteHtml, toNoteHtml } from '../lib/noteHtml'

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg className="note-tool-icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden>
      {children}
    </svg>
  )
}

type Action = {
  id: string
  label: string
  cmd: string
  arg?: string
  icon: ReactNode
  active?: () => boolean
}

const actions: Action[] = [
  {
    id: 'bold',
    label: 'Bold',
    cmd: 'bold',
    active: () => document.queryCommandState('bold'),
    icon: (
      <Icon>
        <text x="8" y="12.2" textAnchor="middle" fontSize="12" fontWeight="700" fontFamily="-apple-system, system-ui, sans-serif" fill="currentColor">
          B
        </text>
      </Icon>
    ),
  },
  {
    id: 'italic',
    label: 'Italic',
    cmd: 'italic',
    active: () => document.queryCommandState('italic'),
    icon: (
      <Icon>
        <text x="8" y="12.2" textAnchor="middle" fontSize="12" fontStyle="italic" fontWeight="600" fontFamily="-apple-system, system-ui, sans-serif" fill="currentColor">
          I
        </text>
      </Icon>
    ),
  },
  {
    id: 'underline',
    label: 'Underline',
    cmd: 'underline',
    active: () => document.queryCommandState('underline'),
    icon: (
      <Icon>
        <text x="8" y="11.2" textAnchor="middle" fontSize="11" fontWeight="600" fontFamily="-apple-system, system-ui, sans-serif" fill="currentColor">
          U
        </text>
        <path d="M3.5 13.5h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </Icon>
    ),
  },
  {
    id: 'heading',
    label: 'Heading',
    cmd: 'formatBlock',
    arg: '<h3>',
    active: () => {
      const block = document.queryCommandValue('formatBlock').toLowerCase().replace(/[<>]/g, '')
      return block === 'h3' || block === 'h2' || block === 'h1'
    },
    icon: (
      <Icon>
        <text x="8" y="12.2" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="-apple-system, system-ui, sans-serif" fill="currentColor">
          H
        </text>
      </Icon>
    ),
  },
  {
    id: 'bullets',
    label: 'Bullets',
    cmd: 'insertUnorderedList',
    active: () => document.queryCommandState('insertUnorderedList'),
    icon: (
      <Icon>
        <circle cx="3.2" cy="4" r="1.15" fill="currentColor" />
        <circle cx="3.2" cy="8" r="1.15" fill="currentColor" />
        <circle cx="3.2" cy="12" r="1.15" fill="currentColor" />
        <path d="M6.5 4h7M6.5 8h7M6.5 12h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </Icon>
    ),
  },
  {
    id: 'numbers',
    label: 'Numbers',
    cmd: 'insertOrderedList',
    active: () => document.queryCommandState('insertOrderedList'),
    icon: (
      <Icon>
        <text x="1.2" y="5.2" fontSize="5.5" fontWeight="700" fontFamily="-apple-system, system-ui, sans-serif" fill="currentColor">
          1
        </text>
        <text x="1.2" y="9.2" fontSize="5.5" fontWeight="700" fontFamily="-apple-system, system-ui, sans-serif" fill="currentColor">
          2
        </text>
        <text x="1.2" y="13.2" fontSize="5.5" fontWeight="700" fontFamily="-apple-system, system-ui, sans-serif" fill="currentColor">
          3
        </text>
        <path d="M6.5 4h7M6.5 8h7M6.5 12h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </Icon>
    ),
  },
  {
    id: 'indent',
    label: 'Indent',
    cmd: 'indent',
    icon: (
      <Icon>
        <path d="M2 3.5h12M8 8H2M2 12.5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5 5.8 7.8 8 5 10.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </Icon>
    ),
  },
  {
    id: 'outdent',
    label: 'Outdent',
    cmd: 'outdent',
    icon: (
      <Icon>
        <path d="M2 3.5h12M14 8H8M2 12.5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11 5.8 8.2 8 11 10.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </Icon>
    ),
  },
  {
    id: 'body',
    label: 'Body',
    cmd: 'formatBlock',
    arg: '<p>',
    active: () => {
      const block = document.queryCommandValue('formatBlock').toLowerCase().replace(/[<>]/g, '')
      return block === 'p' || block === 'div' || block === ''
    },
    icon: (
      <Icon>
        <path d="M3 3.5h10M3 6.5h10M3 9.5h7M3 12.5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </Icon>
    ),
  },
]

export default function NoteEditor({
  html,
  onChange,
}: {
  html: string
  onChange: (next: string) => void
}) {
  const canvas = useRef<HTMLDivElement>(null)
  const [pressed, setPressed] = useState<Record<string, boolean>>({})

  const syncPressed = useCallback(() => {
    const el = canvas.current
    const selection = document.getSelection()
    if (!el || !selection?.anchorNode || !el.contains(selection.anchorNode)) {
      setPressed({})
      return
    }
    const next: Record<string, boolean> = {}
    for (const action of actions) {
      if (action.active) next[action.id] = action.active()
    }
    setPressed(next)
  }, [])

  useEffect(() => {
    const el = canvas.current
    if (!el) return
    el.innerHTML = toNoteHtml(html)
  }, [])

  useEffect(() => {
    document.addEventListener('selectionchange', syncPressed)
    return () => document.removeEventListener('selectionchange', syncPressed)
  }, [syncPressed])

  function emit() {
    const el = canvas.current
    if (!el) return
    onChange(sanitizeNoteHtml(el.innerHTML))
    syncPressed()
  }

  function run(cmd: string, arg?: string) {
    canvas.current?.focus()
    document.execCommand(cmd, false, arg)
    emit()
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Tab') return
    e.preventDefault()
    run(e.shiftKey ? 'outdent' : 'indent')
  }

  return (
    <div className="note-editor">
      <div className="note-toolbar" role="toolbar" aria-label="Formatting">
        {actions.map((a) => (
          <button
            key={a.id}
            className={`btn ghost note-tool${pressed[a.id] ? ' is-active' : ''}`}
            type="button"
            title={a.label}
            aria-pressed={pressed[a.id] ?? false}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => run(a.cmd, a.arg)}
          >
            {a.icon}
            <span>{a.label}</span>
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
        onKeyUp={syncPressed}
        onMouseUp={syncPressed}
        onFocus={syncPressed}
        onKeyDown={onKeyDown}
      />
    </div>
  )
}
