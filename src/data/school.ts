export type Period = {
  start: string
  end: string
  classId: string | null
  label?: string
}

export type ClassInfo = {
  id: string
  name: string
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
    id: 'english',
    name: 'English A: Literature',
    teacher: 'Ms. Harlow',
    room: 'H-214',
    color: '#C0292D',
    emoji: '📖',
    blurb: 'Close reading, drama, and the quiet art of saying what you mean.',
    assignments: [
      { title: 'Paper 1 practice — unseen poem', due: 'Thu', done: false, note: 'Annotate imagery first, thesis second.' },
      { title: 'IO extract: Achebe, ch. 7', due: 'Mon', done: true, note: 'Recorded draft is in Drive.' },
    ],
    notes: [
      { title: 'Motif bank', body: 'Light vs. dust in The Great Gatsby. Always pair with class.' },
      { title: 'Oral outline', body: 'Global issue: dignity under colonial pressure. Text: Things Fall Apart + Persepolis.' },
    ],
    resources: [
      { label: 'Poetry Foundation', href: 'https://www.poetryfoundation.org/' },
      { label: 'IB English support', href: 'https://www.ibo.org/' },
    ],
  },
  {
    id: 'math',
    name: 'Mathematics AA HL',
    teacher: 'Mr. Chen',
    room: 'S-108',
    color: '#0C4160',
    emoji: '∫',
    blurb: 'Proofs, polynomials, and the occasional victory lap at the whiteboard.',
    assignments: [
      { title: 'IA draft 2 — regression model', due: 'Fri', done: false, note: 'Need residual plot + Rationale rewrite.' },
      { title: 'Ex 12.3 odd problems', due: 'Wed', done: false, note: 'Skip 17 if you did the extension.' },
    ],
    notes: [
      { title: 'Complex numbers', body: 'Argand diagrams: modulus is distance from origin. De Moivre for powers of cis θ.' },
      { title: 'Calculus trap', body: 'Remember +C. Also: implicit diff when y is tangled in x.' },
    ],
    resources: [
      { label: 'Desmos', href: 'https://www.desmos.com/calculator' },
      { label: 'Khan Academy', href: 'https://www.khanacademy.org/math' },
    ],
  },
  {
    id: 'bio',
    name: 'Biology HL',
    teacher: 'Dr. Sokha',
    room: 'Lab 2',
    color: '#5C9E3D',
    emoji: '🧬',
    blurb: 'Cells, ecology, and the smell of agar on a Tuesday morning.',
    assignments: [
      { title: 'Lab: enzyme rate vs temperature', due: 'Tue', done: false, note: 'Graph with error bars. Caption like a scientist.' },
      { title: 'Topic 6 quiz', due: 'Fri', done: true, note: 'Heart, lungs, and the stubborn nephron.' },
    ],
    notes: [
      { title: 'Photosynthesis', body: 'Light-dependent in thylakoid membrane. Calvin cycle in stroma. NADPH is the courier.' },
      { title: 'IA idea', body: 'Salinity vs germination of local rice variety. Ask Dr. Sokha about greenhouse space.' },
    ],
    resources: [
      { label: 'BioNinja', href: 'https://ib.bioninja.com.au/' },
      { label: 'HHMI BioInteractive', href: 'https://www.biointeractive.org/' },
    ],
  },
  {
    id: 'history',
    name: 'History HL',
    teacher: 'Ms. Vannak',
    room: 'H-101',
    color: '#FF8D3D',
    emoji: '🗺️',
    blurb: 'Causes, consequences, and the footnotes that change everything.',
    assignments: [
      { title: 'Paper 2 plan — authoritarian states', due: 'Wed', done: false, note: 'Compare Mao & Castro. One paragraph per factor.' },
    ],
    notes: [
      { title: 'Origins of the Cold War', body: 'Orthodox / revisionist / post-revisionist. Always name a historian.' },
    ],
    resources: [
      { label: 'ActiveHistory', href: 'https://www.activehistory.co.uk/' },
    ],
  },
  {
    id: 'french',
    name: 'French B SL',
    teacher: 'Mme. Laurent',
    room: 'L-012',
    color: '#C0292D',
    emoji: '🥐',
    blurb: 'LabelFrancÉducation energy. Oui, even on Monday.',
    assignments: [
      { title: 'Journal: un souvenir de Phnom Penh', due: 'Mon', done: false, note: '200 mots. Passé composé vs imparfait.' },
    ],
    notes: [
      { title: 'Subjunctive triggers', body: 'Il faut que, bien que, pour que. Doubt and desire pull the mood.' },
    ],
    resources: [
      { label: 'TV5Monde', href: 'https://apprendre.tv5monde.com/' },
    ],
  },
  {
    id: 'art',
    name: 'Visual Arts',
    teacher: 'Mr. Reyes',
    room: 'Studio A',
    color: '#F4D258',
    emoji: '🎨',
    blurb: 'Process portfolio, exhibition, and the courage to leave a canvas messy.',
    assignments: [
      { title: 'Comparative study slides 1–5', due: 'Thu', done: false, note: 'Khmer bas-relief vs contemporary collage.' },
    ],
    notes: [
      { title: 'Exhibition thesis', body: 'Home as a movable map. Materials: tracing paper, river silt, red thread.' },
    ],
    resources: [
      { label: 'CIS Celebrating the Arts', href: 'https://www.cisp.edu.kh/' },
    ],
  },
  {
    id: 'tok',
    name: 'Theory of Knowledge',
    teacher: 'Ms. Patel',
    room: 'Seminar',
    color: '#0C4160',
    emoji: '🪞',
    blurb: 'Knowledge questions, and the habit of asking “how do we know?”',
    assignments: [
      { title: 'Exhibition object 2 write-up', due: 'Fri', done: false, note: 'Link to prompt 11. Keep it personal, not Wikipedia.' },
    ],
    notes: [
      { title: 'AOKs cheat sheet', body: 'History values testimony; natural sciences value reproducibility. Tension is the point.' },
    ],
    resources: [
      { label: 'TOK essay titles', href: 'https://www.ibo.org/' },
    ],
  },
  {
    id: 'cas',
    name: 'CAS / Advisory',
    teacher: 'Coach Lim',
    room: 'Gym annex',
    color: '#5C9E3D',
    emoji: '🐻',
    blurb: 'Bears pride, service hours, and the Soccer Academy after 3:20.',
    assignments: [
      { title: 'CAS reflection — river clean-up', due: 'Sun', done: false, note: 'Learning outcome 5. Photos in album.' },
    ],
    notes: [
      { title: 'Season', body: 'Futsal Thursday. Bring both jerseys. Water. Pride.' },
    ],
    resources: [
      { label: 'CIS Sports', href: 'https://sports.cisp.edu.kh/' },
    ],
  },
]

export const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const

export const bells = [
  { start: '07:45', end: '08:30' },
  { start: '08:35', end: '09:20' },
  { start: '09:25', end: '10:10' },
  { start: '10:25', end: '11:10' },
  { start: '11:15', end: '12:00' },
  { start: '12:50', end: '13:35' },
  { start: '13:40', end: '14:25' },
  { start: '14:30', end: '15:15' },
]

const grid: Record<(typeof days)[number], (string | null)[]> = {
  Mon: ['english', 'math', 'bio', 'history', 'french', 'tok', 'art', 'cas'],
  Tue: ['math', 'english', 'french', 'bio', 'art', 'history', 'tok', null],
  Wed: ['bio', 'math', 'english', 'french', 'cas', 'history', 'art', 'tok'],
  Thu: ['history', 'bio', 'math', 'english', 'french', 'art', 'cas', null],
  Fri: ['tok', 'english', 'math', 'bio', 'history', 'french', 'cas', 'art'],
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
  { date: '2026-09-08', title: 'IB Diploma parent briefing', tag: 'ib' },
]

export const funFacts = [
  'Koh Pich means Diamond Island — your campus sits on a river-made jewel.',
  'CIS is Alberta-accredited, which is why Calgary and Phnom Penh share a school year rhythm.',
  'The maple leaf on the crest is a cousin of the globe: Canada looking outward.',
  'LabelFrancÉducation: CIS was the first school in Cambodia to receive the seal.',
  'The CIS Bears mascot is unofficially allergic to unfinished CAS reflections.',
  'Bassac Garden campus is where the smallest Bears learn to line up like champions.',
]
