import { classes } from '../data/school'
import { hydrateWorkspace, type Workspace } from './workspace'
import { subjectEmoji } from './emoji'
import { phnomPenhIso } from './dueMail'

export type HomeworkItem = {
  key: string
  title: string
  due: string
  href: string
  classId: string
  classShort: string
  color: string
  emoji: string
  done: boolean
  overdue: boolean
  dueTomorrow: boolean
  unitName: string
  taskId: string
}

export function homeworkFromWorkspaces(
  workspaces: Record<string, Workspace>,
  now = new Date(),
): HomeworkItem[] {
  const today = phnomPenhIso(now)
  const tomorrow = (() => {
    const stamp = Date.parse(`${today}T12:00:00+07:00`)
    return phnomPenhIso(new Date(stamp + 24 * 60 * 60 * 1000))
  })()
  const items: HomeworkItem[] = []

  for (const course of classes) {
    const ws = workspaces[course.id] ? hydrateWorkspace(workspaces[course.id]) : null
    if (!ws) continue
    const classEmoji = subjectEmoji(course.id, ws.classEmoji)

    for (const task of ws.tasks) {
      if (task.parentId) continue
      const unit = task.unitId ? ws.units.find((u) => u.id === task.unitId) : undefined
      const href = task.unitId
        ? `/class/${course.id}/unit/${task.unitId}/task/${task.id}`
        : `/class/${course.id}`
      const due = /^\d{4}-\d{2}-\d{2}$/.test(task.due) ? task.due : ''
      items.push({
        key: `${course.id}:${task.id}`,
        title: task.title || 'Untitled homework',
        due,
        href,
        classId: course.id,
        classShort: course.short,
        color: course.color,
        emoji: task.emoji || classEmoji,
        done: task.done,
        overdue: Boolean(due && !task.done && due < today),
        dueTomorrow: Boolean(due && !task.done && due === tomorrow),
        unitName: unit?.name ?? '',
        taskId: task.id,
      })
    }
  }

  items.sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1
    if (a.overdue !== b.overdue) return a.overdue ? -1 : 1
    if (a.due && b.due && a.due !== b.due) return a.due.localeCompare(b.due)
    if (a.due !== b.due) return a.due ? -1 : 1
    return a.title.localeCompare(b.title)
  })

  return items
}
