import { useEffect, useState } from 'react'
import NextBell from './NextBell'
import { useFocusTimer } from '../lib/TimerContext'
import { useAuth } from '../lib/AuthContext'

function clock(seconds: number) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

export default function StatusBar() {
  const [now, setNow] = useState(() => new Date())
  const { studio } = useAuth()
  const { seconds, running, toggle, reset } = useFocusTimer()

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="status-bar">
      <NextBell now={now} compact />
      <div className="status-timer">
        <span className="meta">{studio.timer.title}</span>
        <strong className="status-time">{clock(seconds)}</strong>
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
