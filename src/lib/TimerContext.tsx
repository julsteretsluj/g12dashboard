import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from './AuthContext'

type TimerValue = {
  seconds: number
  running: boolean
  toggle: () => void
  reset: () => void
}

const TimerContext = createContext<TimerValue | null>(null)

export function TimerProvider({ children }: { children: ReactNode }) {
  const { studio } = useAuth()
  const length = Math.max(1, Math.round(studio.timer.minutes)) * 60
  const [frozen, setFrozen] = useState(length)
  const [endsAt, setEndsAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())

  const running = endsAt != null
  const seconds = running ? Math.max(0, Math.ceil((endsAt - now) / 1000)) : frozen

  useEffect(() => {
    if (!running) setFrozen(length)
  }, [length, running])

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (running && seconds === 0) {
      setEndsAt(null)
      setFrozen(0)
    }
  }, [running, seconds])

  const toggle = useCallback(() => {
    setEndsAt((end) => {
      if (end != null) {
        setFrozen(Math.max(0, Math.ceil((end - Date.now()) / 1000)))
        return null
      }
      const left = frozen > 0 ? frozen : length
      setFrozen(left)
      return Date.now() + left * 1000
    })
  }, [frozen, length])

  const reset = useCallback(() => {
    setEndsAt(null)
    setFrozen(length)
  }, [length])

  const value = useMemo(
    () => ({ seconds, running, toggle, reset }),
    [seconds, running, toggle, reset],
  )

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
}

export function useFocusTimer() {
  const ctx = useContext(TimerContext)
  if (!ctx) throw new Error('useFocusTimer needs TimerProvider')
  return ctx
}
