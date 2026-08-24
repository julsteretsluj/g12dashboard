import { useState } from 'react'
import { funFacts } from '../data/school'

export default function Studio() {
  const [fact, setFact] = useState(funFacts[0])
  const [draw, setDraw] = useState('')

  return (
    <>
      <p className="kicker">Whimsy lab</p>
      <h2 style={{ marginTop: 0, fontSize: 36, letterSpacing: '-0.04em' }}>
        Funky corners, still on brand.
      </h2>
      <p className="lede" style={{ color: 'var(--muted)', maxWidth: '54ch' }}>
        Maple leaves, river maps, and embeds that do not belong in a staff
        handbook. They do belong next to homework.
      </p>

      <div className="bento" style={{ marginTop: 22 }}>
        <section className="card span-2">
          <h3>Koh Pich from above</h3>
          <iframe
            className="embed tall"
            title="Map of CIS Koh Pich"
            src="https://maps.google.com/maps?q=Canadian%20International%20School%20of%20Phnom%20Penh%20Koh%20Pich&t=&z=15&ie=UTF8&iwloc=&output=embed"
          />
        </section>

        <section className="card">
          <h3>Campus-adjacent rain</h3>
          <iframe
            className="embed"
            style={{ minHeight: 220 }}
            title="Rain sounds"
            src="https://www.youtube.com/embed/q76bMs-NwRk"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </section>

        <section className="card">
          <h3>Pocket planetarium</h3>
          <iframe
            className="embed"
            style={{ minHeight: 220 }}
            title="Stellarium"
            src="https://stellarium-web.org/"
          />
        </section>

        <section className="card">
          <h3>Wikipedia hole: Phnom Penh</h3>
          <iframe
            className="embed tall"
            title="Phnom Penh"
            src="https://en.wikipedia.org/wiki/Phnom_Penh"
          />
        </section>

        <section className="card">
          <h3>Draw a maple in ASCII</h3>
          <textarea
            className="note-box"
            rows={8}
            value={draw}
            onChange={(e) => setDraw(e.target.value)}
            placeholder={'    *\n   ***\n  *****\n    |'}
            style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}
          />
        </section>

        <section className="doodle">
          <p className="hand" style={{ margin: 0 }}>
            Shuffle a CIS scrap
          </p>
          <p>{fact}</p>
          <button
            className="btn"
            type="button"
            onClick={() => setFact(funFacts[Math.floor(Math.random() * funFacts.length)])}
          >
            Another scrap
          </button>
        </section>

        <section className="card span-2">
          <h3>Official school site</h3>
          <iframe className="embed tall" title="CISP" src="https://www.cisp.edu.kh/" />
        </section>
      </div>
    </>
  )
}
