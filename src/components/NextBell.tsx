import { Link } from 'react-router-dom'
import { activeDay, classes, formatCountdown, upcomingBell } from '../data/school'
import { useAuth, workspaceOf } from '../lib/AuthContext'
import { subjectEmoji } from '../lib/emoji'

export default function NextBell({ now, compact = false }: { now: Date; compact?: boolean }) {
  const { studio } = useAuth()
  const up = upcomingBell(now)
  const box = compact ? 'next-bell next-bell-compact' : 'next-bell'
  if (!up) {
    return <p className={`meta ${compact ? 'next-bell-empty-compact' : 'next-bell-empty'}`}>No more bells on this cycle.</p>
  }

  const left = formatCountdown(up.startsAt - now.getTime())
  const today = activeDay(now)
  const when = today === up.day ? up.start : `${up.day} ${up.start}`

  if (up.cell === 'lunch') {
    return (
      <div className={box}>
        <span className="meta">Next period</span>
        <strong>Lunch</strong>
        <p>
          {when}–{up.end} · in {left}
        </p>
      </div>
    )
  }

  const course = classes.find((c) => c.id === up.cell)
  if (!course) return null
  const emoji = subjectEmoji(course.id, workspaceOf(studio, course.id).classEmoji)

  return (
    <div className={box}>
      <span className="meta">Next period</span>
      <Link to={`/class/${course.id}`}>
        {emoji} {course.short}
      </Link>
      <p>
        {course.room} · {when}–{up.end} · in {left}
      </p>
    </div>
  )
}
