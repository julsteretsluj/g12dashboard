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
    name: 'Career and Transitions',
    short: 'Homeroom',
    teacher: 'Kirsten Movold · Tess Maloney',
    room: '219 / 310',
    color: '#C0292D',
    emoji: '🐻',
    blurb: 'Homeroom 08:00–08:30 — Career and Transitions with Movold (MH 219) and Maloney (MH 310).',
  },
  {
    id: 'bio',
    name: 'Biology 30',
    short: 'Bio 30',
    teacher: 'Jacquie Brost',
    room: '504',
    color: '#5C9E3D',
    emoji: '🧬',
    blurb: 'Block 1 with Ms. Brost in MH 504.',
  },
  {
    id: 'social',
    name: 'Social Studies 30-1',
    short: 'Social 30-1',
    teacher: 'Andrew Biggar',
    room: '208',
    color: '#FF8D3D',
    emoji: '🗺️',
    blurb: 'Block 2 with Mr. Biggar in MH 208.',
  },
  {
    id: 'cts',
    name: 'CTS 30',
    short: 'CTS 30',
    teacher: 'Jackson Cooper',
    room: 'Makerspace',
    color: '#0C4160',
    emoji: '🛠️',
    blurb: 'Block 3 with Mr. Cooper in the MH makerspace — Days 1 and 4 only.',
  },
  {
    id: 'art',
    name: 'Visual Art / Art 30',
    short: 'Art 30',
    teacher: 'Tess Maloney',
    room: '310',
    color: '#C0292D',
    emoji: '🎨',
    blurb: 'Block 4 with Ms. Maloney in MH 310.',
  },
]

export const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const
export const dayCycle = ['D1', 'D2', 'D3', 'D4', 'D5'] as const

/** Official MH bells from Jules’s Week 35 timetable (S1). */
export const bells = [
  { start: '08:00', end: '08:30' },
  { start: '08:35', end: '09:55' },
  { start: '10:05', end: '11:25' },
  { start: '11:25', end: '12:10' },
  { start: '12:10', end: '13:30' },
  { start: '13:40', end: '15:00' },
]

const grid: Record<(typeof days)[number], (string | null)[]> = {
  Mon: ['homeroom', 'bio', 'social', 'lunch', 'cts', 'art'],
  Tue: ['homeroom', 'bio', 'social', 'lunch', null, 'art'],
  Wed: ['homeroom', 'bio', 'social', 'lunch', null, 'art'],
  Thu: ['homeroom', 'bio', 'social', 'lunch', 'cts', 'art'],
  Fri: ['homeroom', 'bio', 'social', 'lunch', null, 'art'],
}

export function timetableCell(day: (typeof days)[number], period: number) {
  return grid[day][period]
}

function minutesFromLabel(label: string) {
  const [h, m] = label.split(':').map(Number)
  return h * 60 + m
}

export function phnomClock(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Phnom_Penh',
      weekday: 'short',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  )
  return {
    weekday: parts.weekday ?? '',
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  }
}

export function activeDay(now = new Date()): (typeof days)[number] | null {
  const { weekday } = phnomClock(now)
  return (days as readonly string[]).includes(weekday) ? (weekday as (typeof days)[number]) : null
}

export function activePeriod(now = new Date()): number | null {
  const { minutes } = phnomClock(now)
  const i = bells.findIndex((b) => minutes >= minutesFromLabel(b.start) && minutes < minutesFromLabel(b.end))
  return i >= 0 ? i : null
}

const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function civilAddDays(year: number, month: number, day: number, extra: number) {
  const dt = new Date(Date.UTC(year, month - 1, day + extra))
  return {
    year: dt.getUTCFullYear(),
    month: dt.getUTCMonth() + 1,
    day: dt.getUTCDate(),
    weekday: weekdayNames[dt.getUTCDay()],
  }
}

export type UpcomingBell = {
  day: (typeof days)[number]
  period: number
  start: string
  end: string
  cell: string
  startsAt: number
}

export function upcomingBell(now = new Date()): UpcomingBell | null {
  const stamp = phnomClock(now)
  const nowSec = stamp.hour * 3600 + stamp.minute * 60 + stamp.second
  for (let offset = 0; offset <= 8; offset++) {
    const cal = civilAddDays(stamp.year, stamp.month, stamp.day, offset)
    if (!(days as readonly string[]).includes(cal.weekday)) continue
    const day = cal.weekday as (typeof days)[number]
    for (let i = 0; i < bells.length; i++) {
      const cell = timetableCell(day, i)
      if (!cell) continue
      const startSec = minutesFromLabel(bells[i].start) * 60
      if (offset === 0 && startSec <= nowSec) continue
      return {
        day,
        period: i,
        start: bells[i].start,
        end: bells[i].end,
        cell,
        startsAt: Date.parse(
          `${cal.year}-${pad2(cal.month)}-${pad2(cal.day)}T${bells[i].start}:00+07:00`,
        ),
      }
    }
  }
  return null
}

export function formatCountdown(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}:${pad2(m)}:${pad2(sec)}`
  return `${m}:${pad2(sec)}`
}

/** Next timetable meeting for a class after `now` (Phnom Penh). */
export function nextClassMeeting(classId: string, now = new Date()) {
  const stamp = phnomClock(now)
  const nowSec = stamp.hour * 3600 + stamp.minute * 60 + stamp.second
  for (let offset = 0; offset <= 21; offset++) {
    const cal = civilAddDays(stamp.year, stamp.month, stamp.day, offset)
    if (!(days as readonly string[]).includes(cal.weekday)) continue
    const day = cal.weekday as (typeof days)[number]
    for (let i = 0; i < bells.length; i++) {
      if (timetableCell(day, i) !== classId) continue
      const startSec = minutesFromLabel(bells[i].start) * 60
      if (offset === 0 && startSec <= nowSec) continue
      const iso = `${cal.year}-${pad2(cal.month)}-${pad2(cal.day)}`
      return {
        iso,
        day,
        period: i,
        start: bells[i].start,
        end: bells[i].end,
      }
    }
  }
  return null
}

export function nextClassDueIso(classId: string, now = new Date()) {
  return nextClassMeeting(classId, now)?.iso ?? ''
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
