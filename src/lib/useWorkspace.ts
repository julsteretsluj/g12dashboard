import { useAuth, workspaceOf } from './AuthContext'
import { emptyWorkspace, type Workspace } from './workspace'

export function useWorkspace(classId?: string) {
  const { studio, patchWorkspace } = useAuth()
  const ws = classId ? workspaceOf(studio, classId) : emptyWorkspace()

  function update(next: Workspace) {
    if (!classId) return
    patchWorkspace(classId, next)
  }

  return { ws, update }
}
