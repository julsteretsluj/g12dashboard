import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { DocItem, DocLocation, DocMoveTarget } from '../lib/workspace'
import { docLocationKey, newId } from '../lib/workspace'
import { deleteBlob, embedKind, embeddableUrl, getBlob, putBlob } from '../lib/files'

type Props = {
  items: DocItem[]
  onChange: (next: DocItem[]) => void
  addLabel?: string
  moveTargets?: DocMoveTarget[]
  onMove?: (item: DocItem, to: DocLocation) => void
}

export default function DocShelf({ items, onChange, addLabel = 'Add', moveTargets, onMove }: Props) {
  const [linkName, setLinkName] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [awaitingDoc, setAwaitingDoc] = useState(false)
  const [movingId, setMovingId] = useState<string | null>(null)
  const urlRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState<string | null>(null)
  const [blobUrls, setBlobUrls] = useState<Record<string, string>>({})

  useEffect(() => {
    let gone = false
    const created: string[] = []
    ;(async () => {
      const next: Record<string, string> = {}
      for (const item of items) {
        if (item.kind !== 'file' || !item.fileId) continue
        const blob = await getBlob(item.fileId)
        if (!blob || gone) continue
        const url = URL.createObjectURL(blob)
        created.push(url)
        next[item.id] = url
      }
      if (!gone) setBlobUrls(next)
    })()
    return () => {
      gone = true
      created.forEach((u) => URL.revokeObjectURL(u))
    }
  }, [items])

  async function addFile(file: File) {
    const fileId = newId()
    await putBlob(fileId, file)
    onChange([
      ...items,
      { id: newId(), name: file.name, kind: 'file', fileId, mime: file.type },
    ])
  }

  function addLink(e: FormEvent) {
    e.preventDefault()
    if (!linkUrl.trim()) return
    const href = linkUrl.startsWith('http') ? linkUrl.trim() : `https://${linkUrl.trim()}`
    onChange([
      ...items,
      { id: newId(), name: linkName.trim() || href, kind: 'link', href },
    ])
    setLinkName('')
    setLinkUrl('')
    setAwaitingDoc(false)
  }

  function startGoogleDoc() {
    window.open('https://docs.new', '_blank', 'noopener,noreferrer')
    if (!linkName.trim()) setLinkName('Google Doc')
    setAwaitingDoc(true)
    queueMicrotask(() => urlRef.current?.focus())
  }

  async function remove(item: DocItem) {
    if (item.fileId) await deleteBlob(item.fileId)
    onChange(items.filter((x) => x.id !== item.id))
  }

  return (
    <div>
      {items.length === 0 && <p className="meta">Nothing here yet.</p>}
      {items.map((item) => {
        const src =
          item.kind === 'link' && item.href
            ? embeddableUrl(item.href)
            : blobUrls[item.id]
        const isImage = item.mime?.startsWith('image/')
        return (
          <div key={item.id} className="doc-card">
            <div className="doc-row">
              <strong>{item.name}</strong>
              <span className="meta">{item.kind === 'link' ? 'link' : 'file'}</span>
              {item.href && (
                <a href={item.href} target="_blank" rel="noreferrer">
                  Open
                </a>
              )}
              {src && item.kind === 'file' && (
                <a href={src} download={item.name}>
                  Download
                </a>
              )}
              <button className="btn ghost" type="button" onClick={() => setOpen(open === item.id ? null : item.id)}>
                {open === item.id ? 'Hide' : 'Embed'}
              </button>
              {moveTargets && moveTargets.length > 0 && onMove && (
                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => setMovingId(movingId === item.id ? null : item.id)}
                >
                  Move
                </button>
              )}
              <button className="btn ghost" type="button" onClick={() => void remove(item)}>
                Remove
              </button>
            </div>
            {movingId === item.id && moveTargets && onMove && (
              <label className="doc-move">
                <span className="meta">Move to</span>
                <select
                  className="note-box"
                  value=""
                  onChange={(e) => {
                    const target = moveTargets.find((t) => docLocationKey(t.location) === e.target.value)
                    if (target) {
                      onMove(item, target.location)
                      setMovingId(null)
                    }
                  }}
                >
                  <option value="" disabled>
                    Choose destination…
                  </option>
                  {moveTargets.map((target) => (
                    <option key={docLocationKey(target.location)} value={docLocationKey(target.location)}>
                      {target.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {open === item.id && src && (
              <div className={`embed-frame ${embedKind(src, item.mime)}`}>
                {isImage ? (
                  <img alt={item.name} src={src} />
                ) : (
                  <iframe title={item.name} src={src} allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowFullScreen />
                )}
              </div>
            )}
          </div>
        )
      })}

      <form className="todo-add" onSubmit={addLink} style={{ marginTop: 10 }}>
        <input
          value={linkName}
          onChange={(e) => setLinkName(e.target.value)}
          placeholder={`${addLabel} link title`}
        />
        <input
          ref={urlRef}
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder={awaitingDoc ? 'Paste the Google Doc URL' : 'https://…'}
        />
        <button className="btn" type="submit">
          Embed link
        </button>
        <button className="btn ghost" type="button" onClick={startGoogleDoc}>
          New Google Doc
        </button>
      </form>
      {awaitingDoc && (
        <p className="meta doc-hint">
          A blank doc opened in Google. Copy the address from that tab, paste it above, then Embed link.
        </p>
      )}
      <label className="file-add">
        Upload a document
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void addFile(file)
            e.target.value = ''
          }}
        />
      </label>
    </div>
  )
}
