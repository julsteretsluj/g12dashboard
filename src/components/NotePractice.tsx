import {
  clonePracticeSet,
  practiceBank,
  type PracticeSubjectId,
} from '../data/practiceBanks'
import { eyeAnatomyLabels, eyeAnatomyModel3d } from '../data/eyeAnatomy'
import { newId, type NoteItem } from '../lib/workspace'
import PracticeDrill from './PracticeDrill'
import LabelQuiz from './LabelQuiz'

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
        Drills nested in this note — MCQ sets
        {classId === 'bio' ? ', plus an eye labeling quiz' : ''}.
      </p>
      {classId === 'bio' && (
        <LabelQuiz
          title="Eye anatomy · label the diagram"
          subtitle="Fill each structure, then Check — capitals and small typos are fine"
          imageSrc="/eye-anatomy.png"
          imageAlt="Anatomy of the human eye cross-section with blank label boxes"
          labels={eyeAnatomyLabels}
          model3d={eyeAnatomyModel3d}
        />
      )}
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
