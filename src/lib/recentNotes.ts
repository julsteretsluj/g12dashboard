import { classes } from '../data/school'
import { hydrateWorkspace, type NoteItem, type Workspace } from './workspace'
import { subjectEmoji } from './emoji'
import { stripNoteHtml } from './noteHtml'

export type RecentNote = {
  key: string
  title: string
  href: string
  classId: string
  classShort: string
  color: string
  emoji: string
  date: string
  topic: string
  context: string
  preview: string
}

export function noteHref(classId: string, note: NoteItem) {
  const { id, unitId, taskId, testId } = note
  if (taskId && unitId) return `/class/${classId}/unit/${unitId}/task/${taskId}/note/${id}`
  if (testId && unitId) return `/class/${classId}/unit/${unitId}/test/${testId}/note/${id}`
  if (taskId) return `/class/${classId}/task/${taskId}/note/${id}`
  if (unitId) return `/class/${classId}/unit/${unitId}/note/${id}`
  return `/class/${classId}/note/${id}`
}

export function recentNotesFromWorkspaces(workspaces: Record<string, Workspace>): RecentNote[] {
  const items: RecentNote[] = []

  for (const course of classes) {
    const ws = workspaces[course.id] ? hydrateWorkspace(workspaces[course.id]) : null
    if (!ws) continue
    const classEmoji = subjectEmoji(course.id, ws.classEmoji)

    for (const note of ws.notes) {
      const unit = note.unitId ? ws.units.find((u) => u.id === note.unitId) : undefined
      const task = note.taskId ? ws.tasks.find((t) => t.id === note.taskId) : undefined
      const test = note.testId ? ws.tests.find((t) => t.id === note.testId) : undefined
      const context = [
        course.short,
        unit?.name,
        task?.title || test?.name,
      ]
        .filter(Boolean)
        .join(' · ')

      items.push({
        key: `${course.id}-${note.id}`,
        title: note.title || 'Untitled',
        href: noteHref(course.id, note),
        classId: course.id,
        classShort: course.short,
        color: course.color,
        emoji: note.emoji || classEmoji,
        date: note.date || '',
        topic: note.topic.trim(),
        context,
        preview: stripNoteHtml(note.body),
      })
    }
  }

  items.sort((a, b) => {
    if (a.date && b.date && a.date !== b.date) return b.date.localeCompare(a.date)
    if (a.date !== b.date) return a.date ? -1 : 1
    return a.title.localeCompare(b.title)
  })

  return items
}
