import { Link } from 'react-router-dom'
import { bells, classes, days, timetableCell } from '../data/school'

export default function TimetableGrid() {
  return (
    <div className="table-wrap">
      <table className="tt">
        <thead>
          <tr>
            <th>Bell</th>
            {days.map((d) => (
              <th key={d}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bells.map((b, i) => (
            <tr key={b.start}>
              <th>
                {b.start}
                <div className="meta">{b.end}</div>
              </th>
              {days.map((d) => {
                const id = timetableCell(d, i)
                const c = classes.find((x) => x.id === id)
                if (!c) return <td key={d}><span className="cell empty">Study / flex</span></td>
                return (
                  <td key={d}>
                    <Link className="cell" style={{ background: c.color }} to={`/class/${c.id}`}>
                      {c.emoji} {c.name.split(':')[0]}
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
