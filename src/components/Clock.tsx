import { useEffect, useMemo, useState } from 'react'
import { FlipBoard, PixelLcd } from './FlipBoard'

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

  const [hhmm, ss] = [phnom.slice(0, 5), phnom.slice(6)]

  return (
    <div className="flix-wrap">
      <div className="flix-case">
        <p className="flix-label">Phnom Penh</p>
        <div className="flix-row">
          <FlipBoard value={hhmm} />
          <PixelLcd value={ss} />
        </div>
      </div>
      <div className="flix-meta">
        <div className="date">{date}</div>
        <div className="tz">
          <span className="pill">Campus time</span>
          <span className="pill">Alberta {calgary}</span>
        </div>
      </div>
    </div>
  )
}
