import { workTags, type WorkTag } from '../lib/workspace'

export default function TaskTagPick({
  value,
  onChange,
}: {
  value: WorkTag
  onChange: (next: WorkTag) => void
}) {
  return (
    <div className="task-tag-pick" role="group" aria-label="Assignment type">
      {workTags.map((t) => (
        <button
          key={t.id}
          type="button"
          className={value === t.id ? 'on' : ''}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
