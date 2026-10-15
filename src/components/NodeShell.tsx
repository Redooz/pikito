import { useState, memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { useTranslation } from 'react-i18next'
import { useStore } from 'zustand'
import { graphStore } from '../graph/store'
import { getNodeDef } from '../graph/registry'
import { HelpPopover } from './HelpPopover'
import { FAMILY_TOKENS } from './familyTokens'
import type { NodeDef, NodeFamily, PortDef, PortKind } from '../graph/types'

function formatValue(v: number | string, step?: number): string {
  if (typeof v === 'string') return v
  const decimals = step && step < 1 ? String(step).split('.')[1]?.length ?? 0 : 0
  return v.toFixed(Math.min(decimals, 3))
}

function Ports(props: { ports: Array<PortDef>; side: 'in' | 'out' }) {
  const { ports, side } = props
  return (
    <>
      {ports.map((p, i) => (
        <Handle
          key={p.id}
          id={p.id}
          type={side === 'in' ? 'target' : 'source'}
          position={side === 'in' ? Position.Left : Position.Right}
          className={p.kind === 'any' ? 'drop kind-any' : `drop kind-${p.kind as PortKind}`}
          style={{ top: `${((i + 1) / (ports.length + 1)) * 100}%` }}
        />
      ))}
    </>
  )
}

function ThumbPattern({ family }: { family: NodeFamily }) {
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

export const DeviceNode = memo(function DeviceNode({ id, selected }: NodeProps) {
  const { t } = useTranslation()
  const node = useStore(graphStore, (s) => s.nodes.find((n) => n.id === id))
  const [helpOpen, setHelpOpen] = useState(false)
  const def: NodeDef | undefined = node ? getNodeDef(node.type) : undefined
  if (!node || !def) return null

  const firstParam = def.params[0]
  const readout = firstParam && node.params[firstParam.id] !== undefined ? formatValue(node.params[firstParam.id] as number, firstParam.step) : undefined

  return (
    <div className={`device-node ${selected ? 'is-selected' : ''}`} data-node={def.type}>
      <Ports ports={def.inputs} side="in" />
      <div className="head">
        <span className="tab" style={{ background: FAMILY_TOKENS[def.family] }} />
        <span className="code">{def.code}</span>
        <span className="name">{t(def.nameKey)}</span>
        <button
          className={`btn-i ${helpOpen ? 'on' : ''}`}
          onClick={() => setHelpOpen((v) => !v)}
          aria-expanded={helpOpen}
          aria-label={t('ui.inspector.info')}
        >
          i
        </button>
      </div>
      <div className="lcd">
        <ThumbPattern family={def.family} />
        <span className="type-lcd">{readout ?? t('ui.status.fake')}</span>
      </div>
      <div className="foot">
        <span>{t(`ui.families.${def.family}`)}</span>
        <span className="val">{readout ?? '---'}</span>
      </div>
      {helpOpen ? <HelpPopover def={def} /> : null}
      <Ports ports={def.outputs} side="out" />
    </div>
  )
})
