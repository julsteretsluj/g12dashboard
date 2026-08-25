import { useState } from 'react'
import { FlipBoard } from './FlipBoard'
import { useAuth } from '../lib/AuthContext'
import { useFocusTimer } from '../lib/TimerContext'

const presets = [15, 25, 45, 50]

export default function Pomodoro() {
  const { studio, patchTimer } = useAuth()
  const timer = studio.timer
  const { seconds, running, toggle, reset } = useFocusTimer()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(timer.title)

  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')

  function setMinutes(n: number) {
    const minutes = Math.min(180, Math.max(1, Math.round(n)))
    patchTimer({ ...timer, minutes })
    reset()
  }

  function saveTitle() {
    const title = draft.trim().slice(0, 40) || 'Focus maple'
    patchTimer({ ...timer, title })
    setDraft(title)
    setEditing(false)
  }

  return (
    <div className="pomodoro">
      <div>
        {editing ? (
          <input
            className="pomo-title-input"
            value={draft}
            autoFocus
            maxLength={40}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveTitle()
              if (e.key === 'Escape') {
                setDraft(timer.title)
                setEditing(false)
              }
            }}
          />
        ) : (
          <button className="hand pomo-title" type="button" onClick={() => setEditing(true)}>
            {timer.title}
          </button>
        )}
        <FlipBoard value={`${m}:${s}`} size="sm" />
        <div className="pomo-presets">
          {presets.map((n) => (
            <button
              key={n}
              className={`btn ghost ${timer.minutes === n ? 'on' : ''}`}
              type="button"
              onClick={() => setMinutes(n)}
            >
              {n}m
            </button>
          ))}
          <label className="pomo-custom">
            <span className="meta">min</span>
            <input
              type="number"
              min={1}
              max={180}
              value={timer.minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
            />
          </label>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignSelf: 'flex-start' }}>
        <button className="btn" type="button" onClick={toggle}>
          {running ? 'Pause' : seconds === 0 ? 'Restart' : 'Start'}
        </button>
        <button className="btn ghost" type="button" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  )
}
