import {
  clonePracticeSet,
  practiceBank,
  type PracticeSubjectId,
} from '../data/practiceBanks'
import { newId, type NoteItem } from '../lib/workspace'
import PracticeDrill from './PracticeDrill'

type Props = {
  classId: string
  note: NoteItem
  onPatch: (patch: Partial<NoteItem>) => void
}

export default function NotePractice({ classId, note, onPatch }: Props) {
  const bank = practiceBank(classId)
  if (!note.practiceHub || !bank) return null

  const bySet = note.practiceBySet ?? {}

  return (
    <div className="field note-practice">
      <span className="meta">Practice tests · unofficial</span>
      <p className="meta" style={{ marginTop: 4 }}>
        Four drills nested in this note — one per topic set.
      </p>
      {bank.sets.map((set) => (
        <PracticeDrill
          key={set.id}
          questions={bySet[set.id] ?? []}
          title={set.title}
          subtitle={set.blurb}
          emptyHint={set.blurb}
          generateLabel={`Start ${set.title}`}
          onGenerate={() =>
            onPatch({
              practiceBySet: {
                ...bySet,
                [set.id]: clonePracticeSet(classId as PracticeSubjectId, set.id, newId),
              },
            })
          }
          onClear={() => {
            const next = { ...bySet }
            delete next[set.id]
            onPatch({ practiceBySet: next })
          }}
        />
      ))}
    </div>
  )
}
