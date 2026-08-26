import MoodCalendar from '../components/MoodCalendar'
import ProductivityCalendar from '../components/ProductivityCalendar'

export default function CheckInPage() {
  return (
    <>
      <p className="kicker">Private desk log · Phnom Penh days</p>
      <h2 style={{ marginTop: 0, fontSize: 36, letterSpacing: '-0.04em' }}>Check-in</h2>
      <p className="meta" style={{ maxWidth: '54ch', marginBottom: 8 }}>
        Mood and productivity calendars with your own emoji keys and colors. Flip months to see the pattern.
      </p>

      <section className="card" style={{ marginTop: 20 }}>
        <h3>Mood</h3>
        <p className="meta" style={{ marginTop: 0 }}>
          Tap a day, then a key. Colors tint the calendar — change them anytime.
        </p>
        <MoodCalendar />
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <h3>Productivity</h3>
        <p className="meta" style={{ marginTop: 0 }}>
          Same idea for how the work went — custom levels you can review later.
        </p>
        <ProductivityCalendar />
      </section>
    </>
  )
}
