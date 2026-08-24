import { useEffect, useMemo, useState } from 'react'

export default function Clock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const phnom = useMemo(
    () =>
      new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Phnom_Penh',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now),
    [now],
  )

  const calgary = useMemo(
    () =>
      new Intl.DateTimeFormat('en-GB', {
        timeZone: 'America/Edmonton',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(now),
    [now],
  )

  const date = useMemo(
    () =>
      new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Phnom_Penh',
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(now),
    [now],
  )

  const parts = useMemo(() => {
    const t = new Date(
      now.toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' }),
    )
    return { h: t.getHours(), m: t.getMinutes(), s: t.getSeconds() }
  }, [now])

  const hDeg = ((parts.h % 12) / 12) * 360 + (parts.m / 60) * 30
  const mDeg = (parts.m / 60) * 360 + (parts.s / 60) * 6
  const sDeg = (parts.s / 60) * 360

  return (
    <div className="clock-block">
      <div className="analog" aria-hidden>
        <div className="hand-line hour" style={{ transform: `rotate(${hDeg}deg)` }} />
        <div className="hand-line minute" style={{ transform: `rotate(${mDeg}deg)` }} />
        <div className="hand-line second" style={{ transform: `rotate(${sDeg}deg)` }} />
        <div className="dot" />
      </div>
      <div className="digital">
        <div className="time">{phnom}</div>
        <div className="date">{date}</div>
        <div className="tz">
          <span className="pill">Phnom Penh</span>
          <span className="pill">Alberta {calgary}</span>
        </div>
      </div>
    </div>
  )
}
