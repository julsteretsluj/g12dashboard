import { Link, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { classes } from '../data/school'
import { clonePracticeBank, practiceBank, type PracticeSubjectId } from '../data/practiceBanks'
import PracticeDrill from '../components/PracticeDrill'
import { newId } from '../lib/workspace'
import { useAuth, workspaceOf } from '../lib/AuthContext'
import { subjectEmoji } from '../lib/emoji'
import type { PracticeQ } from '../data/practiceNeurons'

export default function PracticePage() {
  const { id } = useParams()
  const course = classes.find((c) => c.id === id)
  const bank = id ? practiceBank(id) : null
  const { studio } = useAuth()
  const [questions, setQuestions] = useState<PracticeQ[]>([])

  useEffect(() => {
    if (id && practiceBank(id) && id !== 'homeroom') {
      setQuestions(clonePracticeBank(id as PracticeSubjectId, newId))
    } else {
      setQuestions([])
    }
  }, [id])

  const emoji = useMemo(() => {
    if (!course) return '📝'
    return subjectEmoji(course.id, workspaceOf(studio, course.id).classEmoji)
  }, [course, studio])

  if (!course || !bank || course.id === 'homeroom') {
    return (
      <p>
        No practice pack here. <Link to="/">Back to desk</Link>
      </p>
    )
  }

  return (
    <>
      <p className="crumbs">
        <Link to="/">Home</Link>
        <span> / Practice / {course.short}</span>
      </p>
      <header className="page-head">
        <div>
          <p className="kicker">Practice test · unofficial</p>
          <h2 style={{ margin: 0, fontSize: 32, letterSpacing: '-0.04em' }}>
            {emoji} {bank.title}
          </h2>
          <p className="lede" style={{ marginTop: 8 }}>
            {bank.blurb}
          </p>
        </div>
        <Link className="btn ghost" to="/">
          Back to desk
        </Link>
      </header>

      <section className="card wide">
        <PracticeDrill
          key={course.id}
          questions={questions}
          title={`Practice · ${course.short}`}
          subtitle="Desk drill, not a diploma mark"
          emptyHint={bank.blurb}
          generateLabel={`Generate ${course.short} practice`}
          onGenerate={() => setQuestions(clonePracticeBank(course.id as PracticeSubjectId, newId))}
          onClear={() => setQuestions([])}
        />
      </section>
    </>
  )
}
