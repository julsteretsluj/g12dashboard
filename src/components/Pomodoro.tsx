import { useEffect, useState } from 'react'
import { FlipBoard } from './FlipBoard'
import { useAuth } from '../lib/AuthContext'

const presets = [15, 25, 45, 50]

export default function Pomodoro() {
  const { studio, patchTimer } = useAuth()
  const timer = studio.timer
  const length = Math.round(timer.minutes) * 60
  const [seconds, setSeconds] = useState(length)
  const [run, setRun] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(timer.title)

  useEffect(() => {
    if (!run) setSeconds(Math.round(timer.minutes) * 60)
  }, [timer.minutes, run])

  useEffect(() => {
    if (!run) return
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [run])

  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')

  function setMinutes(n: number) {
    const minutes = Math.min(180, Math.max(1, Math.round(n)))
    patchTimer({ ...timer, minutes })
    setRun(false)
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
        <button className="btn" type="button" onClick={() => setRun((v) => !v)}>
          {run ? 'Pause' : 'Start'}
        </button>
        <button
          className="btn ghost"
          type="button"
          onClick={() => {
            setRun(false)
            setSeconds(Math.round(timer.minutes) * 60)
          }}
        >
          Reset
        </button>
      </div>
    </div>
  )
}
