import Clock from '../components/Clock'
import MiniCalendar from '../components/MiniCalendar'
import Pomodoro from '../components/Pomodoro'
import TimetableGrid from '../components/TimetableGrid'
import Todo from '../components/Todo'
import Weather from '../components/Weather'
import { classes, funFacts } from '../data/school'
import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useAuth, workspaceOf } from '../lib/AuthContext'
import { subjectEmoji } from '../lib/emoji'
import DeskPet from '../components/DeskPet'
import ComingUp from '../components/ComingUp'
import HomePractice from '../components/HomePractice'
import RecentNotes from '../components/RecentNotes'
import Reminders from '../components/Reminders'

export default function Home() {
  const fact = useMemo(() => funFacts[new Date().getDate() % funFacts.length], [])
  const { studio } = useAuth()

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
            <span className="hand">Right now </span> · Flix flip clock
          </h3>
          <Clock />
        </section>
        <section className="card span-4">
          <h3>Weather on the Mekong</h3>
          <Weather />
        </section>

        <ComingUp workspaces={studio.workspaces} />

        <section className="card span-12">
          <h3>Homework center</h3>
          <p className="meta" style={{ marginTop: 0 }}>
            All open assignments, next-class due dates, and a 24-hour email reminder before they’re due.
          </p>
          <Link className="btn" to="/homework" style={{ marginTop: 8 }}>
            Open homework center
          </Link>
        </section>

        <RecentNotes workspaces={studio.workspaces} />

        <HomePractice />

        <Reminders />

        <section className="span-12">
          <h3 className="hand" style={{ marginBottom: 10 }}>
            Main resources
          </h3>
          <div className="resource-row">
            <a
              className="resource-card"
              href="https://cisp.students.isams.cloud/#/"
              target="_blank"
              rel="noreferrer"
            >
              <p className="kicker">Student portal</p>
              <h4>iSAMS</h4>
              <p>Timetable extras, reports, and the official student desk.</p>
            </a>
            <a
              className="resource-card resource-card-alt"
              href="https://myapps.classlink.com/home"
              target="_blank"
              rel="noreferrer"
            >
              <p className="kicker">App tray</p>
              <h4>ClassLink</h4>
              <p>Google, ManageBac, and the rest of the CIS apps in one door.</p>
            </a>
          </div>
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
          <p className="meta" style={{ marginTop: 0 }}>
            Mood and productivity logs live on Check-in — with colors you can tune.
          </p>
          <Link className="btn" to="/check-in" style={{ marginTop: 10 }}>
            Open check-in
          </Link>
        </section>
        <div className="span-7">
          <DeskPet />
        </div>

        <section className="span-12">
          <h3 className="hand" style={{ marginBottom: 10 }}>
            Class pages
          </h3>
          <div className="class-grid">
            {classes.map((c) => (
              <Link key={c.id} className="class-tile" style={{ borderLeftColor: c.color }} to={`/class/${c.id}`}>
                <h4>
                  {subjectEmoji(c.id, workspaceOf(studio, c.id).classEmoji)} {c.name}
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
