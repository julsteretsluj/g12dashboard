const { onSchedule } = require('firebase-functions/v2/scheduler')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

initializeApp()
const db = getFirestore()
const TO = '27kittoastropt@cisp.edu.kh'

function phnomPenhIso(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Phnom_Penh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

function addIsoDays(iso, days) {
  const stamp = Date.parse(`${iso}T12:00:00+07:00`)
  if (!Number.isFinite(stamp)) return iso
  return phnomPenhIso(new Date(stamp + days * 24 * 60 * 60 * 1000))
}

function prettyDue(iso) {
  return new Date(`${iso}T12:00:00+07:00`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Phnom_Penh',
  })
}

function dueTomorrow(workspaces, tomorrow) {
  const items = []
  for (const [classId, ws] of Object.entries(workspaces || {})) {
    for (const task of ws.tasks || []) {
      if (task.done || task.due !== tomorrow) continue
      if (task.tag && task.tag !== 'homework') continue
      const name = task.title || 'Untitled assignment'
      const parent = task.parentId ? (ws.tasks || []).find((t) => t.id === task.parentId) : undefined
      items.push({
        key: `${classId}:${task.id}`,
        title: parent?.title ? `${parent.title} · ${name}` : name,
        classId,
        due: task.due,
      })
    }
  }
  return items
}

async function sendMail(items) {
  const lines = items.map((item) => `• ${item.title} — ${item.classId} — ${prettyDue(item.due)}`)
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
  const res = await fetch(`https://formsubmit.co/ajax/${TO}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      _subject: subject,
      _template: 'box',
      _captcha: 'false',
      name: 'CIS Studio',
      email: TO,
      message: body,
    }),
  })
  return res.ok
}

exports.dueAssignmentMail = onSchedule(
  {
    schedule: '0 7 * * *',
    timeZone: 'Asia/Phnom_Penh',
    region: 'asia-southeast1',
  },
  async () => {
    const tomorrow = addIsoDays(phnomPenhIso(), 1)
    const users = await db.collection('users').listDocuments()
    for (const userRef of users) {
      const snap = await db.doc(`users/${userRef.id}/data/studio`).get()
      if (!snap.exists) continue
      const studio = snap.data() || {}
      const fresh = dueTomorrow(studio.workspaces, tomorrow).filter(
        (item) => (studio.dueMail || {})[item.key] !== item.due,
      )
      if (fresh.length === 0) continue
      const ok = await sendMail(fresh)
      if (!ok) continue
      const dueMail = { ...(studio.dueMail || {}) }
      for (const item of fresh) dueMail[item.key] = item.due
      await snap.ref.set({ dueMail }, { merge: true })
    }
  },
)
