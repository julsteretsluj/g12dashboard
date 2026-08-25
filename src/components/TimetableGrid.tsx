import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { activeDay, activePeriod, bells, classes, dayCycle, days, timetableCell } from '../data/school'
import { useAuth, workspaceOf } from '../lib/AuthContext'
import { subjectEmoji } from '../lib/emoji'

export default function TimetableGrid() {
  const [now, setNow] = useState(() => new Date())
  const { studio } = useAuth()
  const today = activeDay(now)
  const period = activePeriod(now)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="table-wrap">
      <table className="tt">
        <thead>
          <tr>
            <th>Bell</th>
            {days.map((d, i) => (
              <th key={d} className={today === d ? 'now-day' : undefined}>
                {d}
                <div className="meta">{dayCycle[i]}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bells.map((b, i) => (
            <tr key={b.start} className={period === i ? 'now-row' : undefined}>
              <th className={period === i ? 'now-bell' : undefined}>
                {b.start}
                <div className="meta">{b.end}</div>
              </th>
              {days.map((d) => {
                const id = timetableCell(d, i)
                const here = today === d && period === i
                const col = today === d
                if (id === 'lunch') {
                  return (
                    <td key={d} className={`${col ? 'now-col' : ''} ${here ? 'now-hit' : ''}`.trim()}>
                      <span className={`cell lunch ${here ? 'now' : ''}`}>
                        Lunch
                        <small>{here ? 'Now · 11:25–12:10' : '11:25–12:10'}</small>
                      </span>
                    </td>
                  )
                }
                const c = classes.find((x) => x.id === id)
                if (!c)
                  return (
                    <td key={d} className={`${col ? 'now-col' : ''} ${here ? 'now-hit' : ''}`.trim()}>
                      <span className={`cell empty ${here ? 'now' : ''}`}>
                        {here ? 'Now · no class' : 'No class'}
                      </span>
                    </td>
                  )
                return (
                  <td key={d} className={`${col ? 'now-col' : ''} ${here ? 'now-hit' : ''}`.trim()}>
                    <Link className={`cell ${here ? 'now' : ''}`} style={{ background: c.color }} to={`/class/${c.id}`}>
                      {here ? 'Now · ' : ''}
                      {subjectEmoji(c.id, workspaceOf(studio, c.id).classEmoji)} {c.short}
                      <small>{c.room}</small>
                    </Link>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
