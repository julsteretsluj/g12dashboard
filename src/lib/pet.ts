import { useSyncExternalStore } from 'react'

export type PetStats = {
  hunger: number
  happy: number
  energy: number
  last: number
}

const KEY = 'cis-pet-v1'
const listeners = new Set<() => void>()

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)))
}

export function emptyPet(): PetStats {
  return { hunger: 28, happy: 72, energy: 80, last: Date.now() }
}

function read(): PetStats {
  try {
    const raw = localStorage.getItem(KEY)
    const p = raw ? ({ ...emptyPet(), ...JSON.parse(raw) } as PetStats) : emptyPet()
    return tickPet(p)
  } catch {
    return emptyPet()
  }
}

let state: PetStats = typeof localStorage === 'undefined' ? emptyPet() : read()

function emit() {
  localStorage.setItem(KEY, JSON.stringify(state))
  listeners.forEach((l) => l())
}

export function tickPet(p: PetStats): PetStats {
  const hours = Math.max(0, (Date.now() - p.last) / 3_600_000)
  if (hours < 0.02) return p
  return {
    hunger: clamp(p.hunger + hours * 8),
    happy: clamp(p.happy - hours * 4),
    energy: clamp(p.energy - hours * 3),
    last: Date.now(),
  }
}

export function petMood(p: PetStats): 'hungry' | 'sleepy' | 'sad' | 'happy' | 'idle' {
  if (p.hunger >= 72) return 'hungry'
  if (p.energy <= 28) return 'sleepy'
  if (p.happy <= 32) return 'sad'
  if (p.happy >= 78 && p.hunger < 40) return 'happy'
  return 'idle'
}

export function petLine(mood: ReturnType<typeof petMood>) {
  if (mood === 'hungry') return 'Pip is staring at your snack like it’s a diploma.'
  if (mood === 'sleepy') return 'Pip could nap through Block 3. Softly poke, or let them rest.'
  if (mood === 'sad') return 'Pip wants a game, not another worksheet.'
  if (mood === 'happy') return 'Pip is buzzing. Koh Pich sunshine mode.'
  return 'Pip is parked on the desk. Company, not a grade.'
}

export function setPet(next: PetStats) {
  state = { ...next, last: Date.now() }
  emit()
}

export function pulsePet() {
  state = tickPet(state)
  emit()
}

export function usePet() {
  const pet = useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange)
      return () => listeners.delete(onStoreChange)
    },
    () => state,
    emptyPet,
  )
  return pet
}
