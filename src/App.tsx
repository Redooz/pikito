import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Connection,
  type Edge,
  type EdgeTypes,
  type NodeTypes,
  type NodeChange,
  type Node,
} from '@xyflow/react'
import { useTranslation } from 'react-i18next'
import { useStore } from 'zustand'
import { graphStore } from './graph/store'
import { getNodeDef } from './graph/registry'
import { SIGNAL_TOKENS } from './graph/types'
import { DeviceNode } from './components/NodeShell'
import { SchematicEdge } from './components/SchematicEdge'
import { NodePicker } from './components/NodePicker'
import { Inspector } from './components/Inspector'
import { ContextMenu, type ContextMenuTarget, type MenuAction } from './components/ContextMenu'
import { TopBar } from './components/TopBar'
import { applyTheme, getTheme, type Theme } from './design/theme'
import type { MoveUpdate } from './graph/store'

const NODE_TYPES: NodeTypes = { device: DeviceNode }
const EDGE_TYPES: EdgeTypes = { schematic: SchematicEdge }

function Shell({ theme, setThemeState }: { theme: Theme; setThemeState: (t: Theme) => void }) {
  const { t } = useTranslation()
  const nodes = useStore(graphStore, (s) => s.nodes)
  const edges = useStore(graphStore, (s) => s.edges)
  const connect = useStore(graphStore, (s) => s.connect)
  const checkConnection = useStore(graphStore, (s) => s.checkConnection)
  const moveNodes = useStore(graphStore, (s) => s.moveNodes)
  const beginMove = useStore(graphStore, (s) => s.beginMove)
  const setSelection = useStore(graphStore, (s) => s.setSelection)
  const selection = useStore(graphStore, (s) => s.selection)
  const removeNodes = useStore(graphStore, (s) => s.removeNodes)
  const duplicateNodes = useStore(graphStore, (s) => s.duplicateNodes)
  const addNode = useStore(graphStore, (s) => s.addNode)
  const undo = useStore(graphStore, (s) => s.undo)
  const redo = useStore(graphStore, (s) => s.redo)
  const { screenToFlowPosition } = useReactFlow()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [ctxMenu, setCtxMenu] = useState<ContextMenuTarget | null>(null)

  const flowNodes = useMemo<Node[]>(
    () =>
      nodes.map((n) => ({
        id: n.id,
        type: 'device' as const,
        position: n.position,
        data: {},
        selected: selection.includes(n.id),
      })),
    [nodes, selection],
  )

  const flowEdges = useMemo<Edge[]>(
    () =>
      edges.map((e) => {
        const sourceNode = nodes.find((n) => n.id === e.source)
        const def = sourceNode ? getNodeDef(sourceNode.type) : undefined
        const kind = def?.outputs.find((p) => p.id === e.sourcePort)?.kind
        const token = kind && kind !== 'any' ? SIGNAL_TOKENS[kind] : 'var(--y-ink)'
        return {
          id: e.id,
          type: 'schematic',
          source: e.source,
          sourceHandle: e.sourcePort,
          target: e.target,
          targetHandle: e.targetPort,
          data: { token },
        }
      }),
    [edges, nodes],
  )

  const isValidConnection = useCallback(
    (conn: Connection | Edge) => {
      if (!conn.source || !conn.target || !conn.sourceHandle || !conn.targetHandle) return false
      return checkConnection({
        source: { nodeId: conn.source, portId: conn.sourceHandle },
        target: { nodeId: conn.target, portId: conn.targetHandle },
      }).ok
    },
    [checkConnection],
  )

  const onConnect = useCallback(
    (conn: Connection) => {
      if (!conn.source || !conn.target || !conn.sourceHandle || !conn.targetHandle) return
      connect({
        source: { nodeId: conn.source, portId: conn.sourceHandle },
        target: { nodeId: conn.target, portId: conn.targetHandle },
      })
    },
    [connect],
  )

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const moves: MoveUpdate[] = []
      for (const c of changes) {
        if (c.type === 'position' && 'position' in c && c.position) {
          moves.push({ id: c.id, position: c.position })
        }
      }
      if (moves.length > 0) moveNodes(moves)

      const geom = graphStore.getState().selection
      const set = new Set(geom)
      for (const c of changes) {
        if (c.type === 'select') {
          if (c.selected) set.add(c.id)
          else set.delete(c.id)
        }
      }
      const next = [...set]
      const before = [...geom]
      if (next.length !== before.length || next.some((id) => !before.includes(id))) {
        setSelection(next)
      }
    },
    [moveNodes, setSelection],
  )

  const onMenuAction = useCallback(
    (action: MenuAction) => {
      const menu = ctxMenu
      setCtxMenu(null)
      if (!menu) return
      const s = graphStore.getState()
      if (menu.kind === 'edge') {
        for (const id of menu.ids) s.disconnect(id)
        return
      }
      if (action === 'delete') {
        s.removeNodes(menu.ids)
        return
      }
      if (action === 'duplicate') {
        s.duplicateNodes(menu.ids)
        return
      }
      if (action === 'disconnect') {
        const ids = new Set(menu.ids)
        for (const e of s.edges) {
          if (ids.has(e.source) || ids.has(e.target)) s.disconnect(e.id)
        }
      }
    },
    [ctxMenu],
  )

  const onNodeContextMenu = useCallback(
    (e: React.MouseEvent, node: { id: string }) => {
      e.preventDefault()
      e.stopPropagation()
      const s = graphStore.getState()
      const sel = s.selection
      const ids = sel.includes(node.id) ? sel : [node.id]
      const idSet = new Set(ids)
      const hasEdges = s.edges.some((edge) => idSet.has(edge.source) || idSet.has(edge.target))
      setSelection(ids)
      setCtxMenu({ kind: 'node', ids, hasEdges, x: e.clientX, y: e.clientY })
    },
    [setSelection],
  )

  const onEdgeContextMenu = useCallback((e: React.MouseEvent, edge: { id: string }) => {
    e.preventDefault()
    e.stopPropagation()
    setCtxMenu({ kind: 'edge', ids: [edge.id], hasEdges: true, x: e.clientX, y: e.clientY })
  }, [])

  const onPaneContextMenu = useCallback((e: React.MouseEvent | MouseEvent) => {
    e.preventDefault()
    setCtxMenu(null)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName ?? ''
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement | null)?.isContentEditable
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && !typing) {
        e.preventDefault()
        setPickerOpen(true)
        return
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && !typing) {
        e.preventDefault()
        removeNodes(graphStore.getState().selection)
        return
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (typing) return
        e.preventDefault()
        if (e.shiftKey) redo()
        else undo()
        return
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        if (typing) return
        e.preventDefault()
        redo()
        return
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd' && !typing) {
        e.preventDefault()
        duplicateNodes(graphStore.getState().selection)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo, removeNodes, duplicateNodes])

  const addAtCenter = useCallback(
    (type: string) => {
      const pos = screenToFlowPosition({
        x: (window.innerWidth - 300) / 2 + (Math.random() - 0.5) * 120,
        y: (window.innerHeight - 44) / 2 + (Math.random() - 0.5) * 120,
      })
      addNode(type, { x: Math.round(pos.x / 8) * 8, y: Math.round(pos.y / 8) * 8 })
      setPickerOpen(false)
    },
    [addNode, screenToFlowPosition],
  )

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return (
    <div className="app">
      <TopBar
        theme={theme}
        onAddNode={() => setPickerOpen(true)}
        onToggleTheme={() => setThemeState(theme === 'dark' ? 'light' : 'dark')}
      />
      <div className="stage">
        <div className="canvas-wrap">
          <ReactFlow
            nodes={flowNodes}
            edges={flowEdges}
            nodeTypes={NODE_TYPES}
            edgeTypes={EDGE_TYPES}
            onNodesChange={onNodesChange}
            onConnect={onConnect}
            onNodeDragStart={() => beginMove()}
            onNodeContextMenu={onNodeContextMenu}
            onEdgeContextMenu={onEdgeContextMenu}
            onPaneContextMenu={onPaneContextMenu}
            onPaneClick={() => setCtxMenu(null)}
            isValidConnection={isValidConnection}
            deleteKeyCode={null}
            proOptions={{ hideAttribution: true }}
            panOnScroll
            zoomOnScroll={false}
            multiSelectionKeyCode="Control"
            panActivationKeyCode="Space"
            selectionKeyCode="Shift"
            snapToGrid
            snapGrid={[8, 8]}
            minZoom={0.3}
            maxZoom={2}
            defaultViewport={{ x: 40, y: 20, zoom: 1 }}
            connectionRadius={26}
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="var(--y-dots)" />
          </ReactFlow>
          <span className="leave type-micro" style={{ left: 12, top: 8 }}>
            {t('ui.app.emptyCanvas')}
          </span>
        </div>
        <Inspector />
      </div>
      <NodePicker open={pickerOpen} onClose={() => setPickerOpen(false)} onPick={addAtCenter} />
      {ctxMenu ? (
        <ContextMenu target={ctxMenu} onAction={onMenuAction} onClose={() => setCtxMenu(null)} />
      ) : null}
    </div>
  )
}

export default function App() {
  const [theme, setThemeState] = useState<Theme>(getTheme)
  return (
    <ReactFlowProvider>
      <Shell theme={theme} setThemeState={setThemeState} />
    </ReactFlowProvider>
  )
}
