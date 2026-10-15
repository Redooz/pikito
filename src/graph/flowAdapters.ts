import type { Edge, Node, NodeChange } from '@xyflow/react'
import { getNodeDef } from './registry'
import { SIGNAL_TOKENS, type GraphEdge, type GraphNode } from './types'

export type FlowEdgeInput = GraphEdge

export function toFlowNodes(nodes: GraphNode[], selection: string[]): Node[] {
  return nodes.map((n) => ({
    id: n.id,
    type: 'device' as const,
    position: n.position,
    data: {},
    selected: selection.includes(n.id),
  }))
}

function tokenForEdge(nodes: GraphNode[], e: GraphEdge): string {
  const sourceNode = nodes.find((n) => n.id === e.source)
  const def = sourceNode ? getNodeDef(sourceNode.type) : undefined
  const kind = def?.outputs.find((p) => p.id === e.sourcePort)?.kind
  return kind && kind !== 'any' ? SIGNAL_TOKENS[kind] : 'var(--y-ink)'
}

export function toFlowEdges(edges: GraphEdge[], nodes: GraphNode[]): Edge[] {
  return edges.map((e) => ({
    id: e.id,
    type: 'schematic' as const,
    source: e.source,
    sourceHandle: e.sourcePort,
    target: e.target,
    targetHandle: e.targetPort,
    data: { token: tokenForEdge(nodes, e) },
  }))
}

export function reduceSelection(current: string[], changes: NodeChange[]): string[] {
  const set = new Set(current)
  for (const c of changes) {
    if (c.type === 'select') {
      if (c.selected) set.add(c.id)
      else set.delete(c.id)
    }
  }
  const next = [...set]
  const sameSize = next.length === current.length
  const allPresent = next.every((id) => current.includes(id))
  if (sameSize && allPresent) return current
  return next
}
