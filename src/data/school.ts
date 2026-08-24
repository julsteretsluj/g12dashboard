export type ClassInfo = {
  id: string
  name: string
  short: string
  teacher: string
  room: string
  color: string
  emoji: string
  blurb: string
}

export const classes: ClassInfo[] = [
  {
    id: 'homeroom',
    name: 'Homeroom',
    short: 'Homeroom',
    teacher: 'Advisory',
    room: 'Advisory',
    color: '#C0292D',
    emoji: '🐻',
    blurb: 'Attendance, announcements, and the quiet start before 504.',
  },
  {
    id: 'bio',
    name: 'Biology 30',
    short: 'Bio 30',
    teacher: 'Science',
    room: '504',
    color: '#5C9E3D',
    emoji: '🧬',
    blurb: 'Alberta Bio 30 — cells, energy, genetics, and the lab in room 504.',
  },
  {
    id: 'social',
    name: 'Social Studies 30-1',
    short: 'Social 30-1',
    teacher: 'Humanities',
    room: '208',
    color: '#FF8D3D',
    emoji: '🗺️',
    blurb: 'Ideology, liberalism, and the source analysis that lives on diploma day.',
  },
  {
    id: 'cts',
    name: 'CTS',
    short: 'CTS',
    teacher: 'Makerspace',
    room: 'Makerspace',
    color: '#0C4160',
    emoji: '🛠️',
    blurb: 'Career and Technology Studies — build it, print it, debug it, then name it.',
  },
  {
    id: 'art',
    name: 'Visual Arts',
    short: 'Visual Arts',
    teacher: 'Studio',
    room: '310',
    color: '#C0292D',
    emoji: '🎨',
    blurb: 'Room 310 — process, critique, and the courage to leave a canvas messy.',
  },
]

export const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const

/** Homeroom opens the day. Lunch is 11:25–12:10. Only four courses besides that. */
export const bells = [
  { start: '07:50', end: '08:10' },
  { start: '08:15', end: '09:25' },
  { start: '09:30', end: '10:40' },
  { start: '11:25', end: '12:10' },
  { start: '12:15', end: '13:25' },
  { start: '13:30', end: '14:40' },
]

const grid: Record<(typeof days)[number], (string | null)[]> = {
  Mon: ['homeroom', 'bio', 'social', 'lunch', 'cts', 'art'],
  Tue: ['homeroom', 'social', 'bio', 'lunch', 'art', 'cts'],
  Wed: ['homeroom', 'bio', 'art', 'lunch', 'cts', 'social'],
  Thu: ['homeroom', 'social', 'cts', 'lunch', 'bio', 'art'],
  Fri: ['homeroom', 'art', 'bio', 'lunch', 'social', 'cts'],
}

export function timetableCell(day: (typeof days)[number], period: number) {
  return grid[day][period]
}

export const events = [
  { date: '2026-08-24', title: 'Week 4 — Koh Pich campus', tag: 'today' },
  { date: '2026-08-26', title: 'Year 12 graduation rehearsal', tag: 'arts' },
  { date: '2026-08-28', title: 'Celebrating the Arts evening', tag: 'arts' },
  { date: '2026-09-01', title: 'Soccer Academy fixture vs. rival', tag: 'sport' },
  { date: '2026-09-04', title: 'CAS river project', tag: 'cas' },
  { date: '2026-09-08', title: 'Diploma parent briefing', tag: 'school' },
]

export const funFacts = [
  'Koh Pich means Diamond Island — your campus sits on a river-made jewel.',
  'CIS is Alberta-accredited, which is why Calgary and Phnom Penh share a school year rhythm.',
  'The maple leaf on the crest is a cousin of the globe: Canada looking outward.',
  'LabelFrancÉducation: CIS was the first school in Cambodia to receive the seal.',
  'The CIS Bears mascot is unofficially allergic to unfinished CAS reflections.',
  'Bassac Garden campus is where the smallest Bears learn to line up like champions.',
]
