import { Link } from 'react-router-dom'
import { prettyDate } from './DateField'
import { comingFromWorkspaces, type ComingItem } from '../lib/upcoming'
import { workTagLabel } from '../lib/workspace'
import type { Workspace } from '../lib/workspace'

export default function ComingUp({ workspaces }: { workspaces: Record<string, Workspace> }) {
  const items = comingFromWorkspaces(workspaces)

  return (
    <section className="card span-12">
      <h3>Coming up</h3>
      {items.length === 0 && (
        <p className="meta">Dated assignments and tests from your classes land here.</p>
      )}
      <div className="coming-list">
        {items.map((item) => (
          <ComingRow key={item.key} item={item} />
        ))}
      </div>
    </section>
  )
}

function ComingRow({ item }: { item: ComingItem }) {
  const when = item.overdue ? `Overdue · ${prettyDate(item.date)}` : prettyDate(item.date)
  const kind =
    item.kind === 'test' ? 'Test' : item.workTag ? workTagLabel(item.workTag) : 'Assignment'
  return (
    <Link className="coming-row" to={item.href} style={{ borderLeftColor: item.color }}>
      <span className="coming-emoji" aria-hidden>
        {item.emoji}
      </span>
      <div>
        <strong>{item.title}</strong>
        <p>
          {item.classShort} · {kind} · {when}
        </p>
      </div>
    </Link>
  )
}
