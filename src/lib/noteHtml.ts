const ALLOW = new Set(['P', 'BR', 'DIV', 'B', 'STRONG', 'I', 'EM', 'U', 'UL', 'OL', 'LI', 'H2', 'H3', 'BLOCKQUOTE'])

export function escapeText(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function looksLikeHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value)
}

export function toNoteHtml(value: string) {
  if (!value.trim()) return ''
  if (looksLikeHtml(value)) return sanitizeNoteHtml(value)
  return value
    .split('\n')
    .map((line) => `<p>${escapeText(line) || '<br>'}</p>`)
    .join('')
}

export function stripNoteHtml(value: string) {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

export function sanitizeNoteHtml(html: string) {
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html')
  const root = doc.body.firstElementChild
  if (!root) return ''
  scrub(root)
  return root.innerHTML
}

function scrub(node: Element) {
  ;[...node.childNodes].forEach((child) => {
    if (child.nodeType === Node.COMMENT_NODE) {
      child.remove()
      return
    }
    if (child.nodeType === Node.TEXT_NODE) return
    if (!(child instanceof Element)) {
      child.remove()
      return
    }
    if (child.tagName === 'SCRIPT' || child.tagName === 'STYLE') {
      child.remove()
      return
    }
    scrub(child)
    if (!ALLOW.has(child.tagName)) {
      child.replaceWith(...[...child.childNodes])
      return
    }
    ;[...child.attributes].forEach((attr) => child.removeAttribute(attr.name))
  })
}
