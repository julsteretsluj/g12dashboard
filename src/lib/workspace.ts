import type { PracticeQ } from '../data/practiceNeurons'

export type DocItem = {
  id: string
  name: string
  kind: 'file' | 'link'
  href?: string
  fileId?: string
  mime?: string
}

export type WorkTag = 'homework' | 'classwork'

export const workTags: { id: WorkTag; label: string }[] = [
  { id: 'homework', label: 'Homework' },
  { id: 'classwork', label: 'Class work' },
]

export function normalizeWorkTag(value: unknown): WorkTag {
  return value === 'classwork' ? 'classwork' : 'homework'
}

export function workTagLabel(tag: WorkTag) {
  return workTags.find((t) => t.id === tag)?.label ?? 'Homework'
}

export type TaskItem = {
  id: string
  title: string
  due: string
  note: string
  done: boolean
  unitId: string
  parentId: string
  emoji: string
  tag: WorkTag
  attachments: DocItem[]
  submissions: DocItem[]
}

export type UnitItem = {
  id: string
  name: string
  status: 'upcoming' | 'current' | 'done'
  focus: string
  emoji: string
}

export type TestItem = {
  id: string
  name: string
  kind: 'quiz' | 'test' | 'lab' | 'project' | 'diploma'
  date: string
  score: string
  outOf: string
  note: string
  unitId: string
  emoji: string
  practice: PracticeQ[]
}

export type ReviewItem = {
  id: string
  text: string
  done: boolean
  emoji: string
}

export type NoteItem = {
  id: string
  title: string
  body: string
  topic: string
  date: string
  unitId: string
  taskId: string
  testId: string
  emoji: string
  attachments: DocItem[]
  practiceHub: boolean
  practiceBySet: Record<string, PracticeQ[]>
}

export type Workspace = {
  notes: NoteItem[]
  library: DocItem[]
  tasks: TaskItem[]
  units: UnitItem[]
  tests: TestItem[]
  reviews: ReviewItem[]
  target: string
  schoolWeight: string
  diplomaScore: string
  diplomaOutOf: string
  classEmoji: string
}

export const emptyWorkspace = (): Workspace => ({
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
  classEmoji: '',
})

export function hydrateWorkspace(parsed: Partial<Workspace>): Workspace {
  const base = { ...emptyWorkspace(), ...parsed }
  base.tasks = (base.tasks ?? []).map((t) => ({
    ...t,
    unitId: t.unitId ?? '',
    parentId: t.parentId ?? '',
    emoji: t.emoji ?? '',
    tag: normalizeWorkTag((t as TaskItem).tag),
    attachments: t.attachments ?? [],
    submissions: t.submissions ?? [],
  }))
  base.units = (base.units ?? []).map((u) => ({ ...u, emoji: u.emoji ?? '' }))
  base.tests = (base.tests ?? []).map((t) => ({
    ...t,
    emoji: t.emoji ?? '',
    note: t.note ?? '',
    practice: t.practice ?? [],
  }))
  base.reviews = (base.reviews ?? []).map((r) => ({ ...r, emoji: r.emoji ?? '' }))
  base.notes = (base.notes ?? []).map((n) => ({
    ...n,
    unitId: n.unitId ?? '',
    taskId: n.taskId ?? '',
    testId: n.testId ?? '',
    emoji: n.emoji ?? '',
    topic: n.topic ?? '',
    date: n.date ?? '',
    attachments: n.attachments ?? [],
    practiceHub: n.practiceHub ?? false,
    practiceBySet: n.practiceBySet ?? {},
  }))
  base.classEmoji = base.classEmoji ?? ''
  return base
}

export function loadWorkspace(classId: string): Workspace {
  const raw = localStorage.getItem(`cis-ws-${classId}`)
  if (!raw) return emptyWorkspace()
  try {
    return hydrateWorkspace(JSON.parse(raw) as Partial<Workspace>)
  } catch {
    return emptyWorkspace()
  }
}

export function saveWorkspace(classId: string, ws: Workspace) {
  localStorage.setItem(`cis-ws-${classId}`, JSON.stringify(ws))
}

export function newId() {
  return crypto.randomUUID()
}

export function classNotes(notes: NoteItem[]) {
  return notes.filter((n) => !n.unitId && !n.taskId && !n.testId)
}

export function unitNotes(notes: NoteItem[], unitId: string) {
  return notes.filter((n) => n.unitId === unitId && !n.taskId && !n.testId)
}

export function taskNotes(notes: NoteItem[], taskId: string) {
  return notes.filter((n) => n.taskId === taskId)
}

export function testNotes(notes: NoteItem[], testId: string) {
  return notes.filter((n) => n.testId === testId)
}

export function blankTask(partial: Pick<TaskItem, 'id' | 'title'> & Partial<TaskItem>): TaskItem {
  const { tag, ...rest } = partial
  return {
    due: '',
    note: '',
    done: false,
    unitId: '',
    parentId: '',
    emoji: '',
    attachments: [],
    submissions: [],
    ...rest,
    tag: normalizeWorkTag(tag ?? 'homework'),
  }
}

export function childTasks(tasks: TaskItem[], parentId: string) {
  return tasks.filter((t) => t.parentId === parentId)
}

export function taskSubtreeIds(tasks: TaskItem[], rootId: string) {
  const ids = new Set([rootId])
  let grew = true
  while (grew) {
    grew = false
    for (const t of tasks) {
      if (t.parentId && ids.has(t.parentId) && !ids.has(t.id)) {
        ids.add(t.id)
        grew = true
      }
    }
  }
  return ids
}

export function dropTaskTree(ws: Workspace, rootId: string): Workspace {
  const ids = taskSubtreeIds(ws.tasks, rootId)
  return {
    ...ws,
    tasks: ws.tasks.filter((t) => !ids.has(t.id)),
    notes: ws.notes.filter((n) => !ids.has(n.taskId)),
  }
}

export type DocLocation =
  | { scope: 'library' }
  | { scope: 'task'; taskId: string; field: 'attachments' | 'submissions' }
  | { scope: 'note'; noteId: string }

export type DocMoveTarget = { label: string; location: DocLocation }

export function docLocationKey(loc: DocLocation): string {
  if (loc.scope === 'library') return 'library'
  if (loc.scope === 'note') return `note:${loc.noteId}`
  return `task:${loc.taskId}:${loc.field}`
}

export function docsAt(ws: Workspace, loc: DocLocation): DocItem[] {
  if (loc.scope === 'library') return ws.library
  if (loc.scope === 'note') {
    const note = ws.notes.find((n) => n.id === loc.noteId)
    return note?.attachments ?? []
  }
  const task = ws.tasks.find((t) => t.id === loc.taskId)
  return task ? task[loc.field] : []
}

export function withDocsAt(ws: Workspace, loc: DocLocation, items: DocItem[]): Workspace {
  if (loc.scope === 'library') return { ...ws, library: items }
  if (loc.scope === 'note') {
    return {
      ...ws,
      notes: ws.notes.map((n) => (n.id === loc.noteId ? { ...n, attachments: items } : n)),
    }
  }
  return {
    ...ws,
    tasks: ws.tasks.map((t) => (t.id === loc.taskId ? { ...t, [loc.field]: items } : t)),
  }
}

export function moveDoc(ws: Workspace, item: DocItem, from: DocLocation, to: DocLocation): Workspace {
  if (docLocationKey(from) === docLocationKey(to)) return ws
  const moved = { ...item, id: newId() }
  let next = withDocsAt(ws, from, docsAt(ws, from).filter((d) => d.id !== item.id))
  next = withDocsAt(next, to, [...docsAt(next, to), moved])
  return next
}

export function buildMoveTargets(ws: Workspace, from: DocLocation): DocMoveTarget[] {
  const fromKey = docLocationKey(from)
  const targets: DocMoveTarget[] = []

  if (fromKey !== 'library') {
    targets.push({ label: 'Class library', location: { scope: 'library' } })
  }

  for (const task of ws.tasks) {
    for (const field of ['attachments', 'submissions'] as const) {
      const location: DocLocation = { scope: 'task', taskId: task.id, field }
      if (docLocationKey(location) === fromKey) continue
      const unit = task.unitId ? ws.units.find((u) => u.id === task.unitId) : undefined
      const title = task.title || (task.parentId ? 'Sub-task' : 'Assignment')
      const prefix = unit ? `${unit.name} · ` : ''
      const suffix = field === 'submissions' ? ' · submissions' : ''
      targets.push({ label: `${prefix}${title}${suffix}`, location })
    }
  }

  for (const note of ws.notes) {
    const location: DocLocation = { scope: 'note', noteId: note.id }
    if (docLocationKey(location) === fromKey) continue
    const task = note.taskId ? ws.tasks.find((t) => t.id === note.taskId) : undefined
    const title = note.title || 'Untitled note'
    const prefix = task ? `${task.title || 'Assignment'} · ` : ''
    targets.push({ label: `${prefix}${title}`, location })
  }

  return targets
}

export function blankNote(partial: Pick<NoteItem, 'id' | 'title'> & Partial<NoteItem>): NoteItem {
  const now = new Date()
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const { attachments, practiceBySet, ...rest } = partial
  return {
    body: '',
    topic: '',
    date,
    unitId: '',
    taskId: '',
    testId: '',
    emoji: '',
    practiceHub: false,
    ...rest,
    attachments: attachments ?? [],
    practiceBySet: practiceBySet ?? {},
  }
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
