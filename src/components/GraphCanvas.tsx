import { useCallback, useMemo } from 'react'
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  type Connection,
  type Edge,
  type EdgeTypes,
  type NodeTypes,
  type NodeChange,
} from '@xyflow/react'
import { useTranslation } from 'react-i18next'
import { useStore } from 'zustand'
import { graphStore, type MoveUpdate } from '../graph/store'
import { reduceSelection, toFlowEdges, toFlowNodes } from '../graph/flowAdapters'
import { DeviceNode } from './NodeShell'
import { SchematicEdge } from './SchematicEdge'
import { ContextMenu } from './ContextMenu'
import { useContextMenu } from '../hooks/useContextMenu'

const NODE_TYPES: NodeTypes = { device: DeviceNode }
const EDGE_TYPES: EdgeTypes = { schematic: SchematicEdge }

export function GraphCanvas() {
  const { t } = useTranslation()
  const nodes = useStore(graphStore, (s) => s.nodes)
  const edges = useStore(graphStore, (s) => s.edges)
  const connect = useStore(graphStore, (s) => s.connect)
  const checkConnection = useStore(graphStore, (s) => s.checkConnection)
  const moveNodes = useStore(graphStore, (s) => s.moveNodes)
  const beginMove = useStore(graphStore, (s) => s.beginMove)
  const setSelection = useStore(graphStore, (s) => s.setSelection)
  const selection = useStore(graphStore, (s) => s.selection)

  const flowNodes = useMemo(() => toFlowNodes(nodes, selection), [nodes, selection])
  const flowEdges = useMemo(() => toFlowEdges(edges, nodes), [edges, nodes])

  const menu = useContextMenu()

  const toAttempt = (conn: Connection | Edge) => {
    if (!conn.source || !conn.target || !conn.sourceHandle || !conn.targetHandle) return null
    return {
      source: { nodeId: conn.source, portId: conn.sourceHandle },
      target: { nodeId: conn.target, portId: conn.targetHandle },
    }
  }

  const isValidConnection = useCallback(
    (conn: Connection | Edge) => {
      const attempt = toAttempt(conn)
      return attempt ? checkConnection(attempt).ok : false
    },
    [checkConnection],
  )

  const onConnect = useCallback(
    (conn: Connection) => {
      const attempt = toAttempt(conn)
      if (attempt) connect(attempt)
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

      const prev = graphStore.getState().selection
      const next = reduceSelection(prev, changes)
      if (next !== prev) setSelection(next)
    },
    [moveNodes, setSelection],
  )

  return (
    <div className="canvas-wrap">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        onNodeDragStart={() => beginMove()}
        onNodeContextMenu={menu.openNodeMenu}
        onEdgeContextMenu={menu.openEdgeMenu}
        onPaneContextMenu={(e: React.MouseEvent | MouseEvent) => {
          e.preventDefault()
          menu.close()
        }}
        onPaneClick={menu.close}
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
      {menu.target ? <ContextMenu target={menu.target} onAction={menu.act} onClose={menu.close} /> : null}
    </div>
  )
}
