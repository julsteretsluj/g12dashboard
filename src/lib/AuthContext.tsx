import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { loadCloudStudio, saveCloudStudio } from './cloud'
import { auth, firebaseReady } from './firebase'
import { readLocalStudio, writeLocalStudio, type StudioData, type TodoItem } from './studio'
import { emptyWorkspace, type Workspace } from './workspace'

type AuthValue = {
  configured: boolean
  ready: boolean
  user: User | null
  studio: StudioData
  sync: 'local' | 'saving' | 'saved' | 'error'
  message: string
  signInGoogle: () => Promise<void>
  signInEmail: (email: string, password: string) => Promise<void>
  createEmail: (email: string, password: string) => Promise<void>
  logOut: () => Promise<void>
  patchWorkspace: (classId: string, next: Workspace) => void
  patchTodo: (next: TodoItem[]) => void
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(!firebaseReady)
  const [studio, setStudio] = useState<StudioData>(() => readLocalStudio())
  const [sync, setSync] = useState<AuthValue['sync']>('local')
  const [message, setMessage] = useState('')
  const studioRef = useRef(studio)
  const timer = useRef<number | null>(null)
  studioRef.current = studio

  const pushCloud = useCallback((uid: string, data: StudioData) => {
    if (timer.current) window.clearTimeout(timer.current)
    setSync('saving')
    timer.current = window.setTimeout(() => {
      saveCloudStudio(uid, data)
        .then(() => {
          setSync('saved')
          setMessage('')
        })
        .catch((err: Error) => {
          setSync('error')
          setMessage(err.message)
        })
    }, 450)
  }, [])

  useEffect(() => {
    if (!auth) return
    return onAuthStateChanged(auth, async (next) => {
      setUser(next)
      if (!next) {
        setStudio(readLocalStudio())
        setSync('local')
        setReady(true)
        return
      }
      try {
        const cloud = await loadCloudStudio(next.uid)
        const local = readLocalStudio()
        const merged = cloud ?? local
        if (!cloud) await saveCloudStudio(next.uid, local)
        writeLocalStudio(merged)
        setStudio(merged)
        setSync('saved')
        setMessage('')
      } catch (err) {
        setSync('error')
        setMessage(err instanceof Error ? err.message : 'Could not load cloud desk')
        setStudio(readLocalStudio())
      } finally {
        setReady(true)
      }
    })
  }, [])

  const apply = useCallback(
    (next: StudioData) => {
      setStudio(next)
      writeLocalStudio(next)
      if (user) pushCloud(user.uid, next)
      else setSync('local')
    },
    [pushCloud, user],
  )

  const patchWorkspace = useCallback(
    (classId: string, next: Workspace) => {
      apply({
        ...studioRef.current,
        workspaces: { ...studioRef.current.workspaces, [classId]: next },
      })
    },
    [apply],
  )

  const patchTodo = useCallback(
    (next: TodoItem[]) => {
      apply({ ...studioRef.current, todo: next })
    },
    [apply],
  )

  const fail = (err: unknown) => {
    setMessage(err instanceof Error ? err.message : 'Sign-in failed')
  }

  const value = useMemo<AuthValue>(
    () => ({
      configured: firebaseReady,
      ready,
      user,
      studio,
      sync,
      message,
      signInGoogle: async () => {
        if (!auth) return
        try {
          await signInWithPopup(auth, new GoogleAuthProvider())
        } catch (err) {
          fail(err)
        }
      },
      signInEmail: async (email, password) => {
        if (!auth) return
        try {
          await signInWithEmailAndPassword(auth, email, password)
        } catch (err) {
          fail(err)
        }
      },
      createEmail: async (email, password) => {
        if (!auth) return
        try {
          await createUserWithEmailAndPassword(auth, email, password)
        } catch (err) {
          fail(err)
        }
      },
      logOut: async () => {
        if (!auth) return
        await signOut(auth)
      },
      patchWorkspace,
      patchTodo,
    }),
    [message, patchTodo, patchWorkspace, ready, studio, sync, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth needs AuthProvider')
  return ctx
}

export function workspaceOf(studio: StudioData, classId: string): Workspace {
  return studio.workspaces[classId] ?? emptyWorkspace()
}
