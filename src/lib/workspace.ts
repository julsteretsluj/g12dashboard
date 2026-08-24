export type DocItem = {
  id: string
  name: string
  kind: 'file' | 'link'
  href?: string
  fileId?: string
  mime?: string
}

export type TaskItem = {
  id: string
  title: string
  due: string
  note: string
  done: boolean
  attachments: DocItem[]
  submissions: DocItem[]
}

export type Workspace = {
  notes: { id: string; title: string; body: string }[]
  library: DocItem[]
  tasks: TaskItem[]
}

const empty = (): Workspace => ({ notes: [], library: [], tasks: [] })

export function loadWorkspace(classId: string): Workspace {
  const raw = localStorage.getItem(`cis-ws-${classId}`)
  if (!raw) return empty()
  try {
    return { ...empty(), ...JSON.parse(raw) }
  } catch {
    return empty()
  }
}

export function saveWorkspace(classId: string, ws: Workspace) {
  localStorage.setItem(`cis-ws-${classId}`, JSON.stringify(ws))
}

export function newId() {
  return crypto.randomUUID()
}
