import { useState } from 'react'
import type { PracticeQ } from '../data/practiceNeurons'

export default function PracticeDrill({
  questions,
  onClear,
  onGenerate,
}: {
  questions: PracticeQ[]
  onClear: () => void
  onGenerate: () => void
}) {
  const [picks, setPicks] = useState<Record<string, number>>({})
  const [checked, setChecked] = useState(false)

  const answered = questions.filter((q) => picks[q.id] != null).length
  const right = questions.filter((q) => picks[q.id] === q.correct).length

  if (questions.length === 0) {
    return (
      <div className="practice">
        <h3>Practice</h3>
        <p className="meta">A nested drill for this test — not the official mark.</p>
        <button className="btn" type="button" onClick={onGenerate} style={{ marginTop: 8 }}>
          Generate neuron practice
        </button>
      </div>
    )
  }

  return (
    <div className="practice">
      <div className="practice-head">
        <div>
          <h3>Practice · Neurons</h3>
          <p className="meta">
            {checked
              ? `${right} / ${questions.length} correct`
              : `${answered} / ${questions.length} answered · Bio 30 style, unofficial`}
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
            {show && <p className="practice-why">{good ? 'Yes. ' : `Answer: ${q.choices[q.correct]}. `}{q.explain}</p>}
          </fieldset>
        )
      })}
    </div>
  )
}
