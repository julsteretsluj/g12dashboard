import { classes } from '../data/school'
import { hydrateWorkspace, type Workspace } from './workspace'
import type { StudioData } from './studio'

export const DUE_MAIL_TO = '27kittoastropt@cisp.edu.kh'

export type DueAssignment = {
  key: string
  title: string
  classShort: string
  due: string
  href: string
}

export function phnomPenhIso(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Phnom_Penh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

export function addIsoDays(iso: string, days: number) {
  const stamp = Date.parse(`${iso}T12:00:00+07:00`)
  if (!Number.isFinite(stamp)) return iso
  return phnomPenhIso(new Date(stamp + days * 24 * 60 * 60 * 1000))
}

export function prettyDue(iso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso
  return new Date(`${iso}T12:00:00+07:00`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Phnom_Penh',
  })
}

export function assignmentsDueTomorrow(
  workspaces: Record<string, Workspace>,
  now = new Date(),
): DueAssignment[] {
  const tomorrow = addIsoDays(phnomPenhIso(now), 1)
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const items: DueAssignment[] = []

  for (const course of classes) {
    const ws = workspaces[course.id] ? hydrateWorkspace(workspaces[course.id]) : null
    if (!ws) continue
    for (const task of ws.tasks) {
      if (task.done || task.due !== tomorrow) continue
      if (task.tag !== 'homework') continue
      const name = task.title || 'Untitled assignment'
      const parent = task.parentId ? ws.tasks.find((t) => t.id === task.parentId) : undefined
      const title = parent?.title ? `${parent.title} · ${name}` : name
      const path = task.unitId
        ? `/class/${course.id}/unit/${task.unitId}/task/${task.id}`
        : `/class/${course.id}`
      items.push({
        key: `${course.id}:${task.id}`,
        title,
        classShort: course.short,
        due: task.due,
        href: origin ? `${origin}${path}` : path,
      })
    }
  }

  items.sort((a, b) => a.title.localeCompare(b.title))
  return items
}

export async function sendDueAssignmentMail(items: DueAssignment[]) {
  if (items.length === 0) return false
  const lines = items.map((item) => `• ${item.title} — ${item.classShort} — ${prettyDue(item.due)}${item.href ? `\n  ${item.href}` : ''}`)
  const subject =
    items.length === 1
      ? `CIS Studio: ${items[0].title} is due tomorrow`
      : `CIS Studio: ${items.length} assignments due tomorrow`
  const body = [
    `These assignments are due tomorrow (${prettyDue(items[0].due)}) in Phnom Penh.`,
    '',
    ...lines,
    '',
    'CIS Studio',
  ].join('\n')

  const res = await fetch(`https://formsubmit.co/ajax/${DUE_MAIL_TO}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      _subject: subject,
      _template: 'box',
      _captcha: 'false',
      name: 'CIS Studio',
      email: DUE_MAIL_TO,
      message: body,
    }),
  })
  return res.ok
}

export async function nudgeDueMail(studio: StudioData, now = new Date()): Promise<StudioData | null> {
  const due = assignmentsDueTomorrow(studio.workspaces, now)
  const sent = studio.dueMail ?? {}
  const fresh = due.filter((item) => sent[item.key] !== item.due)
  if (fresh.length === 0) return null
  const ok = await sendDueAssignmentMail(fresh)
  if (!ok) return null
  const dueMail = { ...sent }
  for (const item of fresh) dueMail[item.key] = item.due
  return { ...studio, dueMail }
}
