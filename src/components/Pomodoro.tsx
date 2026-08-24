import { useEffect, useState } from 'react'

export default function Pomodoro() {
  const [seconds, setSeconds] = useState(25 * 60)
  const [run, setRun] = useState(false)

  useEffect(() => {
    if (!run) return
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [run])

  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')

  return (
    <div className="pomodoro">
      <div>
        <div className="hand">Focus maple</div>
        <div className="pomo-time">
          {m}:{s}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn" type="button" onClick={() => setRun((v) => !v)}>
          {run ? 'Pause' : 'Start'}
        </button>
        <button
          className="btn ghost"
          type="button"
          onClick={() => {
            setRun(false)
            setSeconds(25 * 60)
          }}
        >
          Reset
        </button>
      </div>
    </div>
  )
}
