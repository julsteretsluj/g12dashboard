import { useNavigate } from 'react-router-dom'
import { classes } from '../data/school'
import { practiceBank, practiceSubjectIds } from '../data/practiceBanks'
import { useAuth, workspaceOf } from '../lib/AuthContext'
import { subjectEmoji } from '../lib/emoji'
import { ensurePracticeHubNote } from '../lib/practiceNotes'
import { newId } from '../lib/workspace'

export default function HomePractice() {
  const { studio, patchWorkspace } = useAuth()
  const nav = useNavigate()
  const subjects = classes.filter((c) => practiceSubjectIds.includes(c.id as (typeof practiceSubjectIds)[number]))

  function openPractice(classId: string) {
    const ws = workspaceOf(studio, classId)
    const { ws: next, noteId } = ensurePracticeHubNote(ws, classId, newId)
    if (!noteId) return
    patchWorkspace(classId, next)
    nav(`/class/${classId}/note/${noteId}`)
  }

  return (
    <section className="span-12">
      <h3 className="hand" style={{ marginBottom: 10 }}>
        Practice tests
      </h3>
      <p className="meta" style={{ marginTop: 0, marginBottom: 12 }}>
        Four unofficial drills nested in a note for each class — not Homeroom, not the real mark.
      </p>
      <div className="class-grid">
        {subjects.map((c) => {
          const bank = practiceBank(c.id)
          if (!bank) return null
          return (
            <button
              key={c.id}
              type="button"
              className="class-tile class-tile-btn"
              style={{ borderLeftColor: c.color }}
              onClick={() => openPractice(c.id)}
            >
              <h4>
                {subjectEmoji(c.id, workspaceOf(studio, c.id).classEmoji)} {c.short}
              </h4>
              <p>4 drills in one note</p>
              <p className="class-tile-blurb">{bank.blurb}</p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
