import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import { defaultTimer, type StudioData } from './studio'
import { hydrateWorkspace } from './workspace'

export async function loadCloudStudio(uid: string): Promise<StudioData | null> {
  if (!db) return null
  const snap = await getDoc(doc(db, 'users', uid, 'data', 'studio'))
  if (!snap.exists()) return null
  const raw = snap.data() as Partial<StudioData>
  return {
    todo: (raw.todo ?? []).map((t) => ({ ...t, emoji: t.emoji ?? '' })),
    workspaces: Object.fromEntries(
      Object.entries(raw.workspaces ?? {}).map(([id, ws]) => [id, hydrateWorkspace(ws)]),
    ),
    timer: {
      ...defaultTimer(),
      ...raw.timer,
      minutes: Math.min(180, Math.max(1, Number(raw.timer?.minutes) || 25)),
    },
  }
}

export async function saveCloudStudio(uid: string, data: StudioData) {
  if (!db) return
  await setDoc(doc(db, 'users', uid, 'data', 'studio'), {
    todo: data.todo,
    workspaces: data.workspaces,
    timer: data.timer ?? defaultTimer(),
    updatedAt: Date.now(),
  })
}
