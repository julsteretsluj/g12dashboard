import { useEffect, useState } from 'react'
import { loadWorkspace, saveWorkspace, type Workspace } from './workspace'

export function useWorkspace(classId?: string) {
  const [ws, setWs] = useState<Workspace>(() => loadWorkspace(classId ?? ''))

  useEffect(() => {
    if (!classId) return
    localStorage.removeItem(`cis-notes-${classId}`)
    setWs(loadWorkspace(classId))
  }, [classId])

  function update(next: Workspace) {
    if (!classId) return
    setWs(next)
    saveWorkspace(classId, next)
  }

  return { ws, update }
}
