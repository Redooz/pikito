import type { ContextMenuTarget } from '../components/ContextMenu'
import type { MenuAction } from '../components/ContextMenu'
import type { GraphEdge } from '../graph/types'

interface MenuStoreSlice {
  edges: GraphEdge[]
  disconnect: (edgeId: string) => void
  removeNodes: (ids: string[]) => void
  duplicateNodes: (ids: string[]) => void
}

export function applyMenuAction(
  action: MenuAction,
  target: ContextMenuTarget,
  s: MenuStoreSlice,
): void {
  if (target.kind === 'edge') {
    for (const id of target.ids) s.disconnect(id)
    return
  }
  if (action === 'delete') {
    s.removeNodes(target.ids)
    return
  }
  if (action === 'duplicate') {
    s.duplicateNodes(target.ids)
    return
  }
  if (action === 'disconnect') {
    const ids = new Set(target.ids)
    for (const e of s.edges) {
      if (ids.has(e.source) || ids.has(e.target)) s.disconnect(e.id)
    }
  }
}

interface NodeSelectionSlice {
  edges: GraphEdge[]
  selection: string[]
  setSelection: (ids: string[]) => void
}

export function nodeMenuTarget(
  nodeId: string,
  s: NodeSelectionSlice,
  x: number,
  y: number,
): ContextMenuTarget {
  const ids = s.selection.includes(nodeId) ? s.selection : [nodeId]
  const idSet = new Set(ids)
  const hasEdges = s.edges.some((edge) => idSet.has(edge.source) || idSet.has(edge.target))
  if (!s.selection.includes(nodeId)) s.setSelection(ids)
  return { kind: 'node', ids, hasEdges, x, y }
}
