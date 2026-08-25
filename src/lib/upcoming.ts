import { classes } from '../data/school'
import { hydrateWorkspace, type Workspace } from './workspace'
import { subjectEmoji } from './emoji'

function isoDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export type ComingItem = {
  key: string
  kind: 'task' | 'test'
  title: string
  date: string
  href: string
  classId: string
  classShort: string
  color: string
  emoji: string
  overdue: boolean
}

export function todayIso(now = new Date()) {
  return isoDate(now.getFullYear(), now.getMonth(), now.getDate())
}

export function comingFromWorkspaces(workspaces: Record<string, Workspace>, now = new Date()): ComingItem[] {
  const today = todayIso(now)
  const items: ComingItem[] = []

  for (const course of classes) {
    const ws = workspaces[course.id] ? hydrateWorkspace(workspaces[course.id]) : null
    if (!ws) continue
    const classEmoji = subjectEmoji(course.id, ws.classEmoji)

    for (const task of ws.tasks) {
      if (task.done || !/^\d{4}-\d{2}-\d{2}$/.test(task.due)) continue
      const href = task.unitId
        ? `/class/${course.id}/unit/${task.unitId}/task/${task.id}`
        : `/class/${course.id}`
      items.push({
        key: `task-${course.id}-${task.id}`,
        kind: 'task',
        title: (() => {
          const parent = task.parentId ? ws.tasks.find((t) => t.id === task.parentId) : undefined
          const name = task.title || 'Untitled assignment'
          return parent?.title ? `${parent.title} · ${name}` : name
        })(),
        date: task.due,
        href,
        classId: course.id,
        classShort: course.short,
        color: course.color,
        emoji: task.emoji || classEmoji,
        overdue: task.due < today,
      })
    }

    for (const test of ws.tests) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(test.date)) continue
      const scored = test.score.trim() !== ''
      if (scored && test.date < today) continue
      items.push({
        key: `test-${course.id}-${test.id}`,
        kind: 'test',
        title: test.name || 'Untitled test',
        date: test.date,
        href: test.unitId
          ? `/class/${course.id}/unit/${test.unitId}/test/${test.id}`
          : `/class/${course.id}`,
        classId: course.id,
        classShort: course.short,
        color: course.color,
        emoji: test.emoji || classEmoji,
        overdue: test.date < today && !scored,
      })
    }
  }

  items.sort((a, b) => {
    if (a.overdue !== b.overdue) return a.overdue ? -1 : 1
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    return a.title.localeCompare(b.title)
  })

  return items.slice(0, 10)
}
