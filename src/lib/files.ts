const DB = 'cis-studio'
const STORE = 'files'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function putBlob(id: string, blob: Blob) {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(blob, id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getBlob(id: string): Promise<Blob | null> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(id)
    req.onsuccess = () => resolve((req.result as Blob | undefined) ?? null)
    req.onerror = () => reject(req.error)
  })
}

export async function deleteBlob(id: string) {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export function embedKind(url: string, mime?: string): 'video' | 'doc' | 'image' | 'wide' {
  if (mime?.startsWith('image/')) return 'image'
  if (mime === 'application/pdf') return 'doc'
  try {
    const u = new URL(url)
    const host = u.hostname
    if (host.includes('youtube.com') || host === 'youtu.be' || host.includes('vimeo.com')) {
      return 'video'
    }
    if (
      host.includes('docs.google.com') ||
      host.includes('drive.google.com') ||
      host.includes('onedrive') ||
      host.includes('sharepoint') ||
      url.endsWith('.pdf')
    ) {
      return 'doc'
    }
  } catch {
    /* keep wide */
  }
  return 'wide'
}

export function embeddableUrl(url: string) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${u.pathname}`
    }
    if (u.hostname.includes('docs.google.com')) {
      if (u.pathname.includes('/edit')) return url.replace(/\/edit.*$/, '/preview')
      if (u.pathname.includes('/view')) return url.replace(/\/view.*$/, '/preview')
    }
    const drive = u.pathname.match(/\/file\/d\/([^/]+)/)
    if (u.hostname.includes('drive.google.com') && drive) {
      return `https://drive.google.com/file/d/${drive[1]}/preview`
    }
    return url
  } catch {
    return url
  }
}
