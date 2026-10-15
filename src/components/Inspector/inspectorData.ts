import { getNodeDef } from '../../graph/registry'
import type { GraphNode, NodeDef } from '../../graph/types'

export interface ResolvedSelection {
  node: GraphNode
  def: NodeDef
}

export function resolveSelected(
  nodes: GraphNode[],
  selection: string[],
): ResolvedSelection | undefined {
  const id = selection[0]
  if (!id) return undefined
  const node = nodes.find((n) => n.id === id)
  if (!node) return undefined
  const def = getNodeDef(node.type)
  if (!def) return undefined
  return { node, def }
}
