import type { NodeFamily } from '../graph/types'

export const FAMILY_TOKENS: Record<NodeFamily, string> = {
  source: 'var(--y-signal-visual)',
  vision: 'var(--y-signal-visual)',
  control: 'var(--y-signal-data)',
  music: 'var(--y-signal-note)',
  synth: 'var(--y-signal-audio)',
  fx: 'var(--y-signal-audio)',
  out: 'var(--y-phosphor)',
}
