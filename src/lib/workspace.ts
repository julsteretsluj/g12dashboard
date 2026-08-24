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

export type UnitItem = {
  id: string
  name: string
  status: 'upcoming' | 'current' | 'done'
  focus: string
}

export type TestItem = {
  id: string
  name: string
  kind: 'quiz' | 'test' | 'lab' | 'project' | 'diploma'
  date: string
  score: string
  outOf: string
  unitId: string
}

export type ReviewItem = {
  id: string
  text: string
  done: boolean
}

export type Workspace = {
  notes: { id: string; title: string; body: string }[]
  library: DocItem[]
  tasks: TaskItem[]
  units: UnitItem[]
  tests: TestItem[]
  reviews: ReviewItem[]
  target: string
  schoolWeight: string
  diplomaScore: string
  diplomaOutOf: string
}

const empty = (): Workspace => ({
  notes: [],
  library: [],
  tasks: [],
  units: [],
  tests: [],
  reviews: [],
  target: '80',
  schoolWeight: '70',
  diplomaScore: '',
  diplomaOutOf: '100',
})

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

export function pct(score: string, outOf: string) {
  const s = Number(score)
  const o = Number(outOf)
  if (!Number.isFinite(s) || !Number.isFinite(o) || o <= 0) return null
  return (s / o) * 100
}

export function schoolAverage(tests: TestItem[]) {
  const marked = tests
    .filter((t) => t.kind !== 'diploma')
    .map((t) => pct(t.score, t.outOf))
    .filter((n): n is number => n != null)
  if (!marked.length) return null
  return marked.reduce((a, b) => a + b, 0) / marked.length
}
