/** Normalize for answer checking: case, punctuation, spacing. */
export function normalizeAnswer(raw: string): string {
  return raw
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  const curr = new Array<number>(b.length + 1)
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost)
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j]
  }
  return prev[b.length]
}

/** True if guess matches any accepted form (case-insensitive, slight typos OK). */
export function answersMatch(guess: string, accepted: string[]): boolean {
  const g = normalizeAnswer(guess)
  if (!g) return false
  for (const raw of accepted) {
    const a = normalizeAnswer(raw)
    if (!a) continue
    if (g === a) return true
    if (g.includes(a) || a.includes(g)) {
      // Avoid tiny substring traps ("iris" inside something unrelated is fine; very short need exact-ish)
      if (Math.min(g.length, a.length) >= 4) return true
    }
    const maxDist = a.length <= 5 ? 1 : a.length <= 10 ? 2 : 3
    if (levenshtein(g, a) <= maxDist) return true
  }
  return false
}
