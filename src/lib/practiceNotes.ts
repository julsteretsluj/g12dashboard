import { practiceBank, practiceSubjectIds, type PracticeSubjectId } from '../data/practiceBanks'
import { blankNote, newId, type NoteItem, type Workspace } from './workspace'

export function isPracticeSubject(classId: string): classId is PracticeSubjectId {
  return practiceSubjectIds.includes(classId as PracticeSubjectId)
}

export function practiceHubNote(ws: Workspace): NoteItem | undefined {
  return ws.notes.find((n) => n.practiceHub && !n.unitId && !n.taskId && !n.testId)
}

export function practiceHubHref(classId: string, ws: Workspace): string | null {
  const note = practiceHubNote(ws)
  if (!note) return null
  return `/class/${classId}/note/${note.id}`
}

export function ensurePracticeHubNote(
  ws: Workspace,
  classId: string,
  makeId: () => string = newId,
): { ws: Workspace; noteId: string } {
  const existing = practiceHubNote(ws)
  if (existing) return { ws, noteId: existing.id }

  const bank = practiceBank(classId)
  if (!bank) return { ws, noteId: '' }

  const noteId = makeId()
  const note = blankNote({
    id: noteId,
    title: 'Practice drills',
    topic: bank.title,
    emoji: '📝',
    practiceHub: true,
    body: '<p>Unofficial drills tied to your note topics — not diploma marks.</p>',
  })

  return { ws: { ...ws, notes: [...ws.notes, note] }, noteId }
}
