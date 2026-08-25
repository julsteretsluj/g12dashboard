import Clock from '../components/Clock'
import MiniCalendar from '../components/MiniCalendar'
import Pomodoro from '../components/Pomodoro'
import TimetableGrid from '../components/TimetableGrid'
import Todo from '../components/Todo'
import Weather from '../components/Weather'
import { classes, funFacts } from '../data/school'
import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'

export default function Home() {
  const fact = useMemo(() => funFacts[new Date().getDate() % funFacts.length], [])
  const [mood, setMood] = useState<string | null>(null)

  return (
    <>
      <header className="hero">
        <div>
          <p className="kicker">Canadian International School of Phnom Penh</p>
          <h2>A quiet desk for loud school days.</h2>
          <p className="lede">
            Red crest, Koh Pich light, Alberta clocks. Timetable, classes, and a
            few silly corners — the student version of a well-kept notebook.
          </p>
        </div>
        <img className="crest-float" src="/cisp-crest.png" alt="CIS circular crest" />
      </header>

      <div className="bento">
        <section className="card wide span-8">
          <h3>
            <span className="hand">Right now </span> · campus clock
          </h3>
          <Clock />
        </section>
        <section className="card span-4">
          <h3>Weather on the Mekong</h3>
          <Weather />
        </section>

        <section className="card span-7">
          <h3>To-do, Bear-sized</h3>
          <Todo />
        </section>
        <section className="card span-5">
          <h3>This month</h3>
          <MiniCalendar />
        </section>

        <section className="card span-12 wide">
          <h3>
            This week’s bells <Link to="/timetable" style={{ float: 'right', fontSize: 13, color: 'var(--red)' }}>Open timetable</Link>
          </h3>
          <TimetableGrid />
        </section>

        <section className="card span-5">
          <Pomodoro />
        </section>
        <section className="doodle span-7">
          <div className="bear">🐻</div>
          <p style={{ margin: '8px 0 0' }}>
            <strong>Bear of the hour:</strong> {fact}
          </p>
        </section>

        <section className="card span-5">
          <h3>How’s the day sitting?</h3>
          <div className="mood">
            {['😌', '🤓', '😴', '🔥', '🌧️'].map((m) => (
              <button key={m} className={mood === m ? 'on' : ''} type="button" onClick={() => setMood(m)}>
                {m}
              </button>
            ))}
          </div>
          <p className="meta" style={{ marginTop: 10 }}>
            {mood ? 'Noted. No grade for feelings.' : 'Tap a face. We will not tell Advisory.'}
          </p>
        </section>
        <section className="card span-7">
          <h3>Lo-fi for Lab 2</h3>
          <iframe
            className="embed audio"
            title="Study playlist"
            src="https://open.spotify.com/embed/playlist/0vvXsWCC9xrXsKd4xfNRSN?utm_source=generator&theme=0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </section>

        <section className="span-12">
          <h3 className="hand" style={{ marginBottom: 10 }}>
            Class pages
          </h3>
          <div className="class-grid">
            {classes.map((c) => (
              <Link key={c.id} className="class-tile" style={{ borderLeftColor: c.color }} to={`/class/${c.id}`}>
                <h4>
                  {c.emoji} {c.name}
                </h4>
                <p>
                  {c.teacher} · {c.room}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
