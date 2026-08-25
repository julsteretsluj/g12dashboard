import { useEffect } from 'react'
import { petLine, petMood, pulsePet, setPet, usePet, type PetStats } from '../lib/pet'

function PixelPip({ mood }: { mood: ReturnType<typeof petMood> }) {
  return (
    <div className={`pip-stage pip-${mood}`} aria-hidden>
      <div className="pip-egg">
        <div className="pip-screen">
          <svg className="pip-sprite" viewBox="0 0 16 16" shapeRendering="crispEdges">
            <rect width="16" height="16" fill="#16382c" />
            <rect x="4" y="3" width="8" height="2" fill="#c0292d" />
            <rect x="3" y="5" width="10" height="7" fill="#e8c39a" />
            <rect x="3" y="5" width="10" height="2" fill="#c0292d" />
            <rect x="5" y="7" width="2" height="2" fill="#1d1d1f" />
            <rect x="9" y="7" width="2" height="2" fill="#1d1d1f" />
            {mood === 'happy' && <rect x="6" y="10" width="4" height="1" fill="#1d1d1f" />}
            {mood === 'idle' && <rect x="7" y="10" width="2" height="1" fill="#1d1d1f" />}
            {mood === 'hungry' && <rect x="6" y="10" width="4" height="2" fill="#1d1d1f" />}
            {mood === 'sad' && <rect x="6" y="11" width="4" height="1" fill="#1d1d1f" />}
            {mood === 'sleepy' && <rect x="5" y="8" width="6" height="1" fill="#1d1d1f" />}
            <rect x="2" y="12" width="4" height="2" fill="#c0292d" />
            <rect x="10" y="12" width="4" height="2" fill="#c0292d" />
            <rect x="6" y="13" width="4" height="2" fill="#0c4160" />
          </svg>
          {mood === 'sleepy' && <span className="pip-zzz">ᴢ</span>}
        </div>
      </div>
    </div>
  )
}

function Meter({ label, value, invert }: { label: string; value: number; invert?: boolean }) {
  const hot = invert ? value > 70 : value < 30
  return (
    <div className="pip-meter">
      <span>{label}</span>
      <div className="pip-bar">
        <i style={{ width: `${value}%`, background: hot ? 'var(--red)' : 'var(--palm)' }} />
      </div>
    </div>
  )
}

function care(pet: PetStats, kind: 'feed' | 'play' | 'nap') {
  if (kind === 'feed') {
    setPet({ ...pet, hunger: Math.max(0, pet.hunger - 28), happy: Math.min(100, pet.happy + 6) })
    return
  }
  if (kind === 'play') {
    setPet({ ...pet, happy: Math.min(100, pet.happy + 22), energy: Math.max(0, pet.energy - 12) })
    return
  }
  setPet({ ...pet, energy: Math.min(100, pet.energy + 32), hunger: Math.min(100, pet.hunger + 6) })
}

export default function DeskPet({ compact = false }: { compact?: boolean }) {
  const pet = usePet()
  const mood = petMood(pet)

  useEffect(() => {
    const id = window.setInterval(() => pulsePet(), 20_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section className={`card pip-card ${compact ? 'pip-compact' : ''}`}>
      <h3>
        <span className="hand">Desk pet </span>
        {compact ? '· Pip' : '· Pip the pixel bear'}
      </h3>
      <div className="pip-row">
        <PixelPip mood={mood} />
        {!compact && (
          <div className="pip-stats">
            <Meter label="Hunger" value={pet.hunger} invert />
            <Meter label="Happy" value={pet.happy} />
            <Meter label="Energy" value={pet.energy} />
            <p className="meta">{petLine(mood)}</p>
          </div>
        )}
      </div>
      <div className="pip-actions">
        <button className="btn" type="button" onClick={() => care(pet, 'feed')}>
          Feed
        </button>
        <button className="btn ghost" type="button" onClick={() => care(pet, 'play')}>
          Play
        </button>
        <button className="btn ghost" type="button" onClick={() => care(pet, 'nap')}>
          Nap
        </button>
      </div>
    </section>
  )
}
