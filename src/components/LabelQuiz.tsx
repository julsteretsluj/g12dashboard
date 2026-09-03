import { useMemo, useState } from 'react'
import type { AnatomyLabel } from '../data/eyeAnatomy'
import { answersMatch } from '../lib/fuzzyMatch'

type Props = {
  title: string
  subtitle?: string
  imageSrc: string
  imageAlt: string
  labels: AnatomyLabel[]
  /** Optional Sketchfab (or similar) embed for 3D reference */
  model3d?: {
    title: string
    src: string
    credit: string
    href: string
  }
}

export default function LabelQuiz({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  labels,
  model3d,
}: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const [show3d, setShow3d] = useState(true)

  const results = useMemo(() => {
    if (!checked) return null
    const map: Record<string, boolean> = {}
    for (const label of labels) {
      map[label.id] = answersMatch(answers[label.id] ?? '', label.accepted)
    }
    return map
  }, [checked, answers, labels])

  const right = results ? Object.values(results).filter(Boolean).length : 0
  const filled = labels.filter((l) => (answers[l.id] ?? '').trim()).length

  function reset() {
    setAnswers({})
    setChecked(false)
  }

  return (
    <div className="practice label-quiz">
      <div className="practice-head">
        <div>
          <h3>{title}</h3>
          <p className="meta">
            {checked
              ? `${right} / ${labels.length} correct · spelling can be a little off`
              : `${filled} / ${labels.length} filled · ${subtitle ?? 'Fill the blanks, then Check'}`}
          </p>
        </div>
        <div className="todo-add" style={{ marginTop: 0 }}>
          <button
            className="btn"
            type="button"
            onClick={() => setChecked(true)}
            disabled={filled < labels.length}
          >
            Check
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={() => {
              setChecked(false)
              setAnswers({})
            }}
          >
            Clear
          </button>
          <button className="btn ghost" type="button" onClick={reset}>
            Reset
          </button>
        </div>
      </div>

      <div className="label-quiz-refs">
        <figure className="label-quiz-figure">
          <img src={imageSrc} alt={imageAlt} className="label-quiz-img" />
          <figcaption className="meta">
            Match each numbered blank on the list to the empty boxes on the diagram.
          </figcaption>
        </figure>

        {model3d && (
          <div className="label-quiz-3d">
            <div className="label-quiz-3d-head">
              <h4 style={{ margin: 0 }}>{model3d.title}</h4>
              <button
                className="btn ghost"
                type="button"
                onClick={() => setShow3d((v) => !v)}
              >
                {show3d ? 'Hide 3D' : 'Show 3D'}
              </button>
            </div>
            {show3d && (
              <div className="label-quiz-3d-frame">
                <iframe
                  title={model3d.title}
                  src={model3d.src}
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  allowFullScreen
                />
              </div>
            )}
            <p className="meta" style={{ marginTop: 8 }}>
              Free reference — drag to spin.{' '}
              <a href={model3d.href} target="_blank" rel="noreferrer">
                {model3d.credit}
              </a>
            </p>
          </div>
        )}
      </div>

      <ol className="label-quiz-list">
        {labels.map((label) => {
          const show = checked
          const good = results?.[label.id]
          return (
            <li
              key={label.id}
              className={`label-quiz-row${show ? (good ? ' is-good' : ' is-miss') : ''}`}
            >
              <span className="label-quiz-num" aria-hidden>
                {label.n}
              </span>
              <div className="label-quiz-fields">
                <span className="meta">{label.hint}</span>
                <input
                  className="note-box field-control"
                  value={answers[label.id] ?? ''}
                  onChange={(e) => {
                    setChecked(false)
                    setAnswers((a) => ({ ...a, [label.id]: e.target.value }))
                  }}
                  placeholder={`Structure ${label.n}`}
                  autoComplete="off"
                  spellCheck={false}
                  aria-label={`Label ${label.n}: ${label.hint}`}
                />
                {show && (
                  <p className="practice-why">
                    {good ? 'Yes. ' : `Answer: ${label.answer}. `}
                    {!good && 'Close spellings still count next time.'}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
