import { classes } from '../data/school'
import { loadWorkspace, saveWorkspace, type Workspace } from './workspace'

export type TodoItem = { id: string; text: string; done: boolean }

export type StudioData = {
  todo: TodoItem[]
  workspaces: Record<string, Workspace>
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
  return { todo, workspaces }
}

export function writeLocalStudio(data: StudioData) {
  localStorage.setItem('cis-todo-v2', JSON.stringify(data.todo ?? []))
  for (const [id, ws] of Object.entries(data.workspaces ?? {})) {
    saveWorkspace(id, ws)
  }
}
