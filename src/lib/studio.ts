import { classes } from '../data/school'
import { loadWorkspace, saveWorkspace, type Workspace } from './workspace'

export type TodoItem = { id: string; text: string; done: boolean }

export type TimerSettings = {
  title: string
  minutes: number
}

export const defaultTimer = (): TimerSettings => ({ title: 'Focus maple', minutes: 25 })

export type StudioData = {
  todo: TodoItem[]
  workspaces: Record<string, Workspace>
  timer: TimerSettings
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
    if (raw) todo = JSON.parse(raw) as TodoItem[]
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
  return { todo, workspaces, timer }
}

export function writeLocalStudio(data: StudioData) {
  localStorage.setItem('cis-todo-v2', JSON.stringify(data.todo ?? []))
  localStorage.setItem('cis-pomo-v1', JSON.stringify(data.timer ?? defaultTimer()))
  for (const [id, ws] of Object.entries(data.workspaces ?? {})) {
    saveWorkspace(id, ws)
  }
}
