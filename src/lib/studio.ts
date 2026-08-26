import { classes } from '../data/school'
import { loadWorkspace, saveWorkspace, type Workspace } from './workspace'

export type TodoItem = { id: string; text: string; done: boolean; emoji: string }

export type TimerSettings = {
  title: string
  minutes: number
}

export type MoodKey = {
  id: string
  emoji: string
  label: string
}

export type MoodBook = {
  keys: MoodKey[]
  days: Record<string, string>
}

export const defaultTimer = (): TimerSettings => ({ title: 'Focus maple', minutes: 25 })

export const defaultMoodBook = (): MoodBook => ({
  keys: [
    { id: 'mood-calm', emoji: '😌', label: 'Calm / okay' },
    { id: 'mood-focus', emoji: '🤓', label: 'Locked in' },
    { id: 'mood-tired', emoji: '😴', label: 'Tired' },
    { id: 'mood-fire', emoji: '🔥', label: 'Fired up' },
    { id: 'mood-rain', emoji: '🌧️', label: 'Heavy day' },
  ],
  days: {},
})

export const defaultProductivityBook = (): MoodBook => ({
  keys: [
    { id: 'prod-deep', emoji: '🎯', label: 'Deep focus' },
    { id: 'prod-steady', emoji: '✅', label: 'Steady progress' },
    { id: 'prod-meh', emoji: '🟡', label: 'Okay / mixed' },
    { id: 'prod-scatter', emoji: '🌪️', label: 'Scattered' },
    { id: 'prod-off', emoji: '🚫', label: 'Off day' },
  ],
  days: {},
})

export function hydrateMoodBook(raw?: Partial<MoodBook> | null, fallback: MoodBook = defaultMoodBook()): MoodBook {
  const keys = Array.isArray(raw?.keys)
    ? raw!.keys
        .filter((k) => k && typeof k.emoji === 'string' && k.emoji.trim())
        .map((k, i) => ({
          id: typeof k.id === 'string' && k.id ? k.id : `key-${i}`,
          emoji: k.emoji.trim(),
          label: typeof k.label === 'string' ? k.label.trim() : '',
        }))
    : fallback.keys
  const days: Record<string, string> = {}
  if (raw?.days && typeof raw.days === 'object') {
    for (const [date, emoji] of Object.entries(raw.days)) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(date) && typeof emoji === 'string' && emoji.trim()) {
        days[date] = emoji.trim()
      }
    }
  }
  return { keys: keys.length ? keys : fallback.keys, days }
}

export type StudioData = {
  todo: TodoItem[]
  workspaces: Record<string, Workspace>
  timer: TimerSettings
  dueMail: Record<string, string>
  moods: MoodBook
  productivity: MoodBook
}

export function readLocalStudio(): StudioData {
  const workspaces: Record<string, Workspace> = {}
  const ids = new Set(classes.map((c) => c.id))
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('cis-ws-')) ids.add(key.slice('cis-ws-'.length))
  }
  for (const id of ids) workspaces[id] = loadWorkspace(id)
  let todo: TodoItem[] = []
  try {
    const raw = localStorage.getItem('cis-todo-v2')
    if (raw) todo = (JSON.parse(raw) as TodoItem[]).map((t) => ({ ...t, emoji: t.emoji ?? '' }))
  } catch {
    todo = []
  }
  let timer = defaultTimer()
  try {
    const raw = localStorage.getItem('cis-pomo-v1')
    if (raw) timer = { ...defaultTimer(), ...JSON.parse(raw) }
  } catch {
    timer = defaultTimer()
  }
  timer.minutes = Math.min(180, Math.max(1, Number(timer.minutes) || 25))
  timer.title = timer.title.trim() || 'Focus maple'
  return {
    todo,
    workspaces,
    timer,
    dueMail: readDueMail(),
    moods: readMoods(),
    productivity: readProductivity(),
  }
}

function readDueMail(): Record<string, string> {
  try {
    const raw = localStorage.getItem('cis-due-mail-v1')
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, string>
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function readMoods(): MoodBook {
  try {
    const raw = localStorage.getItem('cis-moods-v1')
    if (!raw) return defaultMoodBook()
    return hydrateMoodBook(JSON.parse(raw) as Partial<MoodBook>, defaultMoodBook())
  } catch {
    return defaultMoodBook()
  }
}

function readProductivity(): MoodBook {
  try {
    const raw = localStorage.getItem('cis-productivity-v1')
    if (!raw) return defaultProductivityBook()
    return hydrateMoodBook(JSON.parse(raw) as Partial<MoodBook>, defaultProductivityBook())
  } catch {
    return defaultProductivityBook()
  }
}

export function writeLocalStudio(data: StudioData) {
  localStorage.setItem('cis-todo-v2', JSON.stringify(data.todo ?? []))
  localStorage.setItem('cis-pomo-v1', JSON.stringify(data.timer ?? defaultTimer()))
  localStorage.setItem('cis-due-mail-v1', JSON.stringify(data.dueMail ?? {}))
  localStorage.setItem('cis-moods-v1', JSON.stringify(hydrateMoodBook(data.moods, defaultMoodBook())))
  localStorage.setItem(
    'cis-productivity-v1',
    JSON.stringify(hydrateMoodBook(data.productivity, defaultProductivityBook())),
  )
  for (const [id, ws] of Object.entries(data.workspaces ?? {})) {
    saveWorkspace(id, ws)
  }
}
