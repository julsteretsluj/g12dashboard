import { useEffect, useState } from 'react'

function FlipDigit({ value }: { value: string }) {
  const [shown, setShown] = useState(value)
  const [outgoing, setOutgoing] = useState<string | null>(null)

  useEffect(() => {
    if (value === shown) return
    setOutgoing(shown)
    const start = window.setTimeout(() => setShown(value), 180)
    const end = window.setTimeout(() => setOutgoing(null), 420)
    return () => {
      window.clearTimeout(start)
      window.clearTimeout(end)
    }
  }, [value, shown])

  return (
    <span className={`flip-digit ${outgoing ? 'is-flipping' : ''}`}>
      <span className="flip-half flip-top">
        <span>{shown}</span>
      </span>
      <span className="flip-half flip-bottom">
        <span>{shown}</span>
      </span>
      {outgoing != null && (
        <span className="flip-leaf" aria-hidden>
          <span className="flip-half flip-top">
            <span>{outgoing}</span>
          </span>
        </span>
      )}
    </span>
  )
}

export function FlipBoard({
  value,
  size = 'lg',
}: {
  value: string
  size?: 'lg' | 'sm'
}) {
  return (
    <div className={`flip-board flip-${size}`} aria-label={value}>
      {value.split('').map((ch, i) =>
        ch === ':' ? (
          <span className="flip-colon" key={`${i}-colon`}>
            :
          </span>
        ) : (
          <FlipDigit key={i} value={ch} />
        ),
      )}
    </div>
  )
}

export function PixelLcd({ value }: { value: string }) {
  return (
    <div className="pixel-lcd" aria-label={value}>
      {value}
    </div>
  )
}
