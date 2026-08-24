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

/** Homeroom, then 95-min blocks so Bio 30 lands 08:15–09:50. Lunch stays 11:25–12:10. */
export const bells = [
  { start: '07:50', end: '08:10' },
  { start: '08:15', end: '09:50' },
  { start: '09:55', end: '11:20' },
  { start: '11:25', end: '12:10' },
  { start: '12:15', end: '13:50' },
  { start: '13:55', end: '15:30' },
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
  { date: '2026-08-17', end: '2026-08-21', title: 'Academic Team Orientation', tag: 'staff' },
  { date: '2026-08-21', title: 'Orientation for new families SK–Grade 12 (no classes, offices open)', tag: 'start' },
  { date: '2026-08-24', title: 'First day of school for Grade 1–12', tag: 'start' },
  { date: '2026-08-24', end: '2026-08-25', title: 'BG Orientation', tag: 'start' },
  { date: '2026-08-24', end: '2026-08-25', title: 'Staggered entry for SK', tag: 'start' },
  { date: '2026-08-26', title: 'First full day for SK', tag: 'start' },
  { date: '2026-08-26', end: '2026-08-28', title: 'Staggered entry for NR–PK–JK', tag: 'start' },
  { date: '2026-08-31', title: 'Staggered entry for NR · half day for JK', tag: 'start' },
  { date: '2026-09-01', title: 'Half day for PK · staggered entry for NR', tag: 'start' },
  { date: '2026-09-02', title: 'Half day for NR', tag: 'start' },
  { date: '2026-09-07', title: 'First full day for NR–PK–JK', tag: 'start' },
  { date: '2026-10-08', title: 'Professional Development Day (no classes, offices open)', tag: 'pd' },
  { date: '2026-10-09', end: '2026-10-16', title: 'Pchum Ben holiday (no classes, offices closed)', tag: 'holiday' },
  { date: '2026-11-05', title: 'Parent–Teacher Conferences (evening)', tag: 'ptc' },
  { date: '2026-11-06', title: 'Parent–Teacher Conferences (no classes, offices open)', tag: 'ptc' },
  { date: '2026-11-09', title: 'Independence Day (no classes, offices closed)', tag: 'holiday' },
  { date: '2026-11-21', end: '2026-11-27', title: 'Water Festival holiday (no classes, offices closed)', tag: 'holiday' },
  { date: '2026-12-18', title: 'Last day of classes before Winter Break (half day)', tag: 'break' },
  { date: '2026-12-21', end: '2026-12-25', title: 'Winter Break (no classes, offices open) · Winter Camp', tag: 'break' },
  { date: '2026-12-28', end: '2026-12-31', title: 'Winter Break (no classes, offices closed)', tag: 'holiday' },
  { date: '2027-01-01', end: '2027-01-02', title: 'New Year’s Day (no classes, offices closed)', tag: 'holiday' },
  { date: '2027-01-04', end: '2027-01-06', title: 'Winter Break (no classes, offices open)', tag: 'break' },
  { date: '2027-01-07', title: 'Victory over Genocide Day (no classes, offices closed)', tag: 'holiday' },
  { date: '2027-01-08', title: 'Winter Break (no classes, offices open)', tag: 'break' },
  { date: '2027-01-11', title: 'School resumes', tag: 'start' },
  { date: '2027-02-03', title: 'Semester 1 ends', tag: 'term' },
  { date: '2027-02-04', end: '2027-02-08', title: 'Lunar New Year holiday (no classes, offices closed)', tag: 'holiday' },
  { date: '2027-02-09', title: 'Semester 2 starts', tag: 'term' },
  { date: '2027-03-01', end: '2027-03-05', title: 'Experience / Discovery Week', tag: 'special' },
  { date: '2027-03-08', title: 'International Women’s Day (no classes, offices closed)', tag: 'holiday' },
  { date: '2027-03-09', title: 'Professional Development Day (no classes, offices open)', tag: 'pd' },
  { date: '2027-04-08', title: 'Parent–Teacher Conferences (evening)', tag: 'ptc' },
  { date: '2027-04-09', title: 'Parent–Teacher Conferences (no classes, offices open)', tag: 'ptc' },
  { date: '2027-04-12', end: '2027-04-17', title: 'Khmer New Year holiday (no classes, offices closed)', tag: 'holiday' },
  { date: '2027-05-14', end: '2027-05-15', title: 'King Sihamoni’s Birthday (no classes, offices closed)', tag: 'holiday' },
  { date: '2027-06-25', title: 'Last day of classes (half day for students)', tag: 'end' },
  { date: '2027-06-28', end: '2027-06-30', title: 'Summer Break / Summer Camp (no classes, offices open)', tag: 'break' },
  { date: '2027-07-01', end: '2027-07-16', title: 'Summer Break / Summer Camp (no classes, offices open)', tag: 'break' },
  { date: '2027-07-19', end: '2027-07-24', title: 'Summer Break (no classes, offices closed)', tag: 'holiday' },
  { date: '2027-07-26', end: '2027-07-30', title: 'Summer Camp', tag: 'break' },
]

export const funFacts = [
  'Koh Pich means Diamond Island — your campus sits on a river-made jewel.',
  'CIS is Alberta-accredited, which is why Calgary and Phnom Penh share a school year rhythm.',
  'The maple leaf on the crest is a cousin of the globe: Canada looking outward.',
  'LabelFrancÉducation: CIS was the first school in Cambodia to receive the seal.',
  'The CIS Bears mascot is unofficially allergic to unfinished CAS reflections.',
  'Bassac Garden campus is where the smallest Bears learn to line up like champions.',
]
