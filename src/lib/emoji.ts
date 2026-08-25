import { classes } from '../data/school'

export const emojiPalette = [
  '📌', '⭐', '🔥', '📝', '📚', '🧠', '✏️', '🎯',
  '✅', '⚠️', '💡', '🔬', '🧬', '🎨', '🛠️', '🗺️',
  '🐻', '📎', '🗓️', '📊', '🎧', '🌱', '🌙', '☀️',
  '🧪', '📖', '🧮', '🎬', '💬', '🗂️', '📍', '✨',
]

export function firstGrapheme(raw: string) {
  const t = raw.trim()
  if (!t) return ''
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    return [...seg.segment(t)][0]?.segment ?? ''
  }
  return [...t][0] ?? ''
}

export function subjectEmoji(classId: string, classEmoji?: string) {
  return classEmoji?.trim() || classes.find((c) => c.id === classId)?.emoji || '📘'
}
