import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
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
import { readLocalStudio, writeLocalStudio, type MoodBook, type StudioData, type TimerSettings, type TodoItem } from './studio'
import { emptyWorkspace, hydrateWorkspace, type Workspace } from './workspace'
import { nudgeDueMail } from './dueMail'

type AuthValue = {
  configured: boolean
  ready: boolean
  user: User | null
  studio: StudioData
  sync: 'local' | 'saving' | 'saved' | 'error'
  message: string
  signInEmail: (email: string, password: string) => Promise<void>
  createEmail: (email: string, password: string) => Promise<void>
  logOut: () => Promise<void>
  patchWorkspace: (classId: string, next: Workspace) => void
  patchTodo: (next: TodoItem[]) => void
  patchTimer: (next: TimerSettings) => void
  patchMoods: (next: MoodBook) => void
  patchProductivity: (next: MoodBook) => void
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
        const merged = cloud
          ? {
              ...cloud,
              dueMail: { ...local.dueMail, ...cloud.dueMail },
              moods: {
                keys: cloud.moods.keys.length ? cloud.moods.keys : local.moods.keys,
                days: { ...local.moods.days, ...cloud.moods.days },
              },
              productivity: {
                keys: cloud.productivity.keys.length ? cloud.productivity.keys : local.productivity.keys,
                days: { ...local.productivity.days, ...cloud.productivity.days },
              },
            }
          : local
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

  useEffect(() => {
    if (!ready) return
    let cancel = false
    async function tick() {
      try {
        const next = await nudgeDueMail(studioRef.current)
        if (!cancel && next) apply(next)
      } catch {
        /* mail host can be blocked; try again next open */
      }
    }
    void tick()
    const id = window.setInterval(tick, 30 * 60 * 1000)
    return () => {
      cancel = true
      window.clearInterval(id)
    }
  }, [apply, ready, user?.uid])

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

  const patchTimer = useCallback(
    (next: TimerSettings) => {
      apply({ ...studioRef.current, timer: next })
    },
    [apply],
  )

  const patchMoods = useCallback(
    (next: MoodBook) => {
      apply({ ...studioRef.current, moods: next })
    },
    [apply],
  )

  const patchProductivity = useCallback(
    (next: MoodBook) => {
      apply({ ...studioRef.current, productivity: next })
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
      patchTimer,
      patchMoods,
      patchProductivity,
    }),
    [message, patchMoods, patchProductivity, patchTimer, patchTodo, patchWorkspace, ready, studio, sync, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth needs AuthProvider')
  return ctx
}

export function workspaceOf(studio: StudioData, classId: string): Workspace {
  return studio.workspaces[classId] ? hydrateWorkspace(studio.workspaces[classId]) : emptyWorkspace()
}
