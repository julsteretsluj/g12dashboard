export type ClassInfo = {
  id: string
  name: string
  short: string
  teacher: string
  room: string
  color: string
  emoji: string
  blurb: string
  assignments: { title: string; due: string; done: boolean; note: string }[]
  notes: { title: string; body: string }[]
  resources: { label: string; href: string }[]
}

export const classes: ClassInfo[] = [
  {
    id: 'bio',
    name: 'Biology 30',
    short: 'Bio 30',
    teacher: 'Science',
    room: '504',
    color: '#5C9E3D',
    emoji: '🧬',
    blurb: 'Alberta Bio 30 — cells, energy, genetics, and the lab in room 504.',
    assignments: [
      { title: 'Lab: enzyme rate vs temperature', due: 'Tue', done: false, note: 'Graph with error bars. Caption like a scientist.' },
      { title: 'Diploma practice: photosynthesis & respiration', due: 'Fri', done: false, note: 'Room 504. Bring a calculator and a sharp pencil.' },
    ],
    notes: [
      { title: 'Photosynthesis', body: 'Light-dependent in thylakoid membrane. Calvin cycle in stroma. NADPH is the courier.' },
      { title: 'Genetics', body: 'Punnett squares are the map. Dihybrid crosses: 9:3:3:1 if independent assortment holds.' },
    ],
    resources: [
      { label: 'LearnAlberta', href: 'https://www.learnalberta.ca/' },
      { label: 'HHMI BioInteractive', href: 'https://www.biointeractive.org/' },
    ],
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
    assignments: [
      { title: 'Position paper: liberalism in practice', due: 'Wed', done: false, note: 'Room 208. Three sources, one argument, no fence-sitting.' },
      { title: 'Source analysis practice', due: 'Mon', done: false, note: 'Identify the ideological perspective before you write.' },
    ],
    notes: [
      { title: 'Spectrum', body: 'Collectivism ↔ individualism. Classical liberalism is not the same as modern liberalism. Say so on the exam.' },
      { title: 'Room 208 ritual', body: 'Thesis first. Evidence second. Counter-argument third. Then sit down.' },
    ],
    resources: [
      { label: 'Alberta Social 30-1', href: 'https://www.alberta.ca/education' },
    ],
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
    assignments: [
      { title: 'Makerspace project checkpoint', due: 'Thu', done: false, note: 'Photo the prototype. Log what broke and what you changed.' },
    ],
    notes: [
      { title: 'Shop rules', body: 'Goggles. Hair up. Don’t leave the laser running and wander to Maple Leaf Café.' },
    ],
    resources: [
      { label: 'Tinkercad', href: 'https://www.tinkercad.com/' },
    ],
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
    assignments: [
      { title: 'Studio series: three studies', due: 'Thu', done: false, note: 'Same subject, three materials. Photograph the walls of 310 before you leave.' },
    ],
    notes: [
      { title: 'Exhibition thread', body: 'Home as a movable map. Materials: tracing paper, river silt, red thread.' },
    ],
    resources: [
      { label: 'CIS Celebrating the Arts', href: 'https://www.cisp.edu.kh/' },
    ],
  },
  {
    id: 'english',
    name: 'English Language Arts',
    short: 'English',
    teacher: 'ELA',
    room: 'TBA',
    color: '#C0292D',
    emoji: '📖',
    blurb: 'Close reading, drama, and the quiet art of saying what you mean.',
    assignments: [
      { title: 'Personal response to texts', due: 'Thu', done: false, note: 'One critical, one personal. Name the technique.' },
    ],
    notes: [
      { title: 'Motif bank', body: 'Always pair image with class. Diploma readers notice the pairing.' },
    ],
    resources: [
      { label: 'Poetry Foundation', href: 'https://www.poetryfoundation.org/' },
    ],
  },
  {
    id: 'math',
    name: 'Mathematics',
    short: 'Math',
    teacher: 'Math',
    room: 'TBA',
    color: '#0C4160',
    emoji: '∫',
    blurb: 'Proofs, polynomials, and the occasional victory lap at the whiteboard.',
    assignments: [
      { title: 'Practice set — transformations', due: 'Wed', done: false, note: 'Show the mapping, not just the graph.' },
    ],
    notes: [
      { title: 'Calculus trap', body: 'Remember +C. Implicit diff when y is tangled in x.' },
    ],
    resources: [
      { label: 'Desmos', href: 'https://www.desmos.com/calculator' },
    ],
  },
]

export const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const

/** Lunch is locked to 11:25–12:10; other bells are 80-minute Alberta-style blocks. */
export const bells = [
  { start: '08:00', end: '09:20' },
  { start: '09:25', end: '10:45' },
  { start: '11:25', end: '12:10' },
  { start: '12:15', end: '13:35' },
  { start: '13:40', end: '15:00' },
]

const grid: Record<(typeof days)[number], (string | null)[]> = {
  Mon: ['bio', 'social', 'lunch', 'cts', 'art'],
  Tue: ['social', 'bio', 'lunch', 'art', 'cts'],
  Wed: ['bio', 'english', 'lunch', 'math', 'art'],
  Thu: ['social', 'math', 'lunch', 'cts', 'english'],
  Fri: ['english', 'bio', 'lunch', 'art', 'social'],
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
