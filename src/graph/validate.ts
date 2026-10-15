import type { GraphEdge, PortKind } from './types'

export type ConnectionAttempt = {
  source: { nodeId: string; portId: string }
  target: { nodeId: string; portId: string }
}

export type PortKindResolver = (
  nodeId: string,
  portId: string,
  dir: 'out' | 'in',
) => PortKind | undefined

export type ConnectionFailure = 'self' | 'unknown-port' | 'incompatible' | 'input-occupied'

export type ConnectionVerdict = { ok: true } | { ok: false; reason: ConnectionFailure }

export function canConnect(out: PortKind, input: PortKind): boolean {
  if (out === 'any') return true
  if (input === 'any') return true
  return out === input
}

export function validateConnection(
  conn: ConnectionAttempt,
  ctx: { edges: GraphEdge[]; resolve: PortKindResolver },
): ConnectionVerdict {
  if (conn.source.nodeId === conn.target.nodeId) return { ok: false, reason: 'self' }
  const outKind = ctx.resolve(conn.source.nodeId, conn.source.portId, 'out')
  const inKind = ctx.resolve(conn.target.nodeId, conn.target.portId, 'in')
  if (outKind === undefined || inKind === undefined) return { ok: false, reason: 'unknown-port' }
  if (!canConnect(outKind, inKind)) return { ok: false, reason: 'incompatible' }
  const occupied = ctx.edges.some(
    (e) => e.target === conn.target.nodeId && e.targetPort === conn.target.portId,
  )
  if (occupied) return { ok: false, reason: 'input-occupied' }
  return { ok: true }
}
