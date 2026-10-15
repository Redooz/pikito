import { useCallback, useState } from 'react'
import { graphStore } from '../graph/store'
import type { ContextMenuTarget } from '../components/ContextMenu'
import type { MenuAction } from '../components/ContextMenu'
import { applyMenuAction, nodeMenuTarget } from './menuActions'

export interface ContextMenuApi {
  target: ContextMenuTarget | null
  openNodeMenu: (e: React.MouseEvent, node: { id: string }) => void
  openEdgeMenu: (e: React.MouseEvent, edge: { id: string }) => void
  close: () => void
  act: (action: MenuAction) => void
}

export function useContextMenu(): ContextMenuApi {
  const [target, setTarget] = useState<ContextMenuTarget | null>(null)

  const openNodeMenu = useCallback((e: React.MouseEvent, node: { id: string }) => {
    e.preventDefault()
    e.stopPropagation()
    const s = graphStore.getState()
    setTarget(nodeMenuTarget(node.id, s, e.clientX, e.clientY))
  }, [])

  const openEdgeMenu = useCallback((e: React.MouseEvent, edge: { id: string }) => {
    e.preventDefault()
    e.stopPropagation()
    setTarget({ kind: 'edge', ids: [edge.id], hasEdges: true, x: e.clientX, y: e.clientY })
  }, [])

  const close = useCallback(() => setTarget(null), [])

  const act = useCallback(
    (action: MenuAction) => {
      if (target) applyMenuAction(action, target, graphStore.getState())
      setTarget(null)
    },
    [target],
  )

  return { target, openNodeMenu, openEdgeMenu, close, act }
}
