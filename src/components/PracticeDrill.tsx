import { useState } from 'react'
import type { PracticeQ } from '../data/practiceNeurons'

export default function PracticeDrill({
  questions,
  onClear,
  onGenerate,
  title = 'Practice',
  subtitle = 'Unofficial desk drill — not the official mark.',
  emptyHint = 'Generate a set when you want a quick check.',
  generateLabel = 'Generate practice',
}: {
  questions: PracticeQ[]
  onClear: () => void
  onGenerate: () => void
  title?: string
  subtitle?: string
  emptyHint?: string
  generateLabel?: string
}) {
  const [picks, setPicks] = useState<Record<string, number>>({})
  const [checked, setChecked] = useState(false)

  const answered = questions.filter((q) => picks[q.id] != null).length
  const right = questions.filter((q) => picks[q.id] === q.correct).length

  if (questions.length === 0) {
    return (
      <div className="practice">
        <h3>{title}</h3>
        <p className="meta">{emptyHint}</p>
        <button className="btn" type="button" onClick={onGenerate} style={{ marginTop: 8 }}>
          {generateLabel}
        </button>
      </div>
    )
  }

  return (
    <div className="practice">
      <div className="practice-head">
        <div>
          <h3>{title}</h3>
          <p className="meta">
            {checked
              ? `${right} / ${questions.length} correct`
              : `${answered} / ${questions.length} answered · ${subtitle}`}
          </p>
        </div>
        <div className="todo-add" style={{ marginTop: 0 }}>
          <button
            className="btn"
            type="button"
            onClick={() => setChecked(true)}
            disabled={answered < questions.length}
          >
            Check
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={() => {
              setPicks({})
              setChecked(false)
            }}
          >
            Reset
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={() => {
              setPicks({})
              setChecked(false)
              onGenerate()
            }}
          >
            New set
          </button>
          <button className="btn ghost" type="button" onClick={onClear}>
            Remove
          </button>
        </div>
      </div>
      {questions.map((q, i) => {
        const pick = picks[q.id]
        const show = checked && pick != null
        const good = pick === q.correct
        return (
          <fieldset key={q.id} className={`practice-q ${show ? (good ? 'is-good' : 'is-miss') : ''}`}>
            <legend>
              {i + 1}. {q.prompt}
            </legend>
            {q.choices.map((c, ci) => (
              <label key={ci} className="practice-choice">
                <input
                  type="radio"
                  name={q.id}
                  checked={pick === ci}
                  onChange={() => {
                    setChecked(false)
                    setPicks((p) => ({ ...p, [q.id]: ci }))
                  }}
                />
                <span>{c}</span>
              </label>
            ))}
            {show && (
              <p className="practice-why">
                {good ? 'Yes. ' : `Answer: ${q.choices[q.correct]}. `}
                {q.explain}
              </p>
            )}
          </fieldset>
        )
      })}
    </div>
  )
}
