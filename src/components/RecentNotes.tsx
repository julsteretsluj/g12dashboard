import { Link } from 'react-router-dom'
import { prettyDate } from './DateField'
import { recentNotesFromWorkspaces, type RecentNote } from '../lib/recentNotes'
import type { Workspace } from '../lib/workspace'

export default function RecentNotes({ workspaces }: { workspaces: Record<string, Workspace> }) {
  const items = recentNotesFromWorkspaces(workspaces)

  return (
    <section className="card span-12">
      <h3>Recent notes</h3>
      {items.length === 0 && (
        <p className="meta">Notes from every class land here once you write them.</p>
      )}
      <div className="coming-list">
        {items.map((item) => (
          <RecentRow key={item.key} item={item} />
        ))}
      </div>
    </section>
  )
}

function RecentRow({ item }: { item: RecentNote }) {
  const when = item.date ? prettyDate(item.date) : ''
  const meta = [item.context, item.topic, when].filter(Boolean).join(' · ')
  return (
    <Link className="coming-row" to={item.href} style={{ borderLeftColor: item.color }}>
      <span className="coming-emoji" aria-hidden>
        {item.emoji}
      </span>
      <div>
        <strong>{item.title}</strong>
        <p>{meta || item.classShort}</p>
        {item.preview ? <p className="recent-note-preview">{item.preview}</p> : null}
      </div>
    </Link>
  )
}
