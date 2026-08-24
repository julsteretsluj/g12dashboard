import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ClassPage from './pages/ClassPage'
import TimetablePage from './pages/TimetablePage'
import CalendarPage from './pages/CalendarPage'
import Studio from './pages/Studio'
import { classes } from './data/school'

export default function App() {
  return (
    <>
      <div className="leaves" aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="leaf"
            style={{
              left: `${8 + i * 12}%`,
              animationDuration: `${10 + i * 1.4}s`,
              animationDelay: `${i * 0.7}s`,
            }}
          >
            🍁
          </span>
        ))}
      </div>
      <div className="app">
      <aside className="sidebar">
        <NavLink to="/" className="brand" end>
          <img src="/cisp-crest.png" alt="CIS crest" />
          <div>
            <h1>CIS Studio</h1>
            <p>Koh Pich · Phnom Penh</p>
          </div>
        </NavLink>
        <nav className="nav">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/timetable">Timetable</NavLink>
          <NavLink to="/calendar">Calendar</NavLink>
          <NavLink to="/studio">Whimsy lab</NavLink>
          <div className="nav-label">Classes</div>
          {classes.map((c) => (
            <NavLink key={c.id} to={`/class/${c.id}`}>
              <span>{c.emoji}</span>
              {c.name.split(':')[0]}
            </NavLink>
          ))}
        </nav>
        <div className="side-note">
          <strong>Bears, quietly.</strong>
          A student desk for CIS — maple leaf, Mekong light, and the next bell.
        </div>
      </aside>
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/timetable" element={<TimetablePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/class/:id" element={<ClassPage />} />
        </Routes>
      </main>
      </div>
    </>
  )
}
