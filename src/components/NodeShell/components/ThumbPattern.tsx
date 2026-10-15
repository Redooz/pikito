import type { NodeFamily } from '../../../graph/types'

export function ThumbPattern({ family }: { family: NodeFamily }) {
  const common = { width: '100%', height: '100%', preserveAspectRatio: 'none' } as const
  switch (family) {
    case 'control':
    case 'out':
      return (
        <svg viewBox="0 0 100 40" {...common}>
          <rect x="4" y="10" width="46" height="4" fill="currentColor" />
          <rect x="4" y="20" width="72" height="4" fill="currentColor" />
          <rect x="4" y="30" width="30" height="4" fill="currentColor" />
        </svg>
      )
    case 'synth':
    case 'fx':
    case 'music':
      return (
        <svg viewBox="0 0 100 40" {...common}>
          <path
            d="M2 30 L14 30 L14 12 L30 12 L30 22 L46 22 L46 8 L60 8 L60 26 L76 26 L76 16 L98 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 100 40" {...common}>
          {Array.from({ length: 5 }).map((_, row) =>
            Array.from({ length: 12 }).map((__, col) => {
              const on = (row * 12 + col * 5) % 7 < 3
              return on ? (
                <rect
                  key={`${row}-${col}`}
                  x={4 + col * 8}
                  y={4 + row * 7}
                  width="4"
                  height="4"
                  fill="currentColor"
                />
              ) : null
            }),
          )}
        </svg>
      )
  }
}
