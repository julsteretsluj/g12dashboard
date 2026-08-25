import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { StudioData } from './studio'

export async function loadCloudStudio(uid: string): Promise<StudioData | null> {
  if (!db) return null
  const snap = await getDoc(doc(db, 'users', uid, 'data', 'studio'))
  if (!snap.exists()) return null
  const raw = snap.data() as StudioData
  return {
    todo: raw.todo ?? [],
    workspaces: raw.workspaces ?? {},
  }
}

export async function saveCloudStudio(uid: string, data: StudioData) {
  if (!db) return
  await setDoc(doc(db, 'users', uid, 'data', 'studio'), {
    todo: data.todo,
    workspaces: data.workspaces,
    updatedAt: Date.now(),
  })
}
