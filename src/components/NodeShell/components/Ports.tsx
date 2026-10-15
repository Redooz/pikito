import { Handle, Position } from '@xyflow/react'
import type { PortDef, PortKind } from '../../../graph/types'

export function Ports(props: { ports: PortDef[]; side: 'in' | 'out' }) {
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
