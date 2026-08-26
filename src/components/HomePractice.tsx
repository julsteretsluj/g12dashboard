import { Link } from 'react-router-dom'
import { classes } from '../data/school'
import { practiceBank, practiceSubjectIds } from '../data/practiceBanks'
import { useAuth, workspaceOf } from '../lib/AuthContext'
import { subjectEmoji } from '../lib/emoji'

export default function HomePractice() {
  const { studio } = useAuth()
  const subjects = classes.filter((c) => practiceSubjectIds.includes(c.id as (typeof practiceSubjectIds)[number]))

  return (
    <section className="span-12">
      <h3 className="hand" style={{ marginBottom: 10 }}>
        Practice tests
      </h3>
      <p className="meta" style={{ marginTop: 0, marginBottom: 12 }}>
        Quick unofficial drills for each class — not Homeroom, not the real mark.
      </p>
      <div className="class-grid">
        {subjects.map((c) => {
          const bank = practiceBank(c.id)
          if (!bank) return null
          return (
            <Link
              key={c.id}
              className="class-tile"
              style={{ borderLeftColor: c.color }}
              to={`/practice/${c.id}`}
            >
              <h4>
                {subjectEmoji(c.id, workspaceOf(studio, c.id).classEmoji)} {c.short}
              </h4>
              <p>{bank.questions.length} questions · open drill</p>
              <p className="class-tile-blurb">{bank.blurb}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
