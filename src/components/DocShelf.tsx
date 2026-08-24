import { useEffect, useState, type FormEvent } from 'react'
import type { DocItem } from '../lib/workspace'
import { newId } from '../lib/workspace'
import { deleteBlob, embedKind, embeddableUrl, getBlob, putBlob } from '../lib/files'

type Props = {
  items: DocItem[]
  onChange: (next: DocItem[]) => void
  addLabel?: string
}

export default function DocShelf({ items, onChange, addLabel = 'Add' }: Props) {
  const [linkName, setLinkName] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
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
              <button className="btn ghost" type="button" onClick={() => void remove(item)}>
                Remove
              </button>
            </div>
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
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="https://…"
        />
        <button className="btn" type="submit">
          Embed link
        </button>
      </form>
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
